"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/product/star-rating";
import { StockUrgency } from "@/components/marketing/stock-urgency";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { cn, formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const soldOut = product.stock <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-[var(--shadow-glow)]">
      <Link
        href={`/products/${product.handle}`}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
      >
        <Image
          src={product.images[0].url}
          alt={product.images[0].alt}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.tiktokViral && <Badge variant="viral">🔥 TikTok Viral</Badge>}
          {product.compareAtPrice && (
            <Badge variant="default">
              Save {formatPrice(product.compareAtPrice - product.price)}
            </Badge>
          )}
        </div>
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
            <Badge variant="muted">Sold out</Badge>
          </div>
        )}
      </Link>

      {/* Wishlist */}
      <button
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleWish(product.id)}
        className="absolute right-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur transition-colors hover:bg-background"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            wished ? "fill-blush-500 text-blush-500" : "text-foreground"
          )}
        />
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <StarRating rating={product.rating} count={product.reviewCount} />
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-display text-base font-semibold leading-tight hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.tagline}</p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            <StockUrgency stock={product.stock} className="mt-0.5" />
          </div>
          <button
            aria-label={`Add ${product.name} to bag`}
            disabled={soldOut}
            onClick={() => add(product)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
