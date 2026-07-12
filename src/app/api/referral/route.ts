import { NextResponse } from "next/server";
import { getReferralInfo } from "@/lib/referral";
import { getSupabaseAdmin } from "@/lib/supabase";

/** GET a user's referral info (code + stats). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") ?? "guest";
  return NextResponse.json(getReferralInfo(userId));
}

/** POST a redemption event (friend ordered with a code). */
export async function POST(req: Request) {
  const { code, orderId } = await req.json().catch(() => ({}));
  if (!code) {
    return NextResponse.json({ message: "Missing code" }, { status: 400 });
  }
  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("referrals").insert({ code, order_id: orderId, redeemed_at: new Date().toISOString() });
  } else {
    console.warn(`[stub] referral redeemed: ${code} (order ${orderId ?? "n/a"})`);
  }
  return NextResponse.json({ ok: true, reward: "Free Mini Glow Brush" });
}
