import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/** Low-stock / viral urgency cue used on cards and PDPs. */
export function StockUrgency({
  stock,
  className,
}: {
  stock: number;
  className?: string;
}) {
  if (stock <= 0) {
    return (
      <p className={cn("text-xs font-medium text-muted-foreground", className)}>
        Sold out — join the waitlist
      </p>
    );
  }
  if (stock <= 5) {
    return (
      <p className={cn("flex items-center gap-1 text-xs font-semibold text-blush-500", className)}>
        <Flame className="h-3.5 w-3.5" /> Only {stock} left — selling fast
      </p>
    );
  }
  if (stock <= 20) {
    return (
      <p className={cn("text-xs font-medium text-amber-500", className)}>
        Low stock · {stock} remaining
      </p>
    );
  }
  return (
    <p className={cn("text-xs font-medium text-emerald-500", className)}>
      In stock · ships in 1–2 days
    </p>
  );
}
