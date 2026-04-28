import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const user = await currentUser();
        const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;

        if (!user || !isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // We use the admin's public metadata to store global app config
        const config = user.publicMetadata?.appConfig as any || { isMaintenanceMode: false };
        return NextResponse.json({ config });
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

        const { isMaintenanceMode } = await req.json();

        const client = await clerkClient();
        await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
                ...user.publicMetadata,
                appConfig: {
                    isMaintenanceMode: !!isMaintenanceMode
                }
            }
        });

        return NextResponse.json({ success: true, isMaintenanceMode });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
