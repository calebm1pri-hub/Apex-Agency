# Marnie 🎀

A production-ready storefront + growth engine for **Marnie**, a modern makeup brand built for TikTok Shop virality, SEO, and creator-seeding automation. Easy everyday tools + clean, affordable glam (lash clusters, mini brush sets, cream blushes, hybrid tools).

Built with **Next.js 15 (App Router) · TypeScript · Tailwind v4 · shadcn/ui**. Dark-mode-first, mobile-first, luxe-beauty aesthetic.

---

## ✨ What's inside

| Area | What you get |
| --- | --- |
| **Storefront** | Home (hero video, bestsellers, categories, UGC/TikTok wall, referral banner), Shop with filters + sort, PDP (gallery, buy box, ingredients, how-to video, reviews, bundle builder, JSON-LD), cart with free-ship progress + cross-sell |
| **Bundle builder** | "Build your glow kit" with tiered discounts (AOV driver) |
| **Content hub** | SEO blog with keyword-targeted articles, markdown renderer, article schema |
| **TikTok** | Shoppable UGC feed, creator showcase, "Shop the Look", AR-effect CTA, on-site Pixel |
| **Account** | Orders, wishlist, Glow Points loyalty (tiers + earn rules), referral program |
| **Marketing/Admin hub** | Growth dashboard (KPIs, traffic chart, top-content ROI), creator seeding DB + sample tracker, **outreach email generator**, **Seedance UGC-script generator**, a working **product manager** (create/edit) + unified orders |
| **Viral loops** | Referral ("share & get a free brush"), UGC-upload incentive, creator application |
| **SEO** | Per-route metadata, `sitemap.ts`, `robots.ts`, Product/Article/Organization JSON-LD, `next/image` |
| **Commerce & integrations** | **Supabase-native** products/inventory/orders + adapter layer for Stripe, Klaviyo, TikTok, Zapier — all with seed/demo fallbacks |

> **Runs with zero config.** Every integration ships in **demo mode** with realistic mock data, so `npm run dev` works immediately. Add API keys to go live one service at a time — the UI never changes.

---

## 🚀 Quick start

```bash
npm install
cp .env.example .env.local   # optional — app runs without any keys
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm start          # run the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

---

## 🗂 Project structure

```
src/
  app/            # routes (home, shop, products/[handle], blog, tiktok, account, admin, api/*)
  components/     # ui (shadcn), layout, home, product, marketing, admin, account, providers
  lib/            # commerce (Supabase-native catalog) + adapters (stripe, supabase,
                  # klaviyo, tiktok, zapier) + seed data, seo, generators, stores, referral, loyalty
  types/          # shared domain types
supabase/schema.sql   # tables for products, orders, creators, referrals, ugc, loyalty, subscribers
Dockerfile · vercel.json · .env.example
```

**Golden rule:** every external call goes through a `lib/*` adapter. Pages/components never call an SDK directly, so wiring a live service is a single-file change.

---

## 🔌 Going live (one service at a time)

Each adapter is guarded — missing keys = seed/demo mode with a `[stub]` log.

1. **Supabase (commerce backend + custom data)** — run `supabase/schema.sql`, set the three `SUPABASE` vars, then seed the catalog once:
   ```bash
   curl -X POST https://yoursite.com/api/admin/seed -H "x-seed-token: $SEED_TOKEN"
   ```
   Products/inventory/orders, creator applications, referrals, and UGC now persist to Postgres. Manage products in **/admin/products** (create/edit writes straight to Supabase). The whole storefront reads through `src/lib/commerce.ts`.
2. **Stripe (payments)** — set `STRIPE_SECRET_KEY`; checkout in `src/lib/stripe.ts` goes live automatically. Add `STRIPE_WEBHOOK_SECRET` and point a webhook at `/api/webhooks/stripe` for post-purchase flows.
3. **TikTok Shop** — this site is your brand/SEO/UGC storefront; list your catalog in **TikTok Seller Center** (upload or connect a feed) to sell natively in-app. Orders from both surfaces surface in **/admin/orders**.
4. **Klaviyo (email/SMS)** — set `KLAVIYO_PRIVATE_KEY` (+ `KLAVIYO_LIST_ID`) to activate welcome / abandoned-cart / post-purchase flows.
5. **TikTok Pixel** — set `NEXT_PUBLIC_TIKTOK_PIXEL_ID`.
6. **Zapier/Make** — set the per-workflow `ZAP_*_URL` webhooks (new order → notify creator, creator applied → CRM, UGC → repost, etc).
7. **Auth** — set `AUTH_SECRET` (`openssl rand -base64 32`); add real providers in `src/auth.ts`.

### 🤖 AI upgrade path (your specialty)

The outreach + Seedance generators in `src/lib/generators.ts` are deterministic templates today. Swap each function body for a **Claude API** call (same inputs → same return shape) to get fully personalized, creator-specific copy and video scripts. The call sites in the admin forms won't change. This is the natural seam for adding AI content + support agents later.

---

## 🚢 Deployment

**Vercel (recommended):** import the repo, add env vars, deploy. `vercel.json` sets the framework + security headers.

**Docker:**
```bash
docker build -t marnie .
docker run -p 3000:3000 --env-file .env.local marnie
```
Uses Next.js `output: "standalone"` for a small image.

---

## 🎨 Brand & design

Tokens live in `src/app/globals.css` (`@theme`): `blush`, `rose`, `nude`, `cream`, `noir` + `glow` shadows and gradient-text utilities. Dark-mode-first via `next-themes`. Fonts: Fraunces (display) + Inter (sans). The logo is an inline, theme-aware SVG wordmark (`src/components/layout/logo.tsx`) — swap in a raster mark by dropping a file in `/public` and updating that component. Replace the Unsplash placeholder imagery in `src/lib/products.ts` (the seed catalog) with your product photography, or upload it to Supabase Storage and edit products in `/admin/products`.

---

## 📈 30-Day TikTok Launch + Growth Plan

A focused sprint to go from live site → early virality → repeatable sales. Assumes the storefront is deployed, Supabase is seeded, and your TikTok Shop is set up.

### Week 0 — Pre-launch setup (days 1–3)
- Provision Supabase (`schema.sql`), seed the catalog (`/api/admin/seed`), and add your 6–8 SKUs in **/admin/products** — lead with the viral heroes (lash clusters, cream blush, liner tool). List the same catalog in **TikTok Seller Center** for native in-app checkout.
- Add real product photography + 3–5 vertical demo clips (drop `hero.mp4` in `/public`).
- Install the **TikTok Pixel** + connect Stripe. Set up Klaviyo welcome + abandoned-cart flows.
- Seed the **creator DB** (admin → Seeding) with 50 nano creators (1k–50k, >8% engagement) in your niche.
- Enable the **referral** + **creator apply** loops. Turn on `GLOWUP` welcome discount.

### Week 1 — Seed the "nano army" (days 4–10)
- Use the **Outreach generator** to DM/email 50 nano creators; ship **free product** to the 20 warmest. Target cost < $15/sample.
- Attach a **Seedance script** to each sample (hook + shot list) so creators film fast.
- Post 2–3 founder/brand videos/day on `@marnie.beauty` (GRWM, "5-minute glow", problem→solution hooks).
- Goal: **15–20 samples out**, first 5 creator videos live, pixel collecting data.

### Week 2 — Amplify what works (days 11–17)
- Pull the **Top-content ROI** panel daily. Identify 1–2 breakout videos.
- Boost winners with **TikTok Spark Ads** ($20–50/day) using the creator's post + Shop attribution.
- Repost every UGC video to your page + the site's "As Seen on TikTok" wall. Reward uploaders with Glow Points.
- Launch **TikTok Shop affiliate program** (open plan) so any creator can pull your products.
- Goal: **first 50 orders**, 3× more creators applying inbound than you're recruiting.

### Week 3 — Convert + retain (days 18–24)
- Turn on **abandoned-cart** + **post-purchase** Klaviyo flows; add an SMS list capture.
- Push the **bundle builder** ("Build your glow kit", save 20%) and cart cross-sells to lift AOV.
- Publish 2 SEO articles targeting "best lash clusters 2026" + "5-minute makeup routine" and interlink to PDPs.
- Run a **referral push** ("share & get a free brush") to your first customers.
- Goal: repeat-purchase + referral orders start appearing; AOV up 15–25%.

### Week 4 — Scale the loop (days 25–30)
- Double down: recruit 100 more nano creators from your best-performing niche/region (use seeding stats).
- Scale Spark Ads on proven creatives to a target ROAS; kill losers fast.
- Host a **TikTok LIVE** shopping session featuring bestsellers + a limited drop (urgency).
- Review the **Growth dashboard**: GMV by creator, samples→posted conversion, traffic, top content. Reinvest sample budget into the highest-ROI tier.
- Goal: a **repeatable seeding→UGC→ads→sales loop** with positive contribution margin — the engine you scale in month 2.

**North-star metrics to watch:** creator GMV, samples→posted %, TikTok sessions, conversion rate, AOV, and referral/UGC participation. All visible in **admin → Dashboard**.

---

## 🔒 Security & compliance notes

- Service-role Supabase key is server-only; RLS is enabled in the schema.
- Stripe handles all card data (PCI). Security headers set in `vercel.json`.
- Add a cookie-consent banner + privacy/terms pages before EU traffic for GDPR.

---

Made with 💗 for Marnie. Cruelty-free, vegan, and built to go viral.
