import type { Product, UGCPost } from "@/types";

/**
 * SEED CATALOG — the source of truth in demo mode, and the fallback whenever
 * Supabase isn't configured. `lib/commerce.ts` reads through these, so every
 * page/component works with zero config and swaps to live Supabase data via one
 * adapter. Populate the live DB by POSTing /api/admin/seed (upserts this list).
 *
 * Images use Unsplash for realistic placeholders; replace with your product
 * photography (Supabase Storage or any CDN) before launch.
 */

const img = (id: string, alt: string) => ({
  url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`,
  alt,
});

export const products: Product[] = [
  {
    id: "prod_lash_cluster_natural",
    handle: "featherlight-lash-clusters",
    name: "Featherlight Lash Clusters",
    tagline: "60-cluster kit for 5-minute, glue-optional lashes",
    description:
      "Our viral DIY lash clusters give you salon-level volume in minutes — no strip, no stylist. Ultra-fine, tapered wisps blend into your natural lash line and last up to 7 days. The kit includes 60 clusters in 3 lengths, precision applicator, and bond + seal.",
    category: "lashes",
    price: 24,
    compareAtPrice: 34,
    currency: "USD",
    images: [
      img("photo-1583241800698-9c2e0b3f9b6a", "Featherlight lash clusters kit"),
      img("photo-1512496015851-a90fb38ba796", "Model applying lash clusters"),
      img("photo-1596704017254-9b121068fb31", "Close-up of fluttery lashes"),
    ],
    rating: 4.8,
    reviewCount: 2143,
    stock: 12,
    ingredients: ["Korean PBT fiber", "Latex-free bond", "Vitamin-E seal"],
    howToUse: [
      "Map your lash line and pick a cluster length.",
      "Dip the cluster base in bond, wait 5 seconds until tacky.",
      "Place under your natural lashes with the applicator.",
      "Seal along the top for 7-day, waterproof wear.",
    ],
    howToVideoUrl: "https://www.tiktok.com/@marnie.beauty/video/000000001",
    badges: ["TikTok Viral", "Bestseller", "Cruelty-Free"],
    bestseller: true,
    tiktokViral: true,
    bundleEligible: true,
  },
  {
    id: "prod_mini_brush_set",
    handle: "mini-glow-brush-set",
    name: "Mini Glow Brush Set",
    tagline: "5 travel-size vegan brushes that do everything",
    description:
      "The pro kit that fits in your pocket. Five ultra-soft vegan brushes for base, blush, blend, brow and detail — weighted metal handles, zero shedding, and a magnetic snap case built for your bag and your FYP.",
    category: "brushes",
    price: 29,
    compareAtPrice: 42,
    currency: "USD",
    images: [
      img("photo-1522337660859-02fbefca4702", "Mini glow brush set"),
      img("photo-1512207736890-6ffed8a84e8d", "Vegan makeup brushes fanned out"),
    ],
    rating: 4.9,
    reviewCount: 1387,
    stock: 34,
    ingredients: ["Vegan Taklon fiber", "Anodized aluminum ferrule", "FSC birch handle"],
    howToUse: [
      "Base: buff foundation in circular motions.",
      "Cheeks: press cream blush up toward temples.",
      "Blend: soften any harsh edges.",
      "Detail: carve brows and highlight inner corners.",
    ],
    badges: ["Bestseller", "Vegan", "Cruelty-Free"],
    bestseller: true,
    bundleEligible: true,
  },
  {
    id: "prod_cream_blush_peach",
    handle: "cloud-cream-blush-peach",
    name: "Cloud Cream Blush — Peach Spritz",
    tagline: "Blurring cream-to-powder flush that never cakes",
    description:
      "A weightless cream blush that melts into skin for a lit-from-within flush. Buildable, blurring pigment in a peachy-coral that flatters every tone. Dermatologist-tested, fragrance-free, and made for fingertip application on the go.",
    category: "cheeks",
    price: 19,
    currency: "USD",
    images: [
      img("photo-1596462502278-27bfdc403348", "Cloud cream blush in peach"),
      img("photo-1620916566398-39f1143ab7be", "Cream blush swatch on skin"),
    ],
    rating: 4.7,
    reviewCount: 964,
    stock: 3,
    ingredients: [
      "Squalane",
      "Vitamin E",
      "Hyaluronic acid",
      "Fragrance-free",
    ],
    howToUse: [
      "Dot two small dabs on the apples of your cheeks.",
      "Tap out with a fingertip or the Mini Glow blush brush.",
      "Build to your desired flush — it won't cake.",
    ],
    badges: ["TikTok Viral", "New", "Vegan"],
    tiktokViral: true,
    bundleEligible: true,
  },
  {
    id: "prod_hybrid_liner_tool",
    handle: "flick-hybrid-liner-tool",
    name: "Flick Hybrid Liner Tool",
    tagline: "Stamp + brush duo for a perfect wing, every time",
    description:
      "The hybrid tool that ended crooked wings. One end stamps your outer flick, the other draws a clean line to your inner corner. Refillable, smudge-proof, and stupidly easy — the reason our #flickchallenge has 40M+ views.",
    category: "tools",
    price: 22,
    currency: "USD",
    images: [
      img("photo-1631214540553-ff044a3ff1d4", "Flick hybrid liner tool"),
      img("photo-1487412947147-5cebf100ffc2", "Winged eyeliner look"),
    ],
    rating: 4.6,
    reviewCount: 731,
    stock: 21,
    ingredients: ["Waterproof gel ink", "Flexible felt stamp", "Refillable barrel"],
    howToUse: [
      "Press the stamp at your outer corner at a 45° angle.",
      "Connect the line to your lash line with the fine tip.",
      "Layer for a bolder wing.",
    ],
    badges: ["TikTok Viral", "Restocked"],
    tiktokViral: true,
    bundleEligible: true,
  },
  {
    id: "prod_lip_oil_glaze",
    handle: "glaze-tinted-lip-oil",
    name: "Glaze Tinted Lip Oil",
    tagline: "Non-sticky, glassy shine with a hint of tint",
    description:
      "A cushiony lip oil that gives glass-glazed shine and a sheer wash of color while it conditions. Jojoba + peppermint for a subtle plumping tingle. Lives in your pocket, looks unreal on camera.",
    category: "lips",
    price: 16,
    currency: "USD",
    images: [
      img("photo-1586495777744-4413f21062fa", "Glaze tinted lip oil"),
      img("photo-1503236823255-94609f598e71", "Glossy lips close-up"),
    ],
    rating: 4.8,
    reviewCount: 1120,
    stock: 45,
    ingredients: ["Jojoba oil", "Peppermint", "Vitamin E", "Sheer tint"],
    howToUse: [
      "Swipe the doe-foot across bare or made-up lips.",
      "Layer over blush-toned liner for depth.",
    ],
    badges: ["Bestseller", "Vegan"],
    bestseller: true,
    bundleEligible: true,
  },
  {
    id: "prod_glow_kit_set",
    handle: "5-minute-glow-kit",
    name: "The 5-Minute Glow Kit",
    tagline: "Everything for the viral everyday look — save 25%",
    description:
      "Our hero routine in one box: Featherlight Lash Clusters, Cloud Cream Blush, Glaze Lip Oil, and the Mini Glow Brush Set. The exact kit behind our most-shared get-ready-with-me videos.",
    category: "sets",
    price: 69,
    compareAtPrice: 92,
    currency: "USD",
    images: [
      img("photo-1571781926291-c477ebfd024b", "The 5-Minute Glow Kit"),
      img("photo-1596704017234-0e0e0e0e0e0e", "Glow kit flat lay"),
    ],
    rating: 4.9,
    reviewCount: 587,
    stock: 18,
    howToUse: [
      "Follow the included 5-minute routine card.",
      "Scan the QR to watch the full GRWM tutorial.",
    ],
    badges: ["Bestseller", "Limited"],
    bestseller: true,
    bundleEligible: false,
  },
  {
    id: "prod_setting_mist",
    handle: "lock-glow-setting-mist",
    name: "Lock & Glow Setting Mist",
    tagline: "Dewy, 16-hour hold that survives the FYP",
    description:
      "A fine-mist setting spray that locks makeup for 16 hours with a soft dewy finish. Niacinamide + green tea keep skin comfortable. No white cast, no crunch — just glow that lasts through every take.",
    category: "tools",
    price: 21,
    currency: "USD",
    images: [
      img("photo-1608248543803-ba4f8c70ae0b", "Lock and glow setting mist"),
      img("photo-1556228578-8c89e6adf883", "Setting mist application"),
    ],
    rating: 4.7,
    reviewCount: 402,
    stock: 27,
    ingredients: ["Niacinamide", "Green tea", "Glycerin", "Alcohol-free"],
    howToUse: [
      "Hold 8 inches from face and mist in a T then X motion.",
      "Let dry down for a dewy, locked finish.",
    ],
    badges: ["New", "Vegan"],
    bundleEligible: true,
  },
  {
    id: "prod_brow_gel",
    handle: "featherbrow-laminating-gel",
    name: "Featherbrow Laminating Gel",
    tagline: "Fluffy, laminated brows with a flexible clean hold",
    description:
      "A tinted-clear brow gel that gives the laminated, brushed-up look without the salon appointment. Fibers grip and lift each hair for fluffy brows that hold all day and never flake.",
    category: "tools",
    price: 15,
    currency: "USD",
    images: [
      img("photo-1583001809873-a128495da465", "Featherbrow laminating gel"),
      img("photo-1512257220207-b8db66f4a5cf", "Laminated brow look"),
    ],
    rating: 4.6,
    reviewCount: 654,
    stock: 0,
    ingredients: ["Panthenol", "Micro-fibers", "Flexible film former"],
    howToUse: [
      "Brush hairs up and out at the front.",
      "Comb tails toward the temple.",
      "Let set for a flexible, all-day hold.",
    ],
    badges: ["Restocked"],
    bundleEligible: true,
  },
];

export const ugcPosts: UGCPost[] = [
  {
    id: "ugc1",
    creatorHandle: "@glowwithtay",
    thumbnail: img("photo-1596704017254-9b121068fb31", "UGC lash tutorial").url,
    videoUrl: "https://www.tiktok.com/@glowwithtay/video/000000010",
    productHandle: "featherlight-lash-clusters",
    views: 2_400_000,
    likes: 318_000,
    caption: "5-min lashes that lasted my ENTIRE vacation 😭 #marnielashes",
  },
  {
    id: "ugc2",
    creatorHandle: "@softglam.jules",
    thumbnail: img("photo-1620916566398-39f1143ab7be", "UGC blush tutorial").url,
    videoUrl: "https://www.tiktok.com/@softglam.jules/video/000000011",
    productHandle: "cloud-cream-blush-peach",
    views: 1_100_000,
    likes: 142_000,
    caption: "the peach spritz blush is NOT leaving my routine ☁️🍑",
  },
  {
    id: "ugc3",
    creatorHandle: "@makeupbymina",
    thumbnail: img("photo-1487412947147-5cebf100ffc2", "UGC liner tutorial").url,
    videoUrl: "https://www.tiktok.com/@makeupbymina/video/000000012",
    productHandle: "flick-hybrid-liner-tool",
    views: 3_900_000,
    likes: 521_000,
    caption: "the wing STAMP changed my life #flickchallenge",
  },
  {
    id: "ugc4",
    creatorHandle: "@everyday.eva",
    thumbnail: img("photo-1503236823255-94609f598e71", "UGC lip oil tutorial").url,
    videoUrl: "https://www.tiktok.com/@everyday.eva/video/000000013",
    productHandle: "glaze-tinted-lip-oil",
    views: 860_000,
    likes: 98_000,
    caption: "glass lips in 2 seconds ✨ running to restock",
  },
  {
    id: "ugc5",
    creatorHandle: "@budgetbeautykay",
    thumbnail: img("photo-1522337660859-02fbefca4702", "UGC brush review").url,
    videoUrl: "https://www.tiktok.com/@budgetbeautykay/video/000000014",
    productHandle: "mini-glow-brush-set",
    views: 640_000,
    likes: 71_000,
    caption: "$29 brush set that beats my $200 one?? #marniepartner",
  },
  {
    id: "ugc6",
    creatorHandle: "@get.ready.gigi",
    thumbnail: img("photo-1571781926291-c477ebfd024b", "UGC GRWM").url,
    videoUrl: "https://www.tiktok.com/@get.ready.gigi/video/000000015",
    productHandle: "5-minute-glow-kit",
    views: 1_800_000,
    likes: 236_000,
    caption: "full face in 5 minutes with the glow kit 🫶 #GRWM",
  },
];

/* ---- Selectors (pure; used for seed/fallback + client UI helpers) ---- */

export function getAllProducts(): Product[] {
  return products;
}

export function getProductByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.bestseller);
}

export function getViralProducts(): Product[] {
  return products.filter((p) => p.tiktokViral);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(handle: string, limit = 4): Product[] {
  const current = getProductByHandle(handle);
  if (!current) return products.slice(0, limit);
  return products
    .filter((p) => p.handle !== handle && p.category === current.category)
    .concat(products.filter((p) => p.handle !== handle && p.category !== current.category))
    .slice(0, limit);
}

export const categories: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "lashes", label: "Lashes" },
  { value: "brushes", label: "Brushes" },
  { value: "cheeks", label: "Cheeks" },
  { value: "lips", label: "Lips" },
  { value: "tools", label: "Tools" },
  { value: "sets", label: "Sets & Kits" },
];
