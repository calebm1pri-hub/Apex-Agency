/**
 * TikTok helpers: Pixel events + shoppable embeds.
 * The Pixel id is public (NEXT_PUBLIC_) and injected via <TikTokPixel/>.
 * Server-side Events API and Shop product sync are handled by Shopify's
 * TikTok channel — this module covers the on-site tracking + embeds.
 */
export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
export const TIKTOK_HANDLE = "@marnie.beauty";

declare global {
  interface Window {
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
  }
}

/** Track a standard TikTok commerce event client-side. */
export function trackTikTok(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(event, params);
  }
}

/** Build the oEmbed URL for a TikTok video (for server-side embed fetch). */
export function tiktokOEmbed(videoUrl: string) {
  return `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
}
