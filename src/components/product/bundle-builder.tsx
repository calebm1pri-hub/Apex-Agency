"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Plus, Sparkles } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import { cn, formatPrice } from "@/lib/utils";

/**
 * "Build Your Glow Kit" — pick 3+ eligible products for a tiered discount.
 * A conversion/AOV driver used both on PDPs (compact) and the bundle page.
 */
const TIERS = [
  { min: 3, off: 0.1, label: "10% off" },
  { min: 4, off: 0.15, label: "15% off" },
  { min: 5, off: 0.2, label: "20% off" },
];

export function BundleBuilder({
  products,
  compact = false,
}: {
  products: Product[];
  compact?: boolean;
}) {
  const eligible = products.filter((p) => p.bundleEligible && p.stock > 0);
  const [selected, setSelected] = React.useState<string[]>([]);
  const add = useCart((s) => s.add);

  const chosen = eligible.filter((p) => selected.includes(p.id));
  const raw = chosen.reduce((s, p) => s + p.price, 0);
  const tier = [...TIERS].reverse().find((t) => chosen.length >= t.min);
  const discount = tier ? raw * tier.off : 0;
  const total = raw - discount;
  const nextTier = TIERS.find((t) => chosen.length < t.min);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function addBundle() {
    chosen.forEach((p) => add(p));
    setSelected([]);
  }

  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-blush-500/10 to-transparent p-6">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">
          Build your glow kit &amp; save
        </h2>
      </div>

      {/* Tier progress */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
        {TIERS.map((t) => (
          <Badge
            key={t.min}
            variant={chosen.length >= t.min ? "viral" : "muted"}
          >
            {t.min}+ = {t.label}
          </Badge>
        ))}
        {nextTier && (
          <span className="text-muted-foreground">
            Add {nextTier.min - chosen.length} more for {nextTier.label}
          </span>
        )}
      </div>

      <div
        className={cn(
          "grid gap-3",
          compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
        )}
      >
        {eligible.map((p) => {
          const on = selected.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 text-left transition-all",
                on ? "border-primary shadow-[var(--shadow-glow)]" : "border-border"
              )}
            >
              <div className="relative aspect-square bg-muted">
                <Image
                  src={p.images[0].url}
                  alt={p.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <span
                  className={cn(
                    "absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                    on ? "bg-primary text-primary-foreground" : "bg-background/80"
                  )}
                >
                  {on ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </div>
              <div className="p-2">
                <p className="line-clamp-1 text-xs font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(p.price)}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {chosen.length} selected
            {discount > 0 && (
              <span className="ml-2 font-semibold text-primary">
                You save {formatPrice(discount)}
              </span>
            )}
          </p>
          <p className="font-display text-2xl font-semibold">
            {formatPrice(total)}
            {discount > 0 && (
              <span className="ml-2 text-base text-muted-foreground line-through">
                {formatPrice(raw)}
              </span>
            )}
          </p>
        </div>
        <Button
          size="lg"
          disabled={chosen.length < 3}
          onClick={addBundle}
        >
          {chosen.length < 3
            ? `Pick ${3 - chosen.length} more`
            : `Add kit to bag · ${formatPrice(total)}`}
        </Button>
      </div>
    </div>
  );
}
