import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
    try {
        const user = await currentUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Determine the absolute base URL of the incoming request
        const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        // Read the requested plan
        const body = await req.json().catch(() => ({}));
        const planId = body.plan || "pack-50";

        // Configure plan details
        let name = "Pack Profesional - 50 Consultas IA";
        let unit_amount = 1990; // 19.90 EUR

        if (planId === "pack-10") {
            name = "Pack Básico - 10 Consultas IA";
            unit_amount = 490; // 4.90 EUR
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            // For testing, we hardcode the product creation inside the checkout session
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: name,
                            description: "Acceso inmediato a tus Agentes Especializados",
                        },
                        unit_amount: unit_amount,
                    },
                    quantity: 1,
                },
            ],
            // Add metadata so we know who corresponds to this payment when it finishes
            metadata: {
                userId: user.id,
                plan: planId,
            },
            success_url: `${origin}/?success=true`,
            cancel_url: `${origin}/?canceled=true`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        return NextResponse.json({ error: "Internal Error", details: (error as any)?.message }, { status: 500 });
    }
}
