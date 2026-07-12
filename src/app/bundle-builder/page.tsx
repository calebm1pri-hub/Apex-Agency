import type { Metadata } from "next";
import { BundleBuilder } from "@/components/product/bundle-builder";
import { fetchAllProducts } from "@/lib/commerce";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Build Your Glow Kit",
  path: "/bundle-builder",
  description:
    "Mix and match your favorite Marnie products into a custom glow kit and save up to 20%.",
  keywords: ["build a makeup bundle", "custom makeup kit"],
});

export default async function BundlePage() {
  const products = await fetchAllProducts();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
          Mix &amp; match
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Build your glow kit
        </h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Pick 3 or more of your favorites and save up to 20%. The more you glow,
          the more you save.
        </p>
      </header>
      <BundleBuilder products={products} />
    </div>
  );
}
