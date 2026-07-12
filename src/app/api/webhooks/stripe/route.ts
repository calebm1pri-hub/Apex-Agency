import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { trackEvent } from "@/lib/klaviyo";
import { triggerZap } from "@/lib/zapier";

/**
 * Stripe webhook. On checkout.session.completed we fire the post-purchase
 * email flow and notify fulfillment/creator automations. Set STRIPE_WEBHOOK_SECRET
 * and configure the endpoint in your Stripe dashboard to go live.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    console.warn("[stub] Stripe webhook received but not configured.");
    return NextResponse.json({ received: true, demo: true });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig as string, secret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { customer_details?: { email?: string }; amount_total?: number };
    const email = session.customer_details?.email;
    if (email) await trackEvent("placed_order", email, { amount: session.amount_total });
    await triggerZap("new_order", { email, amount: session.amount_total });
  }

  return NextResponse.json({ received: true });
}
