import Link from "next/link";
import Image from "next/image";
import { Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Hero with a looping "TikTok-style" demo video background.
 * Drop a real vertical demo clip at /public/hero.mp4 (a poster image is used
 * as an instant, CLS-free fallback until the video loads / on reduced-motion).
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-glow-radial absolute inset-0" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
        {/* Copy */}
        <div className="relative z-10 flex flex-col items-start gap-5">
          <Badge variant="viral" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> 4M+ #marnie views on TikTok
          </Badge>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Your <span className="text-gradient italic">5-minute</span> glow up
            starts here.
          </h1>
          <p className="max-w-md text-base text-muted-foreground sm:text-lg">
            Easy everyday tools + clean, affordable glam. Viral lash clusters,
            cream blushes, and hybrid tools that make getting ready feel
            effortless.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/shop">Shop bestsellers</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tiktok">Watch the routine</Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-blush-400 text-blush-400" />
              <b className="text-foreground">4.8</b> · 8,000+ reviews
            </div>
            <span className="h-4 w-px bg-border" />
            <span>Cruelty-free & vegan</span>
          </div>
        </div>

        {/* Video / poster */}
        <div className="relative z-10 mx-auto w-full max-w-sm">
          <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] border border-border bg-muted shadow-[var(--shadow-glow-lg)]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80"
            >
              {/* Add your vertical demo clip here */}
              <source src="/hero.mp4" type="video/mp4" />
            </video>
            <div className="scrim pointer-events-none absolute inset-0" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div>
                <p className="text-xs opacity-80">@marnie.beauty</p>
                <p className="text-sm font-semibold">5-min everyday glow ✨</p>
              </div>
              <Badge variant="viral">Shop the look</Badge>
            </div>
          </div>
          {/* Floating proof chips */}
          <div className="animate-float absolute -left-4 top-10 hidden rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] sm:block">
            <p className="text-xs text-muted-foreground">Loved by</p>
            <p className="font-display text-lg font-semibold">120k+ girls</p>
          </div>
          <div
            className="animate-float absolute -right-4 bottom-16 hidden items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] sm:flex"
            style={{ animationDelay: "1.5s" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?auto=format&fit=crop&w=80&q=80"
              alt="Bestseller"
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
            <div>
              <p className="text-xs text-muted-foreground">Restocked</p>
              <p className="text-sm font-semibold">Lash Clusters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust marquee */}
      <div className="border-y border-border bg-muted/40 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>✦ 5-minute looks</span>
          <span>✦ Under $30</span>
          <span>✦ Cruelty-free</span>
          <span>✦ TikTok Shop verified</span>
          <span>✦ Free shipping $35+</span>
        </div>
      </div>
    </section>
  );
}
