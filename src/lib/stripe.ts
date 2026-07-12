import Stripe from "stripe";
import type { CartLine } from "@/types";

/**
 * Stripe adapter. When STRIPE_SECRET_KEY is absent the app runs in demo mode:
 * createCheckoutSession returns a stub so the UI works end-to-end without keys.
 * Add your key + price data and remove the guard to go live.
 */
const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key
  ? new Stripe(key, { apiVersion: "2025-08-27.basil" })
  : null;

export interface CheckoutResult {
  url: string | null;
  demo: boolean;
  message?: string;
}

export async function createCheckoutSession(
  lines: CartLine[],
  origin: string
): Promise<CheckoutResult> {
  if (!stripe) {
    console.warn("[stub] STRIPE_SECRET_KEY missing — returning demo checkout.");
    return {
      url: null,
      demo: true,
      message:
        "Demo mode: add STRIPE_SECRET_KEY to .env.local to enable live payments.",
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lines.map((l) => ({
      quantity: l.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(l.price * 100),
        product_data: { name: l.name, images: l.image ? [l.image] : [] },
      },
    })),
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
    success_url: `${origin}/account?order=success`,
    cancel_url: `${origin}/cart`,
    automatic_tax: { enabled: true },
  });

  return { url: session.url, demo: false };
}
