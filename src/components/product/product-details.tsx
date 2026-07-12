import { Play } from "lucide-react";
import type { Product } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** How-to-use steps, ingredients, and a "How to Use" video block for the PDP. */
export function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* How to use video + steps */}
      <div>
        <h2 className="mb-4 font-display text-2xl font-semibold">How to use</h2>
        {product.howToVideoUrl && (
          <a
            href={product.howToVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-blush-500/20 to-nude-300/10"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 translate-x-0.5 fill-black" />
            </span>
            <span className="absolute bottom-3 left-3 text-sm font-semibold">
              Watch the tutorial ▶
            </span>
          </a>
        )}
        <ol className="space-y-3">
          {product.howToUse?.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm text-muted-foreground">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Details accordion */}
      <div>
        <h2 className="mb-4 font-display text-2xl font-semibold">The details</h2>
        <Accordion type="single" collapsible defaultValue="ingredients">
          {product.ingredients && (
            <AccordionItem value="ingredients">
              <AccordionTrigger>Ingredients &amp; formula</AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <li
                      key={ing}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {ing}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping &amp; returns</AccordionTrigger>
            <AccordionContent>
              Free carbon-neutral shipping on orders over $35. Orders ship within
              1–2 business days. Not in love? 30-day hassle-free returns.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="values">
            <AccordionTrigger>Our values</AccordionTrigger>
            <AccordionContent>
              Cruelty-free and vegan, always. Dermatologist-tested, fragrance-free
              where it matters, and packaged with recyclable materials.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="size">
            <AccordionTrigger>Size &amp; what&apos;s included</AccordionTrigger>
            <AccordionContent>
              Full-size product as pictured. Sets include everything shown plus a
              step-by-step routine card and a QR code to the full video tutorial.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
