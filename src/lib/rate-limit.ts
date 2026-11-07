// ─────────────────────────────────────────────────────────────
//  Límite de peticiones (ventana fija) para endpoints abiertos, como el soporte.
//  Usa la base de datos Neon (contadores atómicos compartidos por todas las
//  instancias) y, si no está disponible, un contador en memoria de respaldo.
//  Privacidad: para visitantes se guarda solo un hash de la IP y un contador,
//  nunca contenido; las filas antiguas se borran solas.
// ─────────────────────────────────────────────────────────────
import { neon } from "@neondatabase/serverless";
import { createHash } from "crypto";

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql = DATABASE_URL ? neon(DATABASE_URL) : null;
let schemaReady = false;

export type RateResult = { ok: boolean; remaining: number; retryAfterSec: number };

async function ensureSchema() {
    if (!sql || schemaReady) return;
    await sql`
        CREATE TABLE IF NOT EXISTS rate_limits (
            key          TEXT PRIMARY KEY,
            window_start TIMESTAMPTZ NOT NULL,
            count        INTEGER NOT NULL
        )
    `;
    schemaReady = true;
}

// Respaldo en memoria (por instancia) si la base de datos no está disponible.
const memory = new Map<string, { start: number; count: number }>();
function memoryHit(key: string, limit: number, windowSec: number): RateResult {
    const now = Date.now();
    const cur = memory.get(key);
    const entry = !cur || now - cur.start >= windowSec * 1000 ? { start: now, count: 1 } : { start: cur.start, count: cur.count + 1 };
    memory.set(key, entry);
    if (memory.size > 5000) for (const [k, v] of memory) if (now - v.start > 86400000) memory.delete(k);
    return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count), retryAfterSec: Math.ceil((entry.start + windowSec * 1000 - now) / 1000) };
}

/** Registra un intento para `key` y dice si está dentro del límite (`limit` por `windowSec`). */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<RateResult> {
    if (!sql) return memoryHit(key, limit, windowSec);
    try {
        await ensureSchema();
        const rows = await sql`
            INSERT INTO rate_limits (key, window_start, count) VALUES (${key}, now(), 1)
            ON CONFLICT (key) DO UPDATE SET
                count = CASE WHEN rate_limits.window_start <= now() - (${windowSec} * INTERVAL '1 second') THEN 1 ELSE rate_limits.count + 1 END,
                window_start = CASE WHEN rate_limits.window_start <= now() - (${windowSec} * INTERVAL '1 second') THEN now() ELSE rate_limits.window_start END
            RETURNING count, EXTRACT(EPOCH FROM (window_start + (${windowSec} * INTERVAL '1 second') - now())) AS retry
        `;
        // Limpieza ocasional de contadores caducados.
        if (Math.random() < 0.02) sql`DELETE FROM rate_limits WHERE window_start < now() - INTERVAL '2 days'`.catch(() => {});
        const count = Number(rows[0]?.count) || 1;
        return { ok: count <= limit, remaining: Math.max(0, limit - count), retryAfterSec: Math.max(1, Math.ceil(Number(rows[0]?.retry) || windowSec)) };
    } catch (e) {
        console.error("[RATE_LIMIT] error, uso respaldo en memoria:", (e as Error).message);
        return memoryHit(key, limit, windowSec);
    }
}

/** Identificador anónimo del visitante: hash de su IP (no se guarda la IP). */
export function visitorKey(req: Request): string {
    const fwd = req.headers.get("x-forwarded-for") || "";
    const ip = fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "desconocida";
    const salt = process.env.RATE_LIMIT_SALT || process.env.CLERK_SECRET_KEY || "lexia";
    return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
