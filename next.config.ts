import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so Turbopack doesn't infer a parent dir.
  turbopack: {
    root: __dirname,
  },
  images: {
    // Remote sources used for mock product/UGC imagery. Swap for your CDN
    // (Shopify files, Supabase storage, etc.) in production.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "p16-sign.tiktokcdn-us.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
