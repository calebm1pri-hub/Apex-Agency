"use client";

import * as React from "react";
import Image from "next/image";
import type { ProductImage } from "@/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = React.useState(0);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-3 sm:flex-col">
        {images.map((img, i) => (
          <button
            key={img.url}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
              active === i ? "border-primary" : "border-transparent opacity-70"
            )}
            aria-label={`View image ${i + 1}`}
          >
            <Image src={img.url} alt={img.alt} fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          src={images[active].url}
          alt={images[active].alt}
          fill
          priority
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
