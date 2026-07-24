"use client";
import { forecast } from "../lib/insights";
import { theme, Card, SectionTitle, Reveal } from "./ui";

const LEVELS = {
  green: { color: theme.green, label: "Gentler day likely", glyph: "🌿", ring: "#4f9d7d" },
  amber: { color: theme.amber, label: "Take it easy", glyph: "🌤️", ring: "#dd9b3f" },
  red: { color: theme.red, label: "Harder day likely", glyph: "🌧️", ring: "#cf5b52" },
};

export default function Forecast({ state }) {
  const { entries, profile } = state;
  const f = forecast(entries, profile);
  const meta = LEVELS[f.level];

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 20px 40px" }}>
      <SectionTitle
        eyebrow="Looking ahead"
        title="Your hard-day forecast"
        sub="A gentle, transparent estimate from your recent patterns — not a diagnosis."
      />

      <Reveal>
        <Card style={{ textAlign: "center", padding: "32px 20px", borderColor: `${meta.color}55` }}>
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              background: `${meta.color}14`,
              border: `3px solid ${meta.ring}`,
            }}
          >
            {meta.glyph}
          </div>
          <div style={{ fontFamily: theme.serif, fontSize: "24px", fontWeight: 700, color: meta.color }}>
            {meta.label}
          </div>
          <div style={{ fontFamily: theme.sans, fontSize: "13px", color: theme.muted, marginTop: "6px" }}>
            Next day or two
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.05}>
        <Card style={{ marginTop: "14px" }}>
          <div style={{ fontFamily: theme.sans, fontSize: "13px", fontWeight: 700, color: theme.plum, marginBottom: "10px" }}>
            Why this estimate
          </div>
          <div style={{ display: "grid", gap: "10px" }}>
            {f.reasons.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: meta.color, marginTop: "1px" }}>•</span>
                <span style={{ fontFamily: theme.sans, fontSize: "14px", color: theme.ink, lineHeight: 1.55 }}>{r}</span>
              </div>
            ))}
          </div>
        </Card>
      </Reveal>

      {f.level !== "green" && (
        <Reveal delay={0.1}>
          <Card style={{ marginTop: "14px", background: `${theme.plum}08`, borderColor: `${theme.plum}22` }}>
            <div style={{ fontFamily: theme.sans, fontSize: "13px", fontWeight: 700, color: theme.plum, marginBottom: "8px" }}>
              Small things that can help
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
              {["Hydrate early and keep your space cool", "Protect your sleep tonight — dim screens, wind down", "Go easy on caffeine and alcohol today", "Plan a lighter schedule where you can"].map((t) => (
                <li key={t} style={{ fontFamily: theme.sans, fontSize: "14px", color: theme.ink, lineHeight: 1.7 }}>
                  {t}
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      )}

      {!f.hasData && (
        <div style={{ fontFamily: theme.sans, fontSize: "12px", color: theme.muted, textAlign: "center", marginTop: "16px" }}>
          Log a few daily check-ins to sharpen your forecast.
        </div>
      )}

      <div style={{ fontFamily: theme.sans, fontSize: "11px", color: theme.muted, textAlign: "center", marginTop: "20px", lineHeight: 1.6 }}>
        This forecast is a supportive estimate based only on the data you've entered.
        It isn't medical advice. Always check with your clinician about anything concerning.
      </div>
    </div>
  );
}
