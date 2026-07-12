import Link from "next/link";
import { Gift, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Viral loop CTA — referral + creator program teasers side by side. */
export function ReferralBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:py-20">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Refer & get */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-blush-500/15 via-rose-400/10 to-transparent p-8">
          <Gift className="mb-4 h-8 w-8 text-primary" />
          <h3 className="font-display text-2xl font-semibold">
            Share &amp; get a free brush
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Give friends 15% off. When they order, you get a{" "}
            <b>free Mini Glow Brush</b> — for every referral, forever.
          </p>
          <Button asChild className="mt-5">
            <Link href="/account?tab=referrals">Get your link</Link>
          </Button>
        </div>

        {/* Become a creator */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-nude-300/20 via-nude-200/10 to-transparent p-8">
          <Users className="mb-4 h-8 w-8 text-primary" />
          <h3 className="font-display text-2xl font-semibold">
            Become a Marnie creator
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Free product, up to <b>25% commission</b>, and a shot at going viral
            with us. Nano &amp; micro creators welcome.
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/creators/apply">Apply in 2 minutes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
