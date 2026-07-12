import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Emit a standalone server bundle for the Docker image.
  output: "standalone",
  // Pin the workspace root so Turbopack doesn't infer a parent dir.
  turbopack: {
    root: __dirname,
  },
  images: {
    // Remote sources used for product/UGC imagery. Swap for your CDN
    // (Supabase Storage, etc.) in production.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
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
