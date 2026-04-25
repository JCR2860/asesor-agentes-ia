import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
    const user = await currentUser();
    const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;

    if (!user || !isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
        keys: Object.keys(process.env).filter(k => k.includes('STRIPE')),
        webhookHasValue: !!process.env.STRIPE_WEBHOOK_SECRET
    });
}
