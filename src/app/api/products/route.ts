import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchAllProducts, productToRow, isCommerceLive } from "@/lib/commerce";
import { getSupabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types";

/** GET the full catalog (used by client UI helpers + the admin manager). */
export async function GET() {
  const products = await fetchAllProducts();
  return NextResponse.json({ products, live: isCommerceLive });
}

const upsertSchema = z.object({
  id: z.string().optional(),
  handle: z.string().optional(),
  name: z.string().min(1),
  tagline: z.string().optional().default(""),
  description: z.string().optional().default(""),
  category: z.string().default("sets"),
  price: z.coerce.number().nonnegative(),
  compareAtPrice: z.coerce.number().optional(),
  currency: z.string().default("USD"),
  imageUrl: z.string().url().optional(),
  stock: z.coerce.number().int().default(0),
  bestseller: z.boolean().default(false),
  tiktokViral: z.boolean().default(false),
  bundleEligible: z.boolean().default(true),
});

/** Create or update a product (upsert into Supabase `products`). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid product", issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  const handle = d.handle || slugify(d.name);

  const product: Product = {
    id: d.id || `prod_${handle}`,
    handle,
    name: d.name,
    tagline: d.tagline,
    description: d.description,
    category: d.category as Product["category"],
    price: d.price,
    compareAtPrice: d.compareAtPrice,
    currency: d.currency,
    images: d.imageUrl
      ? [{ url: d.imageUrl, alt: d.name }]
      : [{ url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80", alt: d.name }],
    rating: 5,
    reviewCount: 0,
    stock: d.stock,
    bestseller: d.bestseller,
    tiktokViral: d.tiktokViral,
    bundleEligible: d.bundleEligible,
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn("[stub] product upsert (demo mode):", product.handle);
    return NextResponse.json({ ok: true, demo: true, product });
  }
  const { error } = await supabase.from("products").upsert(productToRow(product), {
    onConflict: "handle",
  });
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, product });
}
