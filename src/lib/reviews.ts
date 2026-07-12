import type { Product, ProductReview } from "@/types";

/**
 * Deterministic mock reviews per product (seeded by handle so SSR/CSR match).
 * Replace with real reviews from Shopify/Judge.me/Okendo via an adapter later.
 */
const SNIPPETS = [
  {
    title: "Obsessed!!",
    body: "Saw this on my FYP and had to try — it did NOT disappoint. So easy to use and lasts all day.",
    rating: 5,
  },
  {
    title: "Worth the hype",
    body: "I was skeptical but this is genuinely my new everyday go-to. The quality for the price is unreal.",
    rating: 5,
  },
  {
    title: "So good for beginners",
    body: "I have zero makeup skills and even I made this look pro in like 3 minutes. Highly recommend.",
    rating: 5,
  },
  {
    title: "Really nice, one note",
    body: "Love the finish and feel. Took me a couple tries to get the technique but now I'm hooked.",
    rating: 4,
  },
  {
    title: "Repurchasing already",
    body: "On my second one. Clean formula, no irritation, and it photographs beautifully on camera.",
    rating: 5,
  },
  {
    title: "Cute + functional",
    body: "The packaging is adorable and it actually works. Perfect size to throw in my bag.",
    rating: 4,
  },
];

const NAMES = [
  "Taylor R.",
  "Jules M.",
  "Mina K.",
  "Eva L.",
  "Kayla B.",
  "Gigi P.",
  "Sofia D.",
  "Riley N.",
];

function seed(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function getReviews(product: Product): ProductReview[] {
  const base = seed(product.handle);
  const count = 4;
  return Array.from({ length: count }).map((_, i) => {
    const s = SNIPPETS[(base + i) % SNIPPETS.length];
    return {
      id: `${product.id}-rev-${i}`,
      author: NAMES[(base + i * 3) % NAMES.length],
      rating: s.rating,
      title: s.title,
      body: s.body,
      date: new Date(2026, (base + i) % 6, ((base + i) % 27) + 1).toISOString(),
      verified: true,
      handle: i % 2 === 0 ? `@${product.handle.split("-")[0]}fan` : undefined,
    };
  });
}
