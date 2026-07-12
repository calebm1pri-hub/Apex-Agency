import type { Creator } from "@/types";

/**
 * MOCK creator database — powers the admin seeding tool + creator showcase.
 * Swap for a Supabase `creators` table (see supabase/schema.sql) via the
 * admin data layer; the Creator shape is identical.
 */
export const creators: Creator[] = [
  {
    id: "cr_1",
    handle: "@glowwithtay",
    name: "Taylor Rivera",
    platform: "tiktok",
    followers: 48_000,
    niche: "Everyday glam",
    engagementRate: 9.2,
    email: "tay@example.com",
    region: "US-CA",
    tier: "nano",
    status: "affiliate",
    gmv: 12_400,
    lastContacted: "2026-06-20",
    sampleSent: true,
    postedContent: 6,
  },
  {
    id: "cr_2",
    handle: "@softglam.jules",
    name: "Jules Martin",
    platform: "tiktok",
    followers: 21_500,
    niche: "Clean beauty",
    engagementRate: 11.4,
    email: "jules@example.com",
    region: "US-NY",
    tier: "nano",
    status: "posted",
    gmv: 4_100,
    lastContacted: "2026-06-28",
    sampleSent: true,
    postedContent: 2,
  },
  {
    id: "cr_3",
    handle: "@makeupbymina",
    name: "Mina Kwon",
    platform: "tiktok",
    followers: 132_000,
    niche: "Tutorials",
    engagementRate: 7.8,
    email: "mina@example.com",
    region: "US-TX",
    tier: "micro",
    status: "interested",
    lastContacted: "2026-07-02",
    sampleSent: false,
    postedContent: 0,
  },
  {
    id: "cr_4",
    handle: "@everyday.eva",
    name: "Eva Lindqvist",
    platform: "tiktok",
    followers: 8_900,
    niche: "GRWM",
    engagementRate: 14.1,
    email: "eva@example.com",
    region: "UK",
    tier: "nano",
    status: "sample_sent",
    lastContacted: "2026-07-05",
    sampleSent: true,
    postedContent: 0,
  },
  {
    id: "cr_5",
    handle: "@budgetbeautykay",
    name: "Kayla Brooks",
    platform: "tiktok",
    followers: 63_000,
    niche: "Affordable dupes",
    engagementRate: 8.6,
    region: "US-FL",
    tier: "micro",
    status: "contacted",
    lastContacted: "2026-07-08",
    sampleSent: false,
    postedContent: 0,
  },
  {
    id: "cr_6",
    handle: "@get.ready.gigi",
    name: "Gigi Park",
    platform: "tiktok",
    followers: 15_200,
    niche: "GRWM",
    engagementRate: 12.9,
    region: "US-WA",
    tier: "nano",
    status: "prospect",
    sampleSent: false,
    postedContent: 0,
  },
  {
    id: "cr_7",
    handle: "@claregoesglam",
    name: "Clare Doyle",
    platform: "instagram",
    followers: 27_000,
    niche: "Bridal",
    engagementRate: 6.3,
    region: "IE",
    tier: "micro",
    status: "prospect",
    sampleSent: false,
    postedContent: 0,
  },
  {
    id: "cr_8",
    handle: "@riley.reviews",
    name: "Riley Nash",
    platform: "tiktok",
    followers: 4_300,
    niche: "Honest reviews",
    engagementRate: 16.5,
    region: "US-OR",
    tier: "nano",
    status: "declined",
    sampleSent: false,
    postedContent: 0,
  },
];

export function getCreators(): Creator[] {
  return creators;
}

export const STATUS_LABELS: Record<Creator["status"], string> = {
  prospect: "Prospect",
  contacted: "Contacted",
  interested: "Interested",
  sample_sent: "Sample sent",
  posted: "Posted",
  affiliate: "Affiliate",
  declined: "Declined",
};

/** Aggregate metrics for the admin analytics overview. */
export function seedingStats() {
  const total = creators.length;
  const affiliates = creators.filter((c) => c.status === "affiliate").length;
  const samplesSent = creators.filter((c) => c.sampleSent).length;
  const gmv = creators.reduce((s, c) => s + (c.gmv ?? 0), 0);
  const posts = creators.reduce((s, c) => s + (c.postedContent ?? 0), 0);
  const converted = creators.filter((c) =>
    ["posted", "affiliate"].includes(c.status)
  ).length;
  return {
    total,
    affiliates,
    samplesSent,
    gmv,
    posts,
    conversionRate: samplesSent ? Math.round((converted / samplesSent) * 100) : 0,
  };
}
