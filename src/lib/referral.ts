import { shortCode } from "@/lib/utils";

/**
 * Referral viral-loop logic. Deterministic code per user so it's stable across
 * SSR/CSR and sessions. Persist redemptions in Supabase (`referrals` table).
 */
export interface ReferralInfo {
  code: string;
  url: string;
  referred: number;
  rewardsEarned: number;
  nextReward: string;
}

export function getReferralInfo(userId = "guest", referredCount = 3): ReferralInfo {
  const code = `GLOW-${shortCode(userId, 5)}`;
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://marnie.beauty";
  return {
    code,
    url: `${base}/?ref=${code}`,
    referred: referredCount,
    rewardsEarned: referredCount, // 1 free brush per successful referral
    nextReward: "Free Mini Glow Brush on your next referral",
  };
}
