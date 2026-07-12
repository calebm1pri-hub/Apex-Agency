import { NextResponse } from "next/server";
import { triggerZap } from "@/lib/zapier";

/**
 * Queues a creator outreach email. In demo mode this logs + returns ok.
 * Wire ZAP_OUTREACH_URL (or a Gmail adapter) to actually send.
 */
export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  await triggerZap("outreach_sent", payload);
  return NextResponse.json({ ok: true, queued: true });
}
