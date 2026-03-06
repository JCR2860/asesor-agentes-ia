import { NextResponse } from 'next/server';
import { currentUser, clerkClient } from '@clerk/nextjs/server';

// Esta es la "base de datos" simple de códigos alojada en memoria temporal.
// En un sistema de gran escala esto viviría en una base de datos real (MongoDB, Supabase, Postgres...).
// FORMATO: "CODIGO_A_CANJEAR": { creditos: NUMERO, usado: BOOLEANO, email_asociado: STRING }
const REDEEM_CODES: Record<string, { credits: number, used: boolean, usedBy?: string }> = {
    // Aquí puedes añadir o borrar códigos promocionales a tu antojo
    "AEQUITAS-VIP-10": { credits: 10, used: false },
    "AEQUITAS-VIP-50": { credits: 50, used: false },
    "PRUEBA-TESTER": { credits: 5, used: false },
    "CONGRESO-LEGAL-2026": { credits: 20, used: false }
};

export async function POST(req: Request) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "No autorizado. Inicia sesión primero." }, { status: 401 });
        }

        const body = await req.json();
        const code = body.code?.toString().trim().toUpperCase();

        if (!code) {
            return NextResponse.json({ success: false, error: "El código no puede estar vacío." }, { status: 400 });
        }

        const codeData = REDEEM_CODES[code];

        if (!codeData) {
            return NextResponse.json({ success: false, error: "El código insertado no existe o no es válido." }, { status: 404 });
        }

        if (codeData.used) {
            return NextResponse.json({ success: false, error: "Este código ya ha sido canjeado anteriormente." }, { status: 400 });
        }

        // Marcar el código localmente como usado para que no se re-utilice
        codeData.used = true;
        codeData.usedBy = user.primaryEmailAddress?.emailAddress;

        // Sumar créditos a Clerk
        const client = await clerkClient();
        const currentCredits = typeof user.publicMetadata.credits === 'number' ? user.publicMetadata.credits : 0;

        await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
                ...user.publicMetadata,
                credits: currentCredits + codeData.credits,
            }
        });

        // Registrar en los logs internos
        console.log(`[REDEEM] El usuario ${user.primaryEmailAddress?.emailAddress} ha canjeado el código ${code} (+${codeData.credits} consultas)`);

        return NextResponse.json({
            success: true,
            added: codeData.credits
        }, { status: 200 });

    } catch (error: any) {
        console.error("[REDEEM_ERROR]", error);
        return NextResponse.json({ success: false, error: "Error interno del servidor." }, { status: 500 });
    }
}
