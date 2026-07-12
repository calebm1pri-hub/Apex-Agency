import { BadgeCheck } from "lucide-react";
import type { ProductReview } from "@/types";
import { StarRating } from "@/components/product/star-rating";
import { Card, CardContent } from "@/components/ui/card";

export function ProductReviews({
  reviews,
  rating,
  count,
}: {
  reviews: ProductReview[];
  rating: number;
  count: number;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Loved by the community</h2>
          <div className="mt-1">
            <StarRating rating={rating} count={count} size="md" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <StarRating rating={r.rating} />
                {r.verified && (
                  <span className="flex items-center gap-1 text-xs text-emerald-500">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>
              <h3 className="font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              <p className="mt-3 text-xs font-medium">
                {r.author}
                {r.handle && <span className="text-primary"> · {r.handle}</span>}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
