import { NextResponse } from "next/server";
import { z } from "zod";
import { triggerZap } from "@/lib/zapier";
import { getSupabaseAdmin } from "@/lib/supabase";
import { subscribe } from "@/lib/klaviyo";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  handle: z.string().min(1),
  followers: z.union([z.string(), z.number()]).optional(),
  niche: z.string().optional(),
  region: z.string().optional(),
  why: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid application" }, { status: 400 });
  }
  const data = parsed.data;

  // 1) Persist to Supabase if configured (else no-op).
  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("creators").insert({
      name: data.name,
      email: data.email,
      handle: data.handle,
      followers: Number(data.followers) || 0,
      niche: data.niche,
      region: data.region,
      status: "prospect",
    });
  }

  // 2) Add to email list + 3) trigger CRM/sample automation.
  await subscribe(data.email, "creator-application");
  await triggerZap("creator_applied", data);

  return NextResponse.json({ ok: true });
}
