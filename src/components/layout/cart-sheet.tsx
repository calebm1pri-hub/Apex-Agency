"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { getBestsellers } from "@/lib/products";

const FREE_SHIP_THRESHOLD = 35;

export function CartSheet() {
  const { lines, isOpen, setOpen, setQuantity, remove, subtotal, add } = useCart();
  const total = subtotal();
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIP_THRESHOLD) * 100);

  // Cross-sell: suggest a bestseller not already in the cart ("Complete Your Glow Kit")
  const suggestion = getBestsellers().find(
    (p) => !lines.some((l) => l.productId === p.id)
  );

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Your bag ({lines.length})
          </SheetTitle>
        </SheetHeader>

        {/* Free shipping progress — a gentle urgency / AOV nudge */}
        <div className="rounded-2xl bg-muted p-3 text-sm">
          {remaining > 0 ? (
            <p>
              You&apos;re <b>{formatPrice(remaining)}</b> away from{" "}
              <span className="text-primary font-semibold">free shipping</span> 🎁
            </p>
          ) : (
            <p className="font-semibold text-primary">
              You&apos;ve unlocked free shipping! ✨
            </p>
          )}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blush-400 to-rose-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <Sparkles className="h-10 w-10 text-primary" />
            <p className="font-display text-lg">Your bag is empty</p>
            <p className="text-sm text-muted-foreground">
              Add a viral favorite to start your glow.
            </p>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/shop">Shop bestsellers</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="-mx-2 flex-1 space-y-4 overflow-y-auto px-2 no-scrollbar">
              {lines.map((line) => (
                <div key={line.productId} className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {line.image && (
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link
                        href={`/products/${line.handle}`}
                        onClick={() => setOpen(false)}
                        className="text-sm font-semibold leading-tight hover:text-primary"
                      >
                        {line.name}
                      </Link>
                      <button
                        aria-label="Remove"
                        onClick={() => remove(line.productId)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(line.price)}
                    </p>
                    <div className="mt-auto flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          aria-label="Decrease quantity"
                          className="p-1.5"
                          onClick={() =>
                            setQuantity(line.productId, line.quantity - 1)
                          }
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm">
                          {line.quantity}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          className="p-1.5"
                          onClick={() =>
                            setQuantity(line.productId, line.quantity + 1)
                          }
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {suggestion && (
                <div className="rounded-2xl border border-dashed border-border p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Complete your glow kit
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={suggestion.images[0].url}
                        alt={suggestion.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-tight">
                        {suggestion.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(suggestion.price)}
                      </p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => add(suggestion)}>
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <Button asChild size="lg" className="w-full">
                <Link href="/cart" onClick={() => setOpen(false)}>
                  Checkout · {formatPrice(total)}
                </Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Secure checkout · Tax calculated at payment
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
