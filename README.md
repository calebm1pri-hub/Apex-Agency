# Navigator — Perimenopause & Menopause Companion

A private, **on-device** web app for women navigating perimenopause and
menopause. Track symptoms, mood, sleep and HRT; get a transparent "hard-day"
forecast; discover correlations in your own data; and generate a doctor-ready
report — all without any data ever leaving your browser.

## Why it's different

- **Privacy-first.** No accounts, no server, no network calls. Everything lives
  in your browser's `localStorage`. Export/import lets you back up or move
  devices on your own terms.
- **Predictive, not just a log.** A readable heuristic combines recent symptom
  trend, cycle timing, sleep debt, and trigger exposure into a gentle
  green/amber/red forecast with plain-language reasons.
- **Your patterns, surfaced.** An on-device correlation engine compares symptom
  severity on days with vs. without each trigger (caffeine, alcohol, stress…)
  and only surfaces links backed by enough data to be meaningful.
- **Doctor- and partner-ready.** A printable summary for appointments, plus a
  caregiver briefing that turns your forecast into "here's how to help."

## Features

- **Onboarding** — stage, symptoms to track, optional cycle & HRT setup, goals
- **Daily check-in** — mood, energy, sleep, per-symptom severity, triggers,
  exercise/HRT, "what helped" and notes; back-date any day
- **Trends dashboard** — SVG sparklines, logging streak, and a 13-week symptom
  calendar heatmap (7 / 30 / 90-day ranges)
- **Hard-day forecast** — transparent estimate with reasons and coping tips
- **Insights & coach** — correlations + supportive, deterministic suggestions
- **Report** — printable doctor summary, caregiver share, JSON export/import,
  one-click erase-all

## Tech

Next.js 14 (App Router), React 18. **Zero runtime dependencies beyond
Next/React** — charts are hand-rolled inline SVG, persistence is a small
versioned `localStorage` layer. No database, no auth, no analytics.

```
src/lib/         storage · catalog · dates · insights (pure heuristics)
src/components/  ui + one component per view
src/app/         layout · page (tabbed shell) · icon
```

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## Disclaimer

Navigator provides supportive estimates based only on the data you enter. It is
**not medical advice** and does not diagnose. Always consult a clinician about
anything concerning.
