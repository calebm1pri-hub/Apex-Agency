import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { BuyBox } from "@/components/product/buy-box";
import { ProductDetails } from "@/components/product/product-details";
import { ProductReviews } from "@/components/product/product-reviews";
import { BundleBuilder } from "@/components/product/bundle-builder";
import { ProductCard } from "@/components/product/product-card";
import {
  fetchAllProducts,
  fetchProductByHandle,
  fetchRelated,
} from "@/lib/commerce";
import { getReviews } from "@/lib/reviews";
import { buildMetadata, productJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return (await fetchAllProducts()).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await fetchProductByHandle(handle);
  if (!product) return buildMetadata({ title: "Not found" });
  return buildMetadata({
    title: product.name,
    description: product.tagline + " — " + product.description.slice(0, 120),
    path: `/products/${product.handle}`,
    image: product.images[0].url,
    type: "article",
    keywords: [product.name.toLowerCase(), `${product.category} makeup`],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await fetchProductByHandle(handle);
  if (!product) notFound();

  const reviews = getReviews(product);
  const related = await fetchRelated(handle);
  const catalog = await fetchAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* JSON-LD for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/shop?category=${product.category}`} className="capitalize hover:text-primary">
          {product.category}
        </Link>
      </nav>

      {/* Gallery + buy box */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} />
        <BuyBox product={product} />
      </div>

      {/* Details */}
      <div className="mt-16">
        <ProductDetails product={product} />
      </div>

      {/* Bundle builder cross-sell */}
      <div className="mt-16">
        <BundleBuilder products={catalog} />
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <ProductReviews
          reviews={reviews}
          rating={product.rating}
          count={product.reviewCount}
        />
      </div>

      {/* Related */}
      <div className="mt-16">
        <h2 className="mb-6 font-display text-2xl font-semibold">You may also love</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
