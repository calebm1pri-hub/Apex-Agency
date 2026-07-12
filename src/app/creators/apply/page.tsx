import type { Metadata } from "next";
import { DollarSign, Gift, Rocket, Users } from "lucide-react";
import { CreatorApplyForm } from "@/components/marketing/creator-apply-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Become a Creator",
  path: "/creators/apply",
  description:
    "Join the Marnie creator program. Free product, up to 25% commission, and a shot at going viral. Nano & micro creators welcome.",
  keywords: ["makeup affiliate program", "beauty creator program", "ugc creator"],
});

const perks = [
  { icon: Gift, title: "Free product", desc: "We seed you the viral bestsellers, no strings." },
  { icon: DollarSign, title: "Up to 25% commission", desc: "Earn on every sale from your link." },
  { icon: Rocket, title: "Go viral with us", desc: "Get featured to our 4M+ audience." },
  { icon: Users, title: "Nano-friendly", desc: "As few as 1k engaged followers works." },
];

export default function CreatorApplyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
          Creator program
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Create with Marnie
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          We&apos;re building the biggest nano-creator community in beauty. If you
          love making content, we want to send you free product and pay you to glow.
        </p>
      </header>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {perks.map((p) => (
          <div key={p.title} className="rounded-2xl border border-border bg-card p-5 text-center">
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold">{p.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>

      <CreatorApplyForm />
    </div>
  );
}
