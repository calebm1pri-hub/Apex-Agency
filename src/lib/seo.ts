import type { Metadata } from "next";
import type { BlogPost, Product } from "@/types";
import { absoluteUrl } from "@/lib/utils";

const SITE_NAME = "Marnie";
const DEFAULT_DESCRIPTION =
  "Marnie makes easy, clean, affordable glam — viral lash clusters, mini brush sets, cream blushes and hybrid tools loved on TikTok. 5-minute looks, cruelty-free, made for real life.";

/** Central metadata builder reused by every route for consistent SEO. */
export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = "/og/marnie-default.png",
  keywords = [],
  type = "website",
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
} = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Clean, Easy, Viral Glam`;
  const url = absoluteUrl(path);
  return {
    title: fullTitle,
    description,
    keywords: [
      "Marnie",
      "makeup",
      "TikTok makeup",
      "lash clusters",
      "cream blush",
      "affordable makeup",
      ...keywords,
    ],
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

/** schema.org Product JSON-LD for PDPs (rich results + Merchant listings). */
export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: SITE_NAME },
    sku: product.id,
    category: product.category,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/products/${product.handle}`),
    },
  };
}

/** schema.org Article JSON-LD for blog posts. */
export function articleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.cover],
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.keyword,
  };
}

/** schema.org Organization JSON-LD (rendered once in root layout). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.png"),
    sameAs: [
      "https://www.tiktok.com/@marnie.beauty",
      "https://www.instagram.com/marnie.beauty",
    ],
    description: DEFAULT_DESCRIPTION,
  };
}
