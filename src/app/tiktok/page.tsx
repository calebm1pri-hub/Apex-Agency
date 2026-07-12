import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import { UGCCard } from "@/components/marketing/ugc-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ugcPosts } from "@/lib/products";
import { getCreators } from "@/lib/creators";
import { buildMetadata } from "@/lib/seo";
import { TIKTOK_HANDLE } from "@/lib/tiktok";

export const metadata: Metadata = buildMetadata({
  title: "As Seen on TikTok",
  path: "/tiktok",
  description:
    "Shop the viral Marnie looks straight from TikTok. Watch real creators, shop the exact products, and join the affiliate program.",
  keywords: ["tiktok makeup", "shop the look", "viral makeup 2026"],
});

function compact(n: number) {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export default function TikTokPage() {
  const featuredCreators = getCreators()
    .filter((c) => ["affiliate", "posted"].includes(c.status))
    .sort((a, b) => (b.gmv ?? 0) - (a.gmv ?? 0));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <header className="mb-10 text-center">
        <Badge variant="viral" className="mb-3 gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> {TIKTOK_HANDLE}
        </Badge>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          As seen on TikTok
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Millions of views, thousands of glow-ups. Tap any video to shop the exact
          look — no searching, just add to bag.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <a href="https://www.tiktok.com/@marnie.beauty" target="_blank" rel="noopener noreferrer">
              Follow on TikTok
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/creators/apply">Become a creator</Link>
          </Button>
        </div>
      </header>

      {/* Shoppable feed */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl font-semibold">Shop the look</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ugcPosts.map((post) => (
            <UGCCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Creator showcase */}
      <section className="rounded-3xl border border-border bg-muted/30 p-6 sm:p-10">
        <div className="mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-semibold">Creator showcase</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCreators.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-semibold">{c.handle}</p>
              <p className="text-sm text-muted-foreground">{c.niche}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> {compact(c.followers)}
                </span>
                <span className="flex items-center gap-1 text-emerald-500">
                  <TrendingUp className="h-3.5 w-3.5" /> {c.engagementRate}%
                </span>
              </div>
              {c.gmv ? (
                <Badge variant="viral" className="mt-3">
                  {compact(c.gmv)} in sales driven
                </Badge>
              ) : (
                <Badge variant="muted" className="mt-3 capitalize">
                  {c.tier} creator
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* AR / effect CTA — placeholder linking to a TikTok effect */}
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-6 text-center">
          <Sparkles className="h-6 w-6 text-primary" />
          <h3 className="font-display text-lg font-semibold">Try the Marnie look filter</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            &quot;Create Your Look&quot; — try our shades with the Marnie AR effect on
            TikTok, then shop your match. (Hook up your TikTok Effect House link here.)
          </p>
          <Button asChild variant="outline">
            <a href="https://effecthouse.tiktok.com" target="_blank" rel="noopener noreferrer">
              Open the AR effect
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
