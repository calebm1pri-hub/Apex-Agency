/**
 * Glow Points loyalty program. Points accrue on purchases, reviews, UGC uploads
 * and referrals. Tiers unlock perks. Persist balances in Supabase later.
 */
export interface LoyaltyState {
  points: number;
  tier: LoyaltyTier;
  nextTier?: LoyaltyTier;
  pointsToNext: number;
}

export interface LoyaltyTier {
  name: string;
  min: number;
  perk: string;
}

export const TIERS: LoyaltyTier[] = [
  { name: "Glow", min: 0, perk: "Birthday gift + early access" },
  { name: "Radiance", min: 500, perk: "Free shipping always + 2x points" },
  { name: "Icon", min: 1500, perk: "Free product drops + VIP events" },
];

export const EARN_RULES = [
  { action: "Every $1 spent", points: 10 },
  { action: "Write a review", points: 50 },
  { action: "Upload a UGC video", points: 250 },
  { action: "Refer a friend", points: 300 },
  { action: "Follow on TikTok", points: 100 },
];

export function getLoyaltyState(points = 740): LoyaltyState {
  const tier = [...TIERS].reverse().find((t) => points >= t.min) ?? TIERS[0];
  const nextTier = TIERS.find((t) => t.min > points);
  return {
    points,
    tier,
    nextTier,
    pointsToNext: nextTier ? nextTier.min - points : 0,
  };
}
