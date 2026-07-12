import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/product/shop-filters";
import { getProductsByCategory, categories } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import type { Product } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: "Shop All",
  path: "/shop",
  description:
    "Shop Marnie — viral lash clusters, cream blushes, mini brush sets and hybrid tools. Clean, affordable, 5-minute glam loved on TikTok.",
  keywords: ["shop makeup online", "affordable makeup 2026", "tiktok makeup shop"],
});

function sortProducts(products: Product[], sort: string): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "bestselling":
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return copy.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category = "all", sort = "featured" } = await searchParams;
  const products = sortProducts(getProductsByCategory(category), sort);
  const label = categories.find((c) => c.value === category)?.label ?? "All";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
          Shop
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          {label}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {products.length} products · Free shipping over $35
        </p>
      </header>

      <div className="mb-8">
        <Suspense fallback={<div className="h-11" />}>
          <ShopFilters activeCategory={category} activeSort={sort} />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No products in this category yet — check back soon ✨
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
