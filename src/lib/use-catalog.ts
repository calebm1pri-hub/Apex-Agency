"use client";

import * as React from "react";
import type { Product } from "@/types";

/**
 * Client-side catalog hook. Fetches /api/products once and caches it at module
 * scope so client UI helpers (cart cross-sell, wishlist grid) reflect the live
 * Supabase catalog without each component re-fetching.
 */
let cache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;

async function load(): Promise<Product[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        cache = (d.products as Product[]) ?? [];
        return cache;
      })
      .catch(() => []);
  }
  return inflight;
}

export function useCatalog(): Product[] {
  const [products, setProducts] = React.useState<Product[]>(cache ?? []);
  React.useEffect(() => {
    let active = true;
    load().then((p) => active && setProducts(p));
    return () => {
      active = false;
    };
  }, []);
  return products;
}
