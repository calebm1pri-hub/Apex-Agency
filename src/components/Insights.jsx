"use client";
import { TRIGGER_BY_ID, SYMPTOM_BY_ID } from "../lib/catalog";
import { correlations, coachTips, MIN_SAMPLE } from "../lib/insights";
import { theme, Card, SectionTitle, Reveal } from "./ui";

export default function Insights({ state }) {
  const { entries, profile } = state;
  const cors = correlations(entries, profile);
  const tips = coachTips(entries, profile);
  const loggedCount = Object.keys(entries).length;

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 20px 40px" }}>
      <SectionTitle
        eyebrow="Patterns"
        title="Insights & coach"
        sub="Connections found in your own data. We only surface patterns backed by enough days to be meaningful."
      />

      {/* correlations */}
      <div style={{ marginBottom: "8px", fontFamily: theme.sans, fontSize: "13px", fontWeight: 700, color: theme.plum }}>
        What seems connected
      </div>
      {cors.length === 0 ? (
        <Card style={{ marginBottom: "18px" }}>
          <div style={{ fontFamily: theme.sans, fontSize: "14px", color: theme.muted, lineHeight: 1.6 }}>
            {loggedCount < MIN_SAMPLE * 2
              ? `Keep logging — once you have around ${MIN_SAMPLE * 2} days of check-ins with triggers, personalized correlations will appear here.`
              : "No strong trigger–symptom links stand out in your data yet. That's genuinely good news — keep tracking and we'll flag anything that emerges."}
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: "10px", marginBottom: "18px" }}>
          {cors.map((c, i) => (
            <Reveal key={`${c.triggerId}-${c.symptomId}`} delay={i * 0.04}>
              <Card style={{ borderLeft: `3px solid ${theme.rose}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "18px" }} aria-hidden>
                    {TRIGGER_BY_ID[c.triggerId]?.glyph}
                  </span>
                  <span style={{ fontFamily: theme.sans, fontSize: "12px", color: theme.muted }}>→</span>
                  <span style={{ fontSize: "18px" }} aria-hidden>
                    {SYMPTOM_BY_ID[c.symptomId]?.glyph}
                  </span>
                  {c.pct != null && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontFamily: theme.sans,
                        fontSize: "12px",
                        fontWeight: 700,
                        color: theme.rose,
                        background: `${theme.rose}14`,
                        padding: "3px 10px",
                        borderRadius: "999px",
                      }}
                    >
                      +{c.pct}%
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: theme.sans, fontSize: "14px", color: theme.ink, lineHeight: 1.55 }}>
                  {c.text}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      )}

      {/* coach tips */}
      <div style={{ marginBottom: "8px", fontFamily: theme.sans, fontSize: "13px", fontWeight: 700, color: theme.plum }}>
        Your coach suggests
      </div>
      <div style={{ display: "grid", gap: "10px" }}>
        {tips.map((t, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <Card style={{ background: `${theme.plum}07`, borderColor: `${theme.plum}18` }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span aria-hidden style={{ fontSize: "16px" }}>💡</span>
                <span style={{ fontFamily: theme.sans, fontSize: "14px", color: theme.ink, lineHeight: 1.6 }}>{t}</span>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <div style={{ fontFamily: theme.sans, fontSize: "11px", color: theme.muted, textAlign: "center", marginTop: "22px", lineHeight: 1.6 }}>
        Correlations show association, not proof of cause. Use them as gentle prompts to explore with your clinician.
      </div>
    </div>
  );
}
