import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { getCreditsBreakdownDB, setCreditBucketsDB } from "@/lib/credits";

async function requireAdmin() {
    const user = await currentUser();
    const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;
    if (!user || !isAdmin) return null;
    return user;
}

// GET ?email=...  → busca al usuario y devuelve su desglose de saldo (comprado / regalo).
export async function GET(req: Request) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email")?.trim().toLowerCase();
        if (!email) {
            return NextResponse.json({ error: "Falta el email." }, { status: 400 });
        }

        const client = await clerkClient();
        const found = await client.users.getUserList({ emailAddress: [email] });
        const target = found.data?.[0];
        if (!target) {
            return NextResponse.json({ error: "No se encontró ningún usuario con ese email." }, { status: 404 });
        }

        const clerkCredits = typeof target.publicMetadata?.credits === 'number' ? target.publicMetadata.credits : 0;
        const b = await getCreditsBreakdownDB(target.id, clerkCredits);

        return NextResponse.json({
            userId: target.id,
            email: target.primaryEmailAddress?.emailAddress,
            name: [target.firstName, target.lastName].filter(Boolean).join(" ") || null,
            purchased: b.db ? b.purchased : clerkCredits,
            gift: b.db ? b.gift : 0,
            giftExpiresAt: b.db ? b.giftExpiresAt : null,
            effective: b.db ? b.effective : clerkCredits,
            source: b.db ? "db" : "clerk"
        });
    } catch (error) {
        console.error("[ADMIN_CREDITS_GET]", error);
        return NextResponse.json({ error: "Error interno." }, { status: 500 });
    }
}

// POST { email, purchased, gift } → fija ambas bolsas (BD autoridad + espejo en Clerk).
export async function POST(req: Request) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { email, purchased, gift } = await req.json();
        const cleanEmail = email?.toString().trim().toLowerCase();
        const p = Math.max(0, Math.trunc(Number(purchased)));
        const g = Math.max(0, Math.trunc(Number(gift)));

        if (!cleanEmail || isNaN(p) || isNaN(g)) {
            return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
        }

        const client = await clerkClient();
        const found = await client.users.getUserList({ emailAddress: [cleanEmail] });
        const target = found.data?.[0];
        if (!target) {
            return NextResponse.json({ error: "No se encontró ningún usuario con ese email." }, { status: 404 });
        }

        const clerkCredits = typeof target.publicMetadata?.credits === 'number' ? target.publicMetadata.credits : 0;

        // Fijar ambas bolsas en la BD (autoridad). Si no está disponible, usamos la suma.
        const dbEffective = await setCreditBucketsDB(target.id, p, g, clerkCredits);
        const finalEffective = dbEffective !== null ? dbEffective : p + g;

        // Reflejar el saldo efectivo en Clerk para la interfaz.
        await client.users.updateUserMetadata(target.id, {
            publicMetadata: { ...target.publicMetadata, credits: finalEffective }
        });

        return NextResponse.json({
            success: true,
            purchased: p,
            gift: g,
            effective: finalEffective,
            source: dbEffective !== null ? "db" : "clerk"
        });
    } catch (error) {
        console.error("[ADMIN_CREDITS_POST]", error);
        return NextResponse.json({ error: "Error interno." }, { status: 500 });
    }
}
