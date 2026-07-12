/**
 * Klaviyo (email/SMS) adapter — powers welcome, abandoned-cart, post-purchase,
 * and re-engagement flows. Stubbed until KLAVIYO_PRIVATE_KEY is set; every call
 * is safe to invoke (no-ops with a log in demo mode).
 */
const KEY = process.env.KLAVIYO_PRIVATE_KEY;
const LIST_ID = process.env.KLAVIYO_LIST_ID;

export const isKlaviyoLive = Boolean(KEY);

type FlowEvent =
  | "subscribed"
  | "started_checkout"
  | "placed_order"
  | "abandoned_cart"
  | "referral_earned";

export async function subscribe(email: string, source = "site") {
  if (!isKlaviyoLive) {
    console.warn(`[stub] Klaviyo subscribe → ${email} (source: ${source})`);
    return { ok: true, demo: true };
  }
  await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs", {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${KEY}`,
      "Content-Type": "application/json",
      revision: "2025-01-15",
    },
    body: JSON.stringify({
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          profiles: { data: [{ type: "profile", attributes: { email } }] },
        },
        relationships: LIST_ID
          ? { list: { data: { type: "list", id: LIST_ID } } }
          : undefined,
      },
    }),
  });
  return { ok: true, demo: false };
}

/** Fire a metric/event that Klaviyo flows can trigger off of. */
export async function trackEvent(
  event: FlowEvent,
  email: string,
  properties: Record<string, unknown> = {}
) {
  if (!isKlaviyoLive) {
    console.warn(`[stub] Klaviyo event "${event}" → ${email}`, properties);
    return { ok: true, demo: true };
  }
  await fetch("https://a.klaviyo.com/api/events", {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${KEY}`,
      "Content-Type": "application/json",
      revision: "2025-01-15",
    },
    body: JSON.stringify({
      data: {
        type: "event",
        attributes: {
          metric: { data: { type: "metric", attributes: { name: event } } },
          properties,
          profile: { data: { type: "profile", attributes: { email } } },
        },
      },
    }),
  });
  return { ok: true, demo: false };
}
