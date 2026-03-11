import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key_for_build", {
    apiVersion: '2026-02-25.clover',
});

export async function POST(req: Request) {
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error("[WEBHOOK_ERROR] STRIPE_WEBHOOK_SECRET no está definido. Añádelo en las variables de entorno (.env.local o Vercel).");
            return new NextResponse('Webhook configuration error', { status: 400 });
        }

        event = stripe.webhooks.constructEvent(
            payload,
            signature as string,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error: any) {
        console.error(`[WEBHOOK_ERROR] ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        // Recuperar el ID del usuario y el plan que envió el checkout
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
            let creditsToAdd = 0;
            if (plan === 'pack-25') creditsToAdd = 25;
            if (plan === 'pack-50') creditsToAdd = 50;
            if (plan === 'pack-100') creditsToAdd = 100;

            if (creditsToAdd > 0) {
                try {
                    const client = await clerkClient();
                    const user = await client.users.getUser(userId);

                    // Obtener los créditos actuales, si no existen se asume 0
                    const currentCredits = typeof user.publicMetadata.credits === 'number'
                        ? user.publicMetadata.credits
                        : 0;

                    // Actualizar el metadata del usuario en Clerk sumando los créditos comprados
                    await client.users.updateUserMetadata(userId, {
                        publicMetadata: {
                            ...user.publicMetadata,
                            credits: currentCredits + creditsToAdd,
                        },
                    });

                    console.log(`[WEBHOOK_SUCCESS] Se añadieron ${creditsToAdd} créditos al usuario ${userId}`);
                } catch (error) {
                    console.error(`[CLERK_UPDATE_ERROR] Error actualizando créditos:`, error);
                    return new NextResponse('Error update user in Clerk', { status: 500 });
                }
            }
        }
    }

    return new NextResponse('OK', { status: 200 });
}
