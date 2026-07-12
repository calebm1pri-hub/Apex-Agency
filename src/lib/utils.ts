import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution (shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as USD currency. */
export function formatPrice(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** Deterministic slug helper. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Absolute URL builder that respects NEXT_PUBLIC_SITE_URL. */
export function absoluteUrl(path = "") {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://marnie.beauty";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Generate a short, human-friendly referral / share code. */
export function shortCode(seed: string, len = 6) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36).toUpperCase().padStart(len, "0").slice(0, len);
}
