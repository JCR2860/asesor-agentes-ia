import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const user = await currentUser();
        const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

        if (!user || !isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const codes = user.privateMetadata?.codes || [];
        return NextResponse.json({ codes });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

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
        const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

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
