// ─────────────────────────────────────────────────────────────
//  Gestión de créditos con base de datos (Neon Postgres)
//
//  La base de datos es la AUTORIDAD para la corrección (descuento atómico,
//  imposible gastar de más aunque lleguen peticiones simultáneas).
//  Se mantiene una COPIA en Clerk (publicMetadata.credits) solo para que la
//  interfaz siga mostrando el saldo sin cambios en el cliente.
//
//  Red de seguridad: si la BD no está configurada o falla, todas las funciones
//  devuelven { db: false } y el llamante usa la lógica antigua basada en Clerk.
//  Así, un fallo de BD nunca deja la app peor que antes.
// ─────────────────────────────────────────────────────────────
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// Cliente SQL (o null si no hay conexión configurada).
const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

let schemaReady = false;

async function ensureSchema(): Promise<void> {
    if (!sql || schemaReady) return;
    await sql`
        CREATE TABLE IF NOT EXISTS user_credits (
            user_id     TEXT PRIMARY KEY,
            credits     INTEGER NOT NULL DEFAULT 0,
            updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    `;
    schemaReady = true;
}

// Inserta la fila del usuario si no existe todavía, tomando como saldo inicial
// el que tuviera en Clerk (migración perezosa: cada usuario se migra la primera
// vez que la BD lo toca, sin traslado masivo).
async function ensureUserRow(userId: string, clerkFallback: number): Promise<void> {
    if (!sql) return;
    await ensureSchema();
    await sql`
        INSERT INTO user_credits (user_id, credits)
        VALUES (${userId}, ${Math.max(0, Math.trunc(clerkFallback) || 0)})
        ON CONFLICT (user_id) DO NOTHING
    `;
}

export type CreditResult =
    | { db: true; ok: boolean; credits: number }
    | { db: false };

/** Lee el saldo actual del usuario (migrando desde Clerk si es su primera vez). */
export async function getCreditsDB(userId: string, clerkFallback: number): Promise<CreditResult> {
    if (!sql) return { db: false };
    try {
        await ensureUserRow(userId, clerkFallback);
        const rows = await sql`SELECT credits FROM user_credits WHERE user_id = ${userId}`;
        const credits = rows[0]?.credits ?? 0;
        return { db: true, ok: true, credits: Number(credits) };
    } catch (e) {
        console.error('[CREDITS_DB] getCredits error:', e);
        return { db: false };
    }
}

/**
 * Descuenta `cost` créditos de forma ATÓMICA: solo resta si hay saldo suficiente,
 * en una única operación. Cierra la condición de carrera de peticiones simultáneas.
 * ok=false significa saldo insuficiente.
 */
export async function deductCreditsDB(userId: string, cost: number, clerkFallback: number): Promise<CreditResult> {
    if (!sql) return { db: false };
    try {
        await ensureUserRow(userId, clerkFallback);
        const rows = await sql`
            UPDATE user_credits
            SET credits = credits - ${cost}, updated_at = now()
            WHERE user_id = ${userId} AND credits >= ${cost}
            RETURNING credits
        `;
        if (rows.length === 0) {
            // No se cumplió la condición de saldo suficiente.
            const cur = await sql`SELECT credits FROM user_credits WHERE user_id = ${userId}`;
            return { db: true, ok: false, credits: Number(cur[0]?.credits ?? 0) };
        }
        return { db: true, ok: true, credits: Number(rows[0].credits) };
    } catch (e) {
        console.error('[CREDITS_DB] deduct error:', e);
        return { db: false };
    }
}

/** Suma `amount` créditos (compras, canje de códigos). */
export async function addCreditsDB(userId: string, amount: number, clerkFallback: number): Promise<CreditResult> {
    if (!sql) return { db: false };
    try {
        await ensureUserRow(userId, clerkFallback);
        const rows = await sql`
            UPDATE user_credits
            SET credits = credits + ${amount}, updated_at = now()
            WHERE user_id = ${userId}
            RETURNING credits
        `;
        return { db: true, ok: true, credits: Number(rows[0]?.credits ?? 0) };
    } catch (e) {
        console.error('[CREDITS_DB] add error:', e);
        return { db: false };
    }
}

/**
 * Ajuste manual de admin: fija el saldo a `newValue` (nunca negativo).
 * Devuelve el nuevo saldo o null si la BD no está disponible.
 */
export async function setCreditsDB(userId: string, newValue: number, clerkFallback: number): Promise<number | null> {
    if (!sql) return null;
    try {
        await ensureUserRow(userId, clerkFallback);
        const safe = Math.max(0, Math.trunc(newValue) || 0);
        const rows = await sql`
            UPDATE user_credits
            SET credits = ${safe}, updated_at = now()
            WHERE user_id = ${userId}
            RETURNING credits
        `;
        return Number(rows[0]?.credits ?? safe);
    } catch (e) {
        console.error('[CREDITS_DB] set error:', e);
        return null;
    }
}
