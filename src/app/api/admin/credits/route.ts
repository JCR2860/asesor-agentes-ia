import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { getCreditsDB, setCreditsDB } from "@/lib/credits";

async function requireAdmin() {
    const user = await currentUser();
    const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;
    if (!user || !isAdmin) return null;
    return user;
}

// GET ?email=...  → busca al usuario y devuelve su saldo actual.
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
        const dbResult = await getCreditsDB(target.id, clerkCredits);
        const credits = dbResult.db && dbResult.ok ? dbResult.credits : clerkCredits;

        return NextResponse.json({
            userId: target.id,
            email: target.primaryEmailAddress?.emailAddress,
            name: [target.firstName, target.lastName].filter(Boolean).join(" ") || null,
            credits,
            source: dbResult.db ? "db" : "clerk"
        });
    } catch (error) {
        console.error("[ADMIN_CREDITS_GET]", error);
        return NextResponse.json({ error: "Error interno." }, { status: 500 });
    }
}

// POST { email, credits } → fija el saldo del usuario (BD como autoridad + espejo en Clerk).
export async function POST(req: Request) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { email, credits } = await req.json();
        const cleanEmail = email?.toString().trim().toLowerCase();
        const newValue = Math.max(0, Math.trunc(Number(credits)));

        if (!cleanEmail || isNaN(newValue)) {
            return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
        }

        const client = await clerkClient();
        const found = await client.users.getUserList({ emailAddress: [cleanEmail] });
        const target = found.data?.[0];
        if (!target) {
            return NextResponse.json({ error: "No se encontró ningún usuario con ese email." }, { status: 404 });
        }

        const clerkCredits = typeof target.publicMetadata?.credits === 'number' ? target.publicMetadata.credits : 0;

        // Fijar en la BD (autoridad). Si no está disponible, seguimos con Clerk.
        const dbNew = await setCreditsDB(target.id, newValue, clerkCredits);
        const finalCredits = dbNew !== null ? dbNew : newValue;

        // Reflejar en Clerk para la interfaz.
        await client.users.updateUserMetadata(target.id, {
            publicMetadata: { ...target.publicMetadata, credits: finalCredits }
        });

        return NextResponse.json({ success: true, credits: finalCredits, source: dbNew !== null ? "db" : "clerk" });
    } catch (error) {
        console.error("[ADMIN_CREDITS_POST]", error);
        return NextResponse.json({ error: "Error interno." }, { status: 500 });
    }
}
