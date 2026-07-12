import type { MetadataRoute } from "next";
import { fetchAllProducts, categories } from "@/lib/commerce";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "",
    "/shop",
    "/bundle-builder",
    "/blog",
    "/tiktok",
    "/creators/apply",
    "/account",
  ].map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryRoutes = categories
    .filter((c) => c.value !== "all")
    .map((c) => ({
      url: absoluteUrl(`/shop?category=${c.value}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const productRoutes = (await fetchAllProducts()).map((p) => ({
    url: absoluteUrl(`/products/${p.handle}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogRoutes = getAllPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
