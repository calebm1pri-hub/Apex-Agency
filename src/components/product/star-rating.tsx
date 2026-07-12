import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  count,
  size = "sm",
  className,
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const px = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              px,
              i < Math.round(rating)
                ? "fill-blush-400 text-blush-400"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {rating.toFixed(1)}
        {count != null && ` (${count.toLocaleString()})`}
      </span>
    </div>
  );
}
