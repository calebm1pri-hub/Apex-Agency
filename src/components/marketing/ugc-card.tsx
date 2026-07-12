import Image from "next/image";
import Link from "next/link";
import { Heart, Play, ShoppingBag } from "lucide-react";
import type { UGCPost } from "@/types";
import { Badge } from "@/components/ui/badge";

function compact(n: number) {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

/** A TikTok-native 9:16 UGC card that links out to the video and the product. */
export function UGCCard({ post }: { post: UGCPost }) {
  return (
    <div className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-border bg-muted">
      <Image
        src={post.thumbnail}
        alt={post.caption}
        fill
        sizes="(max-width:768px) 60vw, 22vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="scrim absolute inset-0" />

      <a
        href={post.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex items-center justify-center"
        aria-label={`Watch ${post.creatorHandle} on TikTok`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-black transition-transform group-hover:scale-110">
          <Play className="h-6 w-6 translate-x-0.5 fill-black" />
        </span>
      </a>

      <div className="absolute left-3 top-3 flex items-center gap-2 text-white">
        <Badge variant="viral" className="gap-1">
          <Heart className="h-3 w-3 fill-white" /> {compact(post.likes)}
        </Badge>
      </div>

      <div className="absolute bottom-0 left-0 right-0 space-y-2 p-3 text-white">
        <p className="text-xs font-semibold">{post.creatorHandle}</p>
        <p className="line-clamp-2 text-xs opacity-90">{post.caption}</p>
        {post.productHandle && (
          <Link
            href={`/products/${post.productHandle}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-white"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Shop the look
          </Link>
        )}
      </div>
    </div>
  );
}
