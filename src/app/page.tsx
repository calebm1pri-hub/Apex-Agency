import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { Bestsellers } from "@/components/home/bestsellers";
import { Categories } from "@/components/home/categories";
import { AsSeenOnTikTok } from "@/components/home/as-seen-on-tiktok";
import { ReferralBanner } from "@/components/home/referral-banner";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/",
  keywords: ["best lash clusters 2026", "5 minute makeup", "clean affordable makeup"],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Bestsellers />
      <Categories />
      <AsSeenOnTikTok />
      <ReferralBanner />
    </>
  );
}
