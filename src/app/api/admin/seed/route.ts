import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { productToRow } from "@/lib/commerce";
import { products as seedProducts } from "@/lib/products";

/**
 * One-time seed: upsert the in-repo seed catalog into Supabase `products`.
 * Run once after provisioning Supabase (schema.sql) + setting env vars:
 *   curl -X POST https://yoursite.com/api/admin/seed -H "x-seed-token: $SEED_TOKEN"
 *
 * Protect it with SEED_TOKEN in production so it can't be triggered publicly.
 */
export async function POST(req: Request) {
  const token = process.env.SEED_TOKEN;
  if (token && req.headers.get("x-seed-token") !== token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase not configured — set the SUPABASE env vars to seed." },
      { status: 400 }
    );
  }

  const rows = seedProducts.map(productToRow);
  const { error } = await supabase.from("products").upsert(rows, { onConflict: "handle" });
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, seeded: rows.length });
}
