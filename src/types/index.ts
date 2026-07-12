/**
 * Core domain types for Marnie.
 * These mirror what a Supabase `products` row looks like, so swapping seed
 * data for the live commerce adapter requires no UI changes.
 */

export type ProductCategory =
  | "lashes"
  | "brushes"
  | "cheeks"
  | "tools"
  | "lips"
  | "sets";

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number; // 1-5
  title: string;
  body: string;
  date: string; // ISO
  verified: boolean;
  media?: string; // optional UGC image/video thumbnail
  handle?: string; // creator @handle if from TikTok
}

export interface Product {
  id: string;
  handle: string;
  name: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  stock: number;
  ingredients?: string[];
  howToUse?: string[];
  howToVideoUrl?: string;
  badges?: ProductBadge[];
  bestseller?: boolean;
  tiktokViral?: boolean;
  bundleEligible?: boolean;
  reviews?: ProductReview[];
}

export type ProductBadge =
  | "TikTok Viral"
  | "Bestseller"
  | "New"
  | "Limited"
  | "Vegan"
  | "Cruelty-Free"
  | "Restocked";

export interface CartLine {
  productId: string;
  handle: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

export interface Creator {
  id: string;
  handle: string;
  name: string;
  platform: "tiktok" | "instagram" | "youtube";
  followers: number;
  niche: string;
  engagementRate: number; // %
  email?: string;
  region: string;
  tier: "nano" | "micro" | "mid" | "macro";
  status: CreatorStatus;
  gmv?: number; // attributed sales
  lastContacted?: string;
  sampleSent?: boolean;
  postedContent?: number;
}

export type CreatorStatus =
  | "prospect"
  | "contacted"
  | "interested"
  | "sample_sent"
  | "posted"
  | "affiliate"
  | "declined";

export interface UGCPost {
  id: string;
  creatorHandle: string;
  thumbnail: string;
  videoUrl: string;
  productHandle?: string;
  views: number;
  likes: number;
  caption: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  author: string;
  date: string;
  readingTime: string;
  tags: string[];
  keyword: string; // primary SEO keyword target
  content: string; // markdown-ish body
}

export interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: { name: string; quantity: number; image: string }[];
  trackingUrl?: string;
}
