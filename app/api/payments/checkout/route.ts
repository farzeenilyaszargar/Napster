import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CheckoutRequest = {
  plan?: "starter_30" | "pro_60";
};

const planToAmount: Record<NonNullable<CheckoutRequest["plan"]>, number> = {
  starter_30: 3000,
  pro_60: 6000,
};

function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;
  const currency = process.env.RAZORPAY_CURRENCY || process.env.NEXT_PUBLIC_RAZORPAY_CURRENCY || "INR";

  if (!keyId) {
    throw new Error("Missing RAZORPAY_KEY_ID (or NEXT_PUBLIC_RAZORPAY_KEY_ID).");
  }

  if (!keySecret) {
    throw new Error("Missing RAZORPAY_KEY_SECRET.");
  }

  return { keyId, keySecret, currency };
}

export async function POST(request: Request) {
  let body: CheckoutRequest;

  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const plan = body.plan;
  if (!plan || !(plan in planToAmount)) {
    return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
  }

  try {
    const { keyId, keySecret, currency } = getRazorpayConfig();
    const amount = planToAmount[plan];

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: `nap_${plan}_${Date.now()}`,
      }),
    });

    const responseText = await razorpayResponse.text();
    const orderPayload = responseText
      ? (JSON.parse(responseText) as { id?: string; error?: { description?: string } })
      : ({} as { id?: string; error?: { description?: string } });
    if (!razorpayResponse.ok || !orderPayload.id) {
      const message = orderPayload.error?.description || "Unable to create Razorpay order.";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({
      key: keyId,
      amount,
      currency,
      orderId: orderPayload.id,
      name: "nap",
      description: plan === "starter_30" ? "Starter Plan" : "Pro Plan",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create Razorpay order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
