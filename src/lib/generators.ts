import type { Creator, Product } from "@/types";

/**
 * Template engines for the marketing hub. These are deterministic, prompt-style
 * generators today (no API cost, fully offline). They're intentionally modular
 * so you can swap the body of each function for a Claude API call later to get
 * fully AI-generated, personalized copy — the call sites won't change.
 *
 * To upgrade to AI: replace the string assembly with an Anthropic Messages
 * request using the same inputs, and keep the return shape identical.
 */

export interface OutreachOptions {
  creatorHandle: string;
  creatorName?: string;
  product: string;
  tone: "friendly" | "professional" | "genz";
  commission: number;
  offerSample: boolean;
}

export function generateOutreachEmail(opts: OutreachOptions): {
  subject: string;
  body: string;
} {
  const name = opts.creatorName?.split(" ")[0] || opts.creatorHandle;
  const tones = {
    friendly: {
      subject: `${name}, we'd love to send you some Marnie ✨`,
      open: `Hi ${name}! We've been loving your content and think your vibe is *so* Marnie.`,
      close: `No pressure at all — we'd just love to get our products in your hands. Let me know where to ship!`,
    },
    professional: {
      subject: `Partnership opportunity with Marnie Beauty`,
      open: `Hi ${name}, I'm reaching out from Marnie Beauty. We admire your work in the beauty space and would like to explore a partnership.`,
      close: `If you're open to it, I'd be glad to share details and arrange a complimentary product sample.`,
    },
    genz: {
      subject: `${name} we NEED you on the Marnie team 🫶`,
      open: `heyyy ${name}! obsessed with your page fr — your ${"content"} is exactly the Marnie energy.`,
      close: `wanna send you some free stuff + get you set up with a code? just reply with your address 👀`,
    },
  } as const;

  const t = tones[opts.tone];
  const sampleLine = opts.offerSample
    ? `We'd love to send you our ${opts.product} — completely free, no strings.`
    : `We'd love to set you up with a discount to try our ${opts.product}.`;

  const body = [
    t.open,
    "",
    sampleLine,
    "",
    `Here's what we offer creators:`,
    `• ${opts.commission}% commission on every sale from your link`,
    `• Free product + early access to new drops`,
    `• A shot at being featured on our page (4M+ views and growing)`,
    "",
    t.close,
    "",
    `x, The Marnie Team`,
    `marnie.beauty · @marnie.beauty`,
  ].join("\n");

  return { subject: t.subject, body };
}

export interface SeedanceOptions {
  product: string;
  hook: "problem" | "transformation" | "trend" | "unboxing";
  duration: 15 | 30 | 60;
  vibe: "aesthetic" | "chaotic" | "educational";
}

/**
 * "Seedance" — generates a short seeding/UGC video script for affiliates:
 * a hook, beat-by-beat shot list, captions, and hashtags sized to the format.
 */
export function generateSeedanceScript(opts: SeedanceOptions): {
  title: string;
  hook: string;
  shots: { time: string; direction: string; voiceover: string }[];
  caption: string;
  hashtags: string[];
} {
  const hooks = {
    problem: `POV: you can't do your makeup to save your life… until this`,
    transformation: `bare face → full glow in ${opts.duration >= 60 ? "60" : "5 minutes"} using ONE brand`,
    trend: `testing the ${opts.product} everyone on my FYP won't stop talking about`,
    unboxing: `unboxing the viral Marnie ${opts.product} 🎀 was it worth it?`,
  } as const;

  const beats = Math.max(3, Math.round(opts.duration / 6));
  const shotBank = [
    { direction: "Close-up talking to camera with the product in hand", voiceover: hooks[opts.hook] },
    { direction: "Show the product / packaging, spin it slowly", voiceover: "so this is the one that's been everywhere…" },
    { direction: "Apply the product, real-time, no cuts", voiceover: "watch how easy this is — literally no skill needed" },
    { direction: "Before/after split or flip the camera", voiceover: "and THIS is the result. I'm obsessed." },
    { direction: "Point to the product, hold it up to the light", voiceover: "it's under $30 and it lasts all day" },
    { direction: "Direct CTA to camera", voiceover: "code in my bio, run don't walk 🏃‍♀️" },
  ];

  const shots = shotBank.slice(0, beats).map((s, i) => ({
    time: `${i * Math.round(opts.duration / beats)}-${(i + 1) * Math.round(opts.duration / beats)}s`,
    direction: opts.vibe === "chaotic" ? `${s.direction} (fast cuts, trending audio)` : s.direction,
    voiceover: s.voiceover,
  }));

  const hashtags = [
    "#marnie",
    "#marniebeauty",
    "#tiktokmademebuyit",
    "#makeuphack",
    opts.hook === "transformation" ? "#glowup" : "#grwm",
    "#cleangirlaesthetic",
  ];

  return {
    title: `${opts.product} — ${opts.hook} (${opts.duration}s)`,
    hook: hooks[opts.hook],
    shots,
    caption: `${hooks[opts.hook]} 🫶 the ${opts.product} from @marnie.beauty (code in bio for 15% off!)`,
    hashtags,
  };
}

/** Options helpers for the admin forms. */
export function productNames(products: Product[]) {
  return products.map((p) => p.name);
}

export function creatorEmailStatus(creator: Creator) {
  return creator.email ? "ready" : "no-email";
}
