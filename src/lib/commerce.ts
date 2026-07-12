import { cache } from "react";
import type { Product, ProductCategory } from "@/types";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import {
  products as seedProducts,
  categories as seedCategories,
} from "@/lib/products";

/**
 * Commerce data layer — Supabase-native.
 *
 * The whole storefront reads products through THIS module. When Supabase is
 * configured it serves from the `products` table; otherwise it transparently
 * serves the in-repo seed catalog (src/lib/products.ts), so the site is fully
 * functional with zero config.
 *
 * Going live: run supabase/schema.sql, set the SUPABASE env vars, then POST
 * /api/admin/seed once to populate `products` from the seed catalog. Edit
 * products after that in the admin panel (/admin/products) or Supabase directly.
 */

export const isCommerceLive = isSupabaseConfigured;

/** Map a snake_case Supabase row to the camelCase Product domain type. */
function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    handle: String(row.handle),
    name: String(row.name),
    tagline: String(row.tagline ?? ""),
    description: String(row.description ?? ""),
    category: (row.category as ProductCategory) ?? "sets",
    price: Number(row.price ?? 0),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    currency: String(row.currency ?? "USD"),
    images: (row.images as Product["images"]) ?? [],
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    stock: Number(row.stock ?? 0),
    ingredients: (row.ingredients as string[]) ?? undefined,
    howToUse: (row.how_to_use as string[]) ?? undefined,
    howToVideoUrl: (row.how_to_video_url as string) ?? undefined,
    badges: (row.badges as Product["badges"]) ?? undefined,
    bestseller: Boolean(row.bestseller),
    tiktokViral: Boolean(row.tiktok_viral),
    bundleEligible: Boolean(row.bundle_eligible),
  };
}

/** Map a Product back to a Supabase row for inserts/updates + the seed route. */
export function productToRow(p: Product): Record<string, unknown> {
  return {
    id: p.id,
    handle: p.handle,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    category: p.category,
    price: p.price,
    compare_at_price: p.compareAtPrice ?? null,
    currency: p.currency,
    images: p.images,
    rating: p.rating,
    review_count: p.reviewCount,
    stock: p.stock,
    ingredients: p.ingredients ?? null,
    how_to_use: p.howToUse ?? null,
    how_to_video_url: p.howToVideoUrl ?? null,
    badges: p.badges ?? null,
    bestseller: p.bestseller ?? false,
    tiktok_viral: p.tiktokViral ?? false,
    bundle_eligible: p.bundleEligible ?? false,
  };
}

/**
 * Fetch the full catalog. `cache()` dedupes calls within a single request, so
 * a page that renders several product sections only hits the DB once.
 */
export const getCatalog = cache(async (): Promise<Product[]> => {
  if (!isCommerceLive) return seedProducts;
  const supabase = getSupabaseAdmin();
  if (!supabase) return seedProducts;
  const { data, error } = await supabase.from("products").select("*");
  if (error || !data || data.length === 0) {
    if (error) console.warn("[commerce] Supabase read failed, using seed:", error.message);
    return seedProducts;
  }
  return data.map(rowToProduct);
});

export async function fetchAllProducts(): Promise<Product[]> {
  return getCatalog();
}

export async function fetchProductByHandle(handle: string): Promise<Product | undefined> {
  const catalog = await getCatalog();
  return catalog.find((p) => p.handle === handle);
}

export async function fetchBestsellers(): Promise<Product[]> {
  return (await getCatalog()).filter((p) => p.bestseller);
}

export async function fetchViralProducts(): Promise<Product[]> {
  return (await getCatalog()).filter((p) => p.tiktokViral);
}

export async function fetchByCategory(category: string): Promise<Product[]> {
  const catalog = await getCatalog();
  if (category === "all") return catalog;
  return catalog.filter((p) => p.category === category);
}

export async function fetchRelated(handle: string, limit = 4): Promise<Product[]> {
  const catalog = await getCatalog();
  const current = catalog.find((p) => p.handle === handle);
  if (!current) return catalog.slice(0, limit);
  return catalog
    .filter((p) => p.handle !== handle && p.category === current.category)
    .concat(catalog.filter((p) => p.handle !== handle && p.category !== current.category))
    .slice(0, limit);
}

/** Category list for filters (static; independent of the data source). */
export const categories = seedCategories;
