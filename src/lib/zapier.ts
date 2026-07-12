/**
 * Zapier / Make / n8n webhook adapter. Trigger automations like:
 *   - new order → notify seeded creator + create fulfillment task
 *   - creator applied → add to CRM + send sample-request template
 *   - UGC uploaded → repost to TikTok/IG + reward the customer
 * Set the relevant *_ZAP_URL env var to activate each workflow.
 */
type ZapWorkflow =
  | "new_order"
  | "creator_applied"
  | "ugc_uploaded"
  | "seedance_scheduled"
  | "outreach_sent";

const URLS: Record<ZapWorkflow, string | undefined> = {
  new_order: process.env.ZAP_NEW_ORDER_URL,
  creator_applied: process.env.ZAP_CREATOR_APPLIED_URL,
  ugc_uploaded: process.env.ZAP_UGC_UPLOADED_URL,
  seedance_scheduled: process.env.ZAP_SEEDANCE_URL,
  outreach_sent: process.env.ZAP_OUTREACH_URL,
};

export async function triggerZap(
  workflow: ZapWorkflow,
  payload: Record<string, unknown>
) {
  const url = URLS[workflow];
  if (!url) {
    console.warn(`[stub] Zapier "${workflow}" not configured`, payload);
    return { ok: true, demo: true };
  }
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workflow, ...payload, at: new Date().toISOString() }),
  });
  return { ok: true, demo: false };
}
