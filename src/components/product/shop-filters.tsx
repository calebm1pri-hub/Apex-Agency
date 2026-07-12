"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/lib/products";
import { cn } from "@/lib/utils";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "bestselling", label: "Bestselling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function ShopFilters({
  activeCategory,
  activeSort,
}: {
  activeCategory: string;
  activeSort: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "all" && key === "category") next.delete(key);
    else next.set(key, value);
    router.push(`/shop?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Category pills */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar md:mx-0 md:flex-wrap md:px-0">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setParam("category", c.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === c.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={activeSort}
        onChange={(e) => setParam("sort", e.target.value)}
        className="h-11 rounded-full border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Sort products"
      >
        {sorts.map((s) => (
          <option key={s.value} value={s.value}>
            Sort: {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
