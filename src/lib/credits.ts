// ─────────────────────────────────────────────────────────────
//  Gestión de créditos con base de datos (Neon Postgres)
//
//  Dos "bolsas" por usuario:
//    - credits       → créditos COMPRADOS (o ajustados por admin): NUNCA caducan.
//    - gift_credits  → créditos de REGALO (canje de código): caducan a los 3 días
//                      desde el canje (gift_expires_at).
//
//  Saldo efectivo = credits + (gift_credits si no ha caducado).
//  Al gastar se consumen PRIMERO los de regalo (para que no se pierdan).
//
//  La BD es la AUTORIDAD; Clerk (publicMetadata.credits) guarda una COPIA del
//  saldo efectivo solo para que la interfaz lo muestre sin cambios en el cliente.
//  Red de seguridad: si la BD no está configurada o falla, se devuelve { db:false }
//  y el llamante usa la lógica antigua basada en Clerk.
// ─────────────────────────────────────────────────────────────
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Días de validez de los créditos de regalo desde su canje.
export const GIFT_TTL_DAYS = 3;

let schemaReady = false;

async function ensureSchema(): Promise<void> {
    if (!sql || schemaReady) return;
    await sql`
        CREATE TABLE IF NOT EXISTS user_credits (
            user_id         TEXT PRIMARY KEY,
            credits         INTEGER NOT NULL DEFAULT 0,
            gift_credits    INTEGER NOT NULL DEFAULT 0,
            gift_expires_at TIMESTAMPTZ,
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    `;
    // Para tablas creadas por una versión anterior (solo con 'credits'):
    await sql`ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS gift_credits INTEGER NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS gift_expires_at TIMESTAMPTZ`;
    schemaReady = true;
}

async function ensureUserRow(userId: string, clerkFallback: number): Promise<void> {
    if (!sql) return;
    await ensureSchema();
    // El saldo previo de Clerk se considera COMPRADO (permanente): nadie pierde nada.
    await sql`
        INSERT INTO user_credits (user_id, credits)
        VALUES (${userId}, ${Math.max(0, Math.trunc(clerkFallback) || 0)})
        ON CONFLICT (user_id) DO NOTHING
    `;
}

// Saldo efectivo de una fila (regalo válido solo si no ha caducado).
function effective(row: any): number {
    if (!row) return 0;
    const credits = Number(row.credits) || 0;
    const gift = Number(row.gift_credits) || 0;
    const exp = row.gift_expires_at ? new Date(row.gift_expires_at).getTime() : 0;
    const giftValid = gift > 0 && exp > Date.now() ? gift : 0;
    return credits + giftValid;
}

export type CreditResult =
    | { db: true; ok: boolean; credits: number }
    | { db: false };

/** Lee el saldo efectivo (comprados + regalo no caducado). */
export async function getCreditsDB(userId: string, clerkFallback: number): Promise<CreditResult> {
    if (!sql) return { db: false };
    try {
        await ensureUserRow(userId, clerkFallback);
        const rows = await sql`SELECT credits, gift_credits, gift_expires_at FROM user_credits WHERE user_id = ${userId}`;
        return { db: true, ok: true, credits: effective(rows[0]) };
    } catch (e) {
        console.error('[CREDITS_DB] getCredits error:', e);
        return { db: false };
    }
}

/**
 * Descuenta `cost` créditos de forma ATÓMICA, consumiendo primero los de regalo
 * (no caducados) y luego los comprados. ok=false = saldo insuficiente.
 * Devuelve el saldo efectivo resultante.
 */
export async function deductCreditsDB(userId: string, cost: number, clerkFallback: number): Promise<CreditResult> {
    if (!sql) return { db: false };
    try {
        await ensureUserRow(userId, clerkFallback);
        // validGift = gift solo si no ha caducado. Se resta gift primero y luego credits.
        const rows = await sql`
            UPDATE user_credits SET
                gift_credits = (CASE WHEN gift_expires_at IS NULL OR gift_expires_at <= now() THEN 0 ELSE gift_credits END)
                    - LEAST((CASE WHEN gift_expires_at IS NULL OR gift_expires_at <= now() THEN 0 ELSE gift_credits END), ${cost}),
                credits = credits - GREATEST(0, ${cost} - (CASE WHEN gift_expires_at IS NULL OR gift_expires_at <= now() THEN 0 ELSE gift_credits END)),
                updated_at = now()
            WHERE user_id = ${userId}
                AND (credits + (CASE WHEN gift_expires_at IS NULL OR gift_expires_at <= now() THEN 0 ELSE gift_credits END)) >= ${cost}
            RETURNING credits, gift_credits, gift_expires_at
        `;
        if (rows.length === 0) {
            const cur = await sql`SELECT credits, gift_credits, gift_expires_at FROM user_credits WHERE user_id = ${userId}`;
            return { db: true, ok: false, credits: effective(cur[0]) };
        }
        return { db: true, ok: true, credits: effective(rows[0]) };
    } catch (e) {
        console.error('[CREDITS_DB] deduct error:', e);
        return { db: false };
    }
}

/** Suma créditos COMPRADOS (permanentes). Para el webhook de Stripe. */
export async function addPurchasedCreditsDB(userId: string, amount: number, clerkFallback: number): Promise<CreditResult> {
    if (!sql) return { db: false };
    try {
        await ensureUserRow(userId, clerkFallback);
        const rows = await sql`
            UPDATE user_credits
            SET credits = credits + ${amount}, updated_at = now()
            WHERE user_id = ${userId}
            RETURNING credits, gift_credits, gift_expires_at
        `;
        return { db: true, ok: true, credits: effective(rows[0]) };
    } catch (e) {
        console.error('[CREDITS_DB] addPurchased error:', e);
        return { db: false };
    }
}

/**
 * Suma créditos de REGALO (canje de código). Caducan a los GIFT_TTL_DAYS días.
 * Si aún quedaban créditos de regalo válidos, se acumulan y se renueva la ventana
 * de caducidad a partir de ahora (el nuevo canje refresca el plazo del conjunto).
 */
export async function addGiftCreditsDB(userId: string, amount: number, clerkFallback: number): Promise<CreditResult> {
    if (!sql) return { db: false };
    try {
        await ensureUserRow(userId, clerkFallback);
        const rows = await sql`
            UPDATE user_credits SET
                gift_credits = (CASE WHEN gift_expires_at IS NULL OR gift_expires_at <= now() THEN 0 ELSE gift_credits END) + ${amount},
                gift_expires_at = now() + (${GIFT_TTL_DAYS} * INTERVAL '1 day'),
                updated_at = now()
            WHERE user_id = ${userId}
            RETURNING credits, gift_credits, gift_expires_at
        `;
        return { db: true, ok: true, credits: effective(rows[0]) };
    } catch (e) {
        console.error('[CREDITS_DB] addGift error:', e);
        return { db: false };
    }
}

export type CreditBreakdown =
    | { db: true; purchased: number; gift: number; giftExpiresAt: string | null; effective: number }
    | { db: false };

/** Devuelve el desglose por bolsas (comprados / regalo válido / caducidad). */
export async function getCreditsBreakdownDB(userId: string, clerkFallback: number): Promise<CreditBreakdown> {
    if (!sql) return { db: false };
    try {
        await ensureUserRow(userId, clerkFallback);
        const rows = await sql`SELECT credits, gift_credits, gift_expires_at FROM user_credits WHERE user_id = ${userId}`;
        const row = rows[0];
        const purchased = Number(row?.credits) || 0;
        const rawGift = Number(row?.gift_credits) || 0;
        const exp = row?.gift_expires_at ? new Date(row.gift_expires_at).getTime() : 0;
        const giftValid = rawGift > 0 && exp > Date.now();
        const gift = giftValid ? rawGift : 0;
        return {
            db: true,
            purchased,
            gift,
            giftExpiresAt: giftValid ? new Date(exp).toISOString() : null,
            effective: purchased + gift
        };
    } catch (e) {
        console.error('[CREDITS_DB] breakdown error:', e);
        return { db: false };
    }
}

/**
 * Ajuste manual de admin por bolsas: fija los COMPRADOS (permanentes) y los de
 * REGALO por separado. Si se ponen créditos de regalo (>0), su ventana de
 * caducidad se reinicia a GIFT_TTL_DAYS días desde ahora. Devuelve el saldo
 * efectivo o null si la BD no está disponible.
 */
export async function setCreditBucketsDB(
    userId: string,
    purchased: number,
    gift: number,
    clerkFallback: number
): Promise<number | null> {
    if (!sql) return null;
    try {
        await ensureUserRow(userId, clerkFallback);
        const p = Math.max(0, Math.trunc(purchased) || 0);
        const g = Math.max(0, Math.trunc(gift) || 0);
        const rows = g > 0
            ? await sql`
                UPDATE user_credits
                SET credits = ${p}, gift_credits = ${g},
                    gift_expires_at = now() + (${GIFT_TTL_DAYS} * INTERVAL '1 day'),
                    updated_at = now()
                WHERE user_id = ${userId}
                RETURNING credits, gift_credits, gift_expires_at`
            : await sql`
                UPDATE user_credits
                SET credits = ${p}, gift_credits = 0, gift_expires_at = NULL, updated_at = now()
                WHERE user_id = ${userId}
                RETURNING credits, gift_credits, gift_expires_at`;
        return effective(rows[0]);
    } catch (e) {
        console.error('[CREDITS_DB] setBuckets error:', e);
        return null;
    }
}
