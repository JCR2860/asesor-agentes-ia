import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const user = await currentUser();
        const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;

        if (!user || !isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await clerkClient();
        
        let totalUsers = 0;
        let totalPurchased = 0;
        let totalGifted = 0;
        let totalCurrentCredits = 0;
        
        // Accumulators for specific packs (count of packs, not tokens)
        let packs25 = 0;
        let packs50 = 0;
        let packs100 = 0;

        let offset = 0;
        const limit = 500;
        let hasMore = true;

        while (hasMore) {
            const userList = await client.users.getUserList({
                limit: limit,
                offset: offset,
            });

            for (const u of userList.data) {
                const metadata = u.publicMetadata as any;
                totalPurchased += Number(metadata.totalPurchased || 0);
                totalGifted += Number(metadata.totalGifted || 0);
                totalCurrentCredits += Number(metadata.credits || 0);

                // Sum specific packs
                packs25 += Number(metadata.purchased_pack_25 || 0);
                packs50 += Number(metadata.purchased_pack_50 || 0);
                packs100 += Number(metadata.purchased_pack_100 || 0);
            }

            totalUsers = userList.totalCount;
            offset += userList.data.length;

            if (userList.data.length < limit || offset >= totalUsers) {
                hasMore = false;
            }
        }

        return NextResponse.json({
            totalUsers,
            totalPurchased,
            totalGifted,
            totalCurrentCredits,
            packs: {
                25: packs25,
                50: packs50,
                100: packs100
            }
        });
    } catch (error: any) {
        console.error("[STATS_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
