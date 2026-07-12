import { Section } from "@/components/home/section";
import { UGCCard } from "@/components/marketing/ugc-card";
import { ugcPosts } from "@/lib/products";

/** "As Seen on TikTok" — shoppable UGC wall pulling the mock creator feed. */
export function AsSeenOnTikTok() {
  return (
    <Section
      eyebrow="#marnie"
      title="As seen on TikTok"
      description="Real looks from real creators. Tap any video to shop the exact products."
      href="/tiktok"
      hrefLabel="See the feed"
      className="bg-muted/30"
    >
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:grid md:grid-cols-5 md:px-0">
        {ugcPosts.slice(0, 5).map((post) => (
          <div key={post.id} className="w-[55vw] shrink-0 snap-start sm:w-[38vw] md:w-auto">
            <UGCCard post={post} />
          </div>
        ))}
      </div>
    </Section>
  );
}
