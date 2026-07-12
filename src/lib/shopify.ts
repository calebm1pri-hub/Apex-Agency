import type { Product } from "@/types";
import { getAllProducts, getProductByHandle } from "@/lib/products";

/**
 * Shopify Storefront adapter.
 *
 * The whole storefront reads products through THIS module. When the Storefront
 * env vars are absent, it transparently serves the mock catalog from
 * lib/products.ts, so the site is fully functional offline. To go live:
 *   1. Set SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_TOKEN in .env.local
 *   2. Implement the GraphQL calls in the `live` branches below
 *   3. Everything else (pages, cart, SEO) keeps working unchanged.
 *
 * TikTok Shop sync: connect the TikTok Shop channel inside Shopify admin —
 * products/inventory/orders then sync automatically to TikTok, and this same
 * catalog powers both surfaces.
 */

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2025-01";

export const isShopifyLive = Boolean(DOMAIN && TOKEN);

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  const json = (await res.json()) as { data: T; errors?: unknown };
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export async function fetchAllProducts(): Promise<Product[]> {
  if (!isShopifyLive) {
    console.warn("[stub] Shopify not configured — serving mock catalog.");
    return getAllProducts();
  }
  // TODO(live): map Storefront `products` query → Product[] shape.
  // const data = await shopifyFetch<...>(PRODUCTS_QUERY);
  // return data.products.edges.map(mapShopifyProduct);
  return getAllProducts();
}

export async function fetchProduct(handle: string): Promise<Product | undefined> {
  if (!isShopifyLive) return getProductByHandle(handle);
  // TODO(live): map Storefront `product(handle:)` → Product.
  return getProductByHandle(handle);
}

// Exposed so the checkout route can migrate to Shopify Cart API later.
export { shopifyFetch };
