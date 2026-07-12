import type { BlogPost } from "@/types";

/**
 * SEO content hub. Each post targets a primary keyword and interlinks to
 * products for topical authority + conversion. Swap for MDX/CMS later; the
 * BlogPost shape stays the same so pages don't change.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "5-minute-glow-up-routine",
    title: "The 5-Minute Glow-Up Routine Going Viral on TikTok",
    excerpt:
      "The exact everyday routine behind our most-shared GRWM videos — five steps, five minutes, zero skill required.",
    cover:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80",
    author: "Marnie Team",
    date: "2026-06-02",
    readingTime: "4 min read",
    tags: ["Routines", "Everyday", "TikTok"],
    keyword: "5 minute makeup routine",
    content: `Getting ready shouldn't feel like a chore. This is the exact five-step routine our community uses to go from bare to glow in the time it takes to make coffee.

## Step 1 — Prep & blush in one
Start with a dab of **Cloud Cream Blush in Peach Spritz** on the apples of your cheeks. Cream-to-powder means it melts in and doubles as a healthy base tint.

## Step 2 — Five-minute lashes
Our **Featherlight Lash Clusters** give you full, fluttery lashes without a strip or a stylist. Three lengths, one applicator, seven-day wear.

## Step 3 — The perfect flick
The **Flick Hybrid Liner Tool** stamps your wing and draws your line — no more crooked eyeliner, ever.

## Step 4 — Glass lips
Swipe on **Glaze Tinted Lip Oil** for non-sticky, camera-ready shine.

## Step 5 — Lock it in
Finish with **Lock & Glow Setting Mist** for a dewy hold that survives every take.

That's it — a full, photogenic look in five minutes flat. Tag us @marnie.beauty with your glow up.`,
  },
  {
    slug: "best-lash-clusters-2026",
    title: "Best Lash Clusters in 2026: The Complete Beginner's Guide",
    excerpt:
      "Everything you need to know about DIY lash clusters — how they work, how to apply them, and why they beat strip lashes.",
    cover:
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=80",
    author: "Marnie Team",
    date: "2026-05-18",
    readingTime: "6 min read",
    tags: ["Lashes", "Guides"],
    keyword: "best lash clusters 2026",
    content: `Lash clusters are the biggest lash innovation since the strip — and in 2026 they're everywhere on your FYP. Here's the complete beginner's guide.

## What are lash clusters?
Small, pre-fanned groups of lashes you apply under your natural lash line for customizable, gap-free volume.

## Why they beat strip lashes
- **Custom fit** — no trimming, no lifting corners.
- **Longer wear** — up to 7 days versus a few hours.
- **More natural** — they sit under your lashes, not on top.

## How to apply lash clusters (the easy way)
1. Map your lash line and pick your lengths.
2. Dip the base in bond and wait until tacky.
3. Place under your natural lashes.
4. Seal along the top.

Our **Featherlight Lash Clusters** kit includes everything you need to master it in one sitting.`,
  },
  {
    slug: "cream-blush-vs-powder-blush",
    title: "Cream Blush vs Powder Blush: Which Is Right for You?",
    excerpt:
      "A no-nonsense breakdown of cream vs powder blush by skin type, finish, and lifestyle — plus how to apply each like a pro.",
    cover:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    author: "Marnie Team",
    date: "2026-04-27",
    readingTime: "5 min read",
    tags: ["Cheeks", "Guides"],
    keyword: "cream blush vs powder blush",
    content: `Both can give you the perfect flush — but the right pick depends on your skin and your routine.

## Choose cream blush if…
You want a dewy, skin-like finish, have dry or mature skin, or apply on the go with your fingers. Try **Cloud Cream Blush**.

## Choose powder blush if…
You have oily skin, want longer wear without touch-ups, or love a soft-matte finish.

## Pro tip: layer them
Cream first for grip, a dust of powder on top to set. This is the secret to blush that lasts all day.`,
  },
];

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
