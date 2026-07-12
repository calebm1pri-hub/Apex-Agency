import { NextResponse } from "next/server";
import { z } from "zod";
import { triggerZap } from "@/lib/zapier";
import { getSupabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  email: z.string().email(),
  videoUrl: z.string().url(),
  productHandle: z.string().optional(),
});

/**
 * UGC upload incentive: a customer submits a video link → earns Glow Points and
 * enters the repost queue. Rewards + reposting run via the Zapier adapter.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid submission" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("ugc_submissions").insert({
      email: parsed.data.email,
      video_url: parsed.data.videoUrl,
      product_handle: parsed.data.productHandle,
      status: "pending",
    });
  }
  await triggerZap("ugc_uploaded", parsed.data);

  return NextResponse.json({ ok: true, pointsAwarded: 250 });
}
