"use client";

import * as React from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";

export function CartButton() {
  const { open, count } = useCart();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const n = mounted ? count() : 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Open bag, ${n} items`}
      onClick={open}
      className="relative"
    >
      <ShoppingBag className="h-5 w-5" />
      {n > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {n}
        </span>
      )}
    </Button>
  );
}
