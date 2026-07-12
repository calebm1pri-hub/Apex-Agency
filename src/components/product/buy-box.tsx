"use client";

import * as React from "react";
import { Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/product/star-rating";
import { StockUrgency } from "@/components/marketing/stock-urgency";
import { ShareBar } from "@/components/marketing/share-bar";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { cn, formatPrice } from "@/lib/utils";

export function BuyBox({ product }: { product: Product }) {
  const [qty, setQty] = React.useState(1);
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const soldOut = product.stock <= 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-1.5">
        {product.badges?.map((b) => (
          <Badge key={b} variant={b === "TikTok Viral" ? "viral" : "secondary"}>
            {b}
          </Badge>
        ))}
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-1 text-muted-foreground">{product.tagline}</p>
      </div>

      <StarRating rating={product.rating} count={product.reviewCount} size="md" />

      <div className="flex items-end gap-2">
        <span className="font-display text-3xl font-semibold">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <>
            <span className="pb-1 text-lg text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
            <Badge variant="viral" className="mb-1.5">
              Save {formatPrice(product.compareAtPrice - product.price)}
            </Badge>
          </>
        )}
      </div>

      <StockUrgency stock={product.stock} />

      <p className="text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      {/* Quantity + add */}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-border">
          <button
            aria-label="Decrease quantity"
            className="p-3"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-medium">{qty}</span>
          <button
            aria-label="Increase quantity"
            className="p-3"
            onClick={() => setQty((q) => q + 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button
          size="lg"
          className="flex-1"
          disabled={soldOut}
          onClick={() => add(product, qty)}
        >
          <ShoppingBag className="h-5 w-5" />
          {soldOut ? "Sold out" : `Add to bag · ${formatPrice(product.price * qty)}`}
        </Button>
        <Button
          size="icon"
          variant="outline"
          aria-label="Add to wishlist"
          className="h-14 w-14"
          onClick={() => toggleWish(product.id)}
        >
          <Heart className={cn("h-5 w-5", wished && "fill-blush-500 text-blush-500")} />
        </Button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border p-3 text-center text-xs text-muted-foreground">
        <div className="flex flex-col items-center gap-1">
          <Truck className="h-4 w-4 text-primary" /> Free ship $35+
        </div>
        <div className="flex flex-col items-center gap-1">
          <RotateCcw className="h-4 w-4 text-primary" /> 30-day returns
        </div>
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-primary" /> Secure checkout
        </div>
      </div>

      <ShareBar path={`/products/${product.handle}`} title={product.name} />
    </div>
  );
}
