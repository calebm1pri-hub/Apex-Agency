import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Glow Guide",
  path: "/blog",
  description:
    "Tutorials, routines and trend guides from Marnie — learn the 5-minute looks, lash tips and clean beauty edits taking over TikTok.",
  keywords: ["makeup tutorials", "beauty blog", "makeup tips 2026"],
});

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
          Glow Guide
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Tutorials, routines &amp; trends
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Everything you need to master the viral looks — written by the Marnie team.
        </p>
      </header>

      {/* Featured */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-12 grid gap-6 overflow-hidden rounded-3xl border border-border md:grid-cols-2"
        >
          <div className="relative aspect-video md:aspect-auto">
            <Image
              src={featured.cover}
              alt={featured.title}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center gap-3 p-6 md:p-10">
            <div className="flex gap-2">
              {featured.tags.slice(0, 2).map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
            <h2 className="font-display text-2xl font-semibold group-hover:text-primary sm:text-3xl">
              {featured.title}
            </h2>
            <p className="text-muted-foreground">{featured.excerpt}</p>
            <p className="text-sm text-muted-foreground">
              {featured.author} · {featured.readingTime}
            </p>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border"
          >
            <div className="relative aspect-video">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <div className="flex gap-2">
                {post.tags.slice(0, 1).map((t) => (
                  <Badge key={t} variant="muted">{t}</Badge>
                ))}
              </div>
              <h3 className="font-display text-lg font-semibold leading-tight group-hover:text-primary">
                {post.title}
              </h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
              <p className="mt-auto pt-2 text-xs text-muted-foreground">{post.readingTime}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
