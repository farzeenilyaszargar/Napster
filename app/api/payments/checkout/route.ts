import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getSiteUrl } from "@/lib/site-url";

type CheckoutRequest = {
  plan?: "starter_30" | "pro_60";
};

const planToPriceEnv: Record<NonNullable<CheckoutRequest["plan"]>, string> = {
  starter_30: "NEXT_PUBLIC_STRIPE_PRICE_30",
  pro_60: "NEXT_PUBLIC_STRIPE_PRICE_60",
};

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  return new Stripe(secretKey);
}

export async function POST(request: Request) {
  let body: CheckoutRequest;

  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const plan = body.plan;
  if (!plan || !(plan in planToPriceEnv)) {
    return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
  }

  const priceEnv = planToPriceEnv[plan];
  const priceId = process.env[priceEnv];
  if (!priceId) {
    return NextResponse.json(
      { error: `Missing ${priceEnv} environment variable.` },
      { status: 500 }
    );
  }

  try {
    const stripe = getStripeClient();
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/payments?status=success`,
      cancel_url: `${siteUrl}/payments?status=cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    if (!session.url) {
      return NextResponse.json({ error: "Unable to create checkout session." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
