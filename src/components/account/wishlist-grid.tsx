"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { useWishlist } from "@/lib/wishlist-store";
import { getAllProducts } from "@/lib/products";

export function WishlistGrid() {
  const ids = useWishlist((s) => s.ids);
  const products = getAllProducts().filter((p) => ids.includes(p.id));

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Heart className="h-10 w-10 text-primary" />
        <p className="font-display text-lg">Your wishlist is empty</p>
        <p className="text-sm text-muted-foreground">
          Tap the heart on any product to save it here.
        </p>
        <Button asChild>
          <Link href="/shop">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
