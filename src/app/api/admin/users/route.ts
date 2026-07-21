import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

// Devuelve la lista de usuarios registrados (email + saldo mostrado) para que el
// admin pueda localizarlos fácilmente por email. El saldo detallado por bolsas se
// consulta al seleccionar el usuario (endpoint /api/admin/credits).
export async function GET() {
    try {
        const user = await currentUser();
        const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;
        if (!user || !isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await clerkClient();
        const list = await client.users.getUserList({ limit: 200, orderBy: "-created_at" });

        const users = (list.data || []).map((u) => ({
            email: u.primaryEmailAddress?.emailAddress || null,
            name: [u.firstName, u.lastName].filter(Boolean).join(" ") || null,
            credits: typeof u.publicMetadata?.credits === 'number' ? u.publicMetadata.credits : 0,
        })).filter((u) => u.email);

        return NextResponse.json({ users, total: list.totalCount ?? users.length });
    } catch (error) {
        console.error("[ADMIN_USERS]", error);
        return NextResponse.json({ error: "Error interno." }, { status: 500 });
    }
}
