import { NextResponse } from 'next/server';
import { currentUser, clerkClient } from '@clerk/nextjs/server';

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

        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
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
        const creditsToAdd = Number(codeData.credits);

        if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
            return NextResponse.json({ success: false, error: "Este código parece corrupto." }, { status: 400 });
        }

        // Sumar créditos al usuario llamante
        const currentCredits = typeof user.publicMetadata.credits === 'number' ? user.publicMetadata.credits : 0;

        await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
                ...user.publicMetadata,
                credits: currentCredits + creditsToAdd,
            }
        });

        // Eliminar el código del administrador (marcarlo como consumido y borrarlo de la lista)
        const updatedCodes = [...adminCodes];
        updatedCodes.splice(codeIndex, 1);

        await client.users.updateUserMetadata(adminUser.id, {
            privateMetadata: {
                ...adminUser.privateMetadata,
                codes: updatedCodes
            }
        });

        console.log(`[REDEEM_SUCCESS] El usuario ${user.primaryEmailAddress?.emailAddress} ha canjeado el código ${code} (+${creditsToAdd} consultas). Eliminado de DB.`);

        return NextResponse.json({
            success: true,
            added: creditsToAdd
        }, { status: 200 });

    } catch (error: any) {
        console.error("[REDEEM_ERROR]", error);
        return NextResponse.json({ success: false, error: "Error interno del servidor al procesar el código." }, { status: 500 });
    }
}
