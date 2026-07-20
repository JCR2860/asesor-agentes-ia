import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

// Los códigos de regalo caducan a los 3 días de su creación.
export const CODE_TTL_MS = 3 * 24 * 60 * 60 * 1000;
const isCodeExpired = (c: any, now = Date.now()) =>
    typeof c?.createdAt === 'number' && (now - c.createdAt) > CODE_TTL_MS;

export async function GET() {
    try {
        const user = await currentUser();
        const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;

        if (!user || !isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const allCodes: any[] = Array.isArray(user.privateMetadata?.codes) ? user.privateMetadata.codes : [];
        const validCodes = allCodes.filter((c) => !isCodeExpired(c));

        // Si hay caducados, limpiamos la lista almacenada de forma automática.
        if (validCodes.length !== allCodes.length) {
            try {
                const client = await clerkClient();
                await client.users.updateUserMetadata(user.id, {
                    privateMetadata: { ...user.privateMetadata, codes: validCodes }
                });
            } catch (e) {
                console.error("[CODES_PURGE_ERROR]", e);
            }
        }

        // Añadimos expiresAt para que el panel muestre el tiempo restante.
        const codes = validCodes.map((c) => ({
            ...c,
            expiresAt: typeof c.createdAt === 'number' ? c.createdAt + CODE_TTL_MS : null
        }));

        return NextResponse.json({ codes });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;

        if (!user || !isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code, credits } = await req.json();

        if (!code || !credits) {
            return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
        }

        const currentCodes: any[] = Array.isArray(user.privateMetadata?.codes) ? user.privateMetadata.codes : [];

        // Check if code already exists
        if (currentCodes.find((c: any) => c.code === code)) {
            return NextResponse.json({ error: "El código ya existe." }, { status: 400 });
        }

        const newCodes = [
            ...currentCodes,
            { code: code.toUpperCase(), credits: Number(credits), createdAt: Date.now() }
        ];

        const client = await clerkClient();
        await client.users.updateUserMetadata(user.id, {
            privateMetadata: {
                ...user.privateMetadata,
                codes: newCodes
            }
        });

        return NextResponse.json({ success: true, codes: newCodes });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await currentUser();
        const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;

        if (!user || !isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code } = await req.json();

        const currentCodes: any[] = Array.isArray(user.privateMetadata?.codes) ? user.privateMetadata.codes : [];
        const newCodes = currentCodes.filter((c: any) => c.code !== code);

        const client = await clerkClient();
        await client.users.updateUserMetadata(user.id, {
            privateMetadata: {
                ...user.privateMetadata,
                codes: newCodes
            }
        });

        return NextResponse.json({ success: true, codes: newCodes });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
