import { NextResponse } from "next/server";
import { z } from "zod";
import { subscribe } from "@/lib/klaviyo";

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }
  const result = await subscribe(parsed.data.email, parsed.data.source);
  return NextResponse.json(result);
}
