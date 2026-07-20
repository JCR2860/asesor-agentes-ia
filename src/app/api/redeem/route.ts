import { NextResponse } from 'next/server';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import { addCreditsDB } from '@/lib/credits';

// Los códigos de regalo caducan a los 3 días de su creación.
const CODE_TTL_MS = 3 * 24 * 60 * 60 * 1000;
const isCodeExpired = (c: any, now = Date.now()) =>
    typeof c?.createdAt === 'number' && (now - c.createdAt) > CODE_TTL_MS;

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

        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) {
            return NextResponse.json({ success: false, error: "El sistema de códigos no está configurado (falta ADMIN_EMAIL)." }, { status: 500 });
        }

        // Buscar al administrador y sus códigos generados
        const client = await clerkClient();
        const adminUsers = await client.users.getUserList({ emailAddress: [adminEmail] });

        if (!adminUsers.data || adminUsers.data.length === 0) {
            return NextResponse.json({ success: false, error: "Error de configuración de administrador." }, { status: 500 });
        }

        const adminUser = adminUsers.data[0];
        const adminCodes: any[] = Array.isArray(adminUser.privateMetadata?.codes) ? adminUser.privateMetadata.codes : [];

        // Buscar el código
        const codeIndex = adminCodes.findIndex((c: any) => c.code === code);

        if (codeIndex === -1) {
            return NextResponse.json({ success: false, error: "El código insertado no existe, no es válido o ya fue usado." }, { status: 404 });
        }

        const codeData = adminCodes[codeIndex];

        // Rechazar (y eliminar) si el código ha caducado
        if (isCodeExpired(codeData)) {
            const cleaned = adminCodes.filter((c: any) => c.code !== code && !isCodeExpired(c));
            await client.users.updateUserMetadata(adminUser.id, {
                privateMetadata: { ...adminUser.privateMetadata, codes: cleaned }
            });
            return NextResponse.json({ success: false, error: "Este código ha caducado. Los códigos de regalo solo son válidos durante 3 días. Solicita uno nuevo." }, { status: 410 });
        }

        const creditsToAdd = Number(codeData.credits);

        if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
            return NextResponse.json({ success: false, error: "Este código parece corrupto." }, { status: 400 });
        }

        // Sumar créditos al usuario llamante y trackear total regalado
        const currentCredits = typeof user.publicMetadata.credits === 'number' ? user.publicMetadata.credits : 0;
        const currentTotalGifted = typeof user.publicMetadata.totalGifted === 'number' ? user.publicMetadata.totalGifted : 0;

        // Sumar en la base de datos (autoridad); si falla, cálculo sobre Clerk (red de seguridad).
        const added = await addCreditsDB(user.id, creditsToAdd, currentCredits);
        const newCredits = added.db && added.ok ? added.credits : currentCredits + creditsToAdd;

        await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
                ...user.publicMetadata,
                credits: newCredits,
                totalGifted: currentTotalGifted + creditsToAdd,
            }
        });

        // Eliminar el código consumido y, de paso, purgar los que hayan caducado
        const updatedCodes = adminCodes.filter((c: any) => c.code !== code && !isCodeExpired(c));

        await client.users.updateUserMetadata(adminUser.id, {
            privateMetadata: {
                ...adminUser.privateMetadata,
                codes: updatedCodes
            }
        });

        // Zero-Log: no registramos datos personales del usuario en los logs del servidor.
        console.log(`[REDEEM_SUCCESS] Código canjeado (+${creditsToAdd} consultas). Eliminado de la lista.`);

        return NextResponse.json({
            success: true,
            added: creditsToAdd
        }, { status: 200 });

    } catch (error: any) {
        console.error("[REDEEM_ERROR]", error);
        return NextResponse.json({ success: false, error: "Error interno del servidor al procesar el código." }, { status: 500 });
    }
}
