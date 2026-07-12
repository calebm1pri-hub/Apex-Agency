import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/blog/markdown";
import { ShareBar } from "@/components/marketing/share-bar";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { buildMetadata, articleJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Not found" });
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover,
    type: "article",
    keywords: [post.keyword, ...post.tags.map((t) => t.toLowerCase())],
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />

      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>

      <div className="mb-3 flex gap-2">
        {post.tags.map((t) => (
          <Badge key={t} variant="secondary">{t}</Badge>
        ))}
      </div>
      <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {post.author} · {new Date(post.date).toLocaleDateString("en-US", { dateStyle: "long" })} · {post.readingTime}
      </p>

      <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl border border-border">
        <Image src={post.cover} alt={post.title} fill priority sizes="768px" className="object-cover" />
      </div>

      <div className="mt-8">
        <Markdown content={post.content} />
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <ShareBar path={`/blog/${post.slug}`} title={post.title} />
      </div>

      {/* Content-to-conversion capture */}
      <div className="mt-10 rounded-3xl border border-border bg-muted/40 p-6 text-center">
        <h3 className="font-display text-xl font-semibold">Get the glow list</h3>
        <p className="mx-auto mb-4 mt-1 max-w-sm text-sm text-muted-foreground">
          15% off your first order + first access to viral drops.
        </p>
        <div className="flex justify-center">
          <NewsletterForm source="blog" />
        </div>
      </div>
    </article>
  );
}
