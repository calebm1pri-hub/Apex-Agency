import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { trackEvent } from "@/lib/klaviyo";
import type { CartLine } from "@/types";

export async function POST(req: Request) {
  try {
    const { lines, email } = (await req.json()) as {
      lines: CartLine[];
      email?: string;
      promo?: string;
    };
    if (!lines?.length) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }
    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    // Fire the "started checkout" event for abandoned-cart flows.
    if (email) await trackEvent("started_checkout", email, { lines });

    const result = await createCheckoutSession(lines, origin);
    return NextResponse.json(result);
  } catch (err) {
    console.error("checkout error", err);
    return NextResponse.json(
      { message: "Checkout failed. Please try again." },
      { status: 500 }
    );
  }
}
