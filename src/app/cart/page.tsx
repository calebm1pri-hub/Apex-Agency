"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Lock, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

const FREE_SHIP = 35;

export default function CartPage() {
  const { lines, setQuantity, remove, subtotal } = useCart();
  const [loading, setLoading] = React.useState(false);
  const [promo, setPromo] = React.useState("");
  const total = subtotal();
  const shipping = total >= FREE_SHIP || total === 0 ? 0 : 5;

  async function checkout() {
    setLoading(true);
    try {
      // Calls the Stripe checkout adapter (stubbed until keys are set).
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, promo }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert(
        data.message ??
          "Checkout is in demo mode — add your Stripe keys to enable live payments."
      );
    } catch {
      alert("Checkout unavailable in demo mode.");
    } finally {
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-primary" />
        <h1 className="font-display text-3xl font-semibold">Your bag is empty</h1>
        <p className="text-muted-foreground">
          Discover the products behind our most viral looks.
        </p>
        <Button asChild size="lg">
          <Link href="/shop">Shop bestsellers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 font-display text-4xl font-semibold">Your bag</h1>
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* Lines */}
        <div className="space-y-5">
          {lines.map((line) => (
            <div key={line.productId} className="flex gap-4">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-muted">
                {line.image && (
                  <Image src={line.image} alt={line.name} fill sizes="112px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <Link href={`/products/${line.handle}`} className="font-semibold hover:text-primary">
                    {line.name}
                  </Link>
                  <span className="font-semibold">{formatPrice(line.price * line.quantity)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{formatPrice(line.price)} each</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button className="p-2" aria-label="Decrease" onClick={() => setQuantity(line.productId, line.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm">{line.quantity}</span>
                    <button className="p-2" aria-label="Increase" onClick={() => setQuantity(line.productId, line.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"
                    onClick={() => remove(line.productId)}
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-3xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-xl font-semibold">Order summary</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Promo code (try GLOWUP)"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <Button variant="secondary">Apply</Button>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-display text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(total + shipping)}</span>
          </div>
          <Button size="lg" className="mt-5 w-full" onClick={checkout} disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Lock className="h-4 w-4" /> Secure checkout</>}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Encrypted &amp; secure · Powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
