import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        keys: Object.keys(process.env).filter(k => k.includes('STRIPE')),
        webhookHasValue: !!process.env.STRIPE_WEBHOOK_SECRET
    });
}
