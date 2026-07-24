"use client";
import { useState } from "react";
import { STAGES, SYMPTOMS, HRT_TYPES, GOALS } from "../lib/catalog";
import { theme, Card, Button, Chip, SectionTitle } from "./ui";

// First-run flow: stage → symptoms → cycle/HRT → goals. Returns a profile.
export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [cycleLength, setCycleLength] = useState("");
  const [lastPeriod, setLastPeriod] = useState("");
  const [hrt, setHrt] = useState([]);
  const [goals, setGoals] = useState([]);

  const toggle = (arr, setArr, id) =>
    setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const steps = ["You", "Symptoms", "Cycle & HRT", "Goals"];
  const canNext =
    (step === 0 && stage) ||
    (step === 1 && symptoms.length > 0) ||
    step === 2 ||
    step === 3;

  const finish = () => {
    onComplete({
      stage,
      trackedSymptoms: symptoms,
      cycleLength: cycleLength ? Number(cycleLength) : null,
      lastPeriod: lastPeriod || null,
      hrt: hrt.map((name) => ({ name, type: name })),
      goals,
    });
  };

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 20px 60px" }}>
      {/* progress dots */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div
              style={{
                height: "4px",
                borderRadius: "999px",
                background: i <= step ? theme.rose : theme.line,
                transition: "background 0.3s ease",
              }}
            />
            <div
              style={{
                fontFamily: theme.sans,
                fontSize: "10px",
                color: i === step ? theme.plum : theme.muted,
                marginTop: "6px",
                fontWeight: i === step ? 700 : 500,
              }}
            >
              {s}
            </div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <SectionTitle
            eyebrow="Welcome"
            title="Where are you in your journey?"
            sub="This stays on your device. Nothing you enter here ever leaves this browser."
          />
          <div style={{ display: "grid", gap: "10px" }}>
            {STAGES.map((s) => (
              <Card
                key={s.id}
                onClick={() => setStage(s.id)}
                style={{
                  cursor: "pointer",
                  borderColor: stage === s.id ? theme.rose : theme.line,
                  background: stage === s.id ? `${theme.rose}0c` : theme.cream,
                }}
              >
                <div style={{ fontFamily: theme.sans, fontSize: "16px", fontWeight: 700, color: theme.ink }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: theme.sans, fontSize: "13px", color: theme.muted, marginTop: "4px" }}>
                  {s.blurb}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <SectionTitle
            eyebrow="Symptoms"
            title="What would you like to track?"
            sub="Pick the ones that matter to you. You can change these any time."
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {SYMPTOMS.map((s) => (
              <Chip
                key={s.id}
                glyph={s.glyph}
                active={symptoms.includes(s.id)}
                onClick={() => toggle(symptoms, setSymptoms, s.id)}
              >
                {s.label}
              </Chip>
            ))}
          </div>
          <div style={{ fontFamily: theme.sans, fontSize: "12px", color: theme.muted, marginTop: "14px" }}>
            {symptoms.length} selected
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <SectionTitle
            eyebrow="Optional"
            title="Cycle & medications"
            sub="If your periods are still happening, adding cycle info sharpens the hard-day forecast. Skip anything that doesn't apply."
          />
          <Card style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Typical cycle length (days)</label>
            <input
              type="number"
              min={20}
              max={60}
              placeholder="e.g. 28"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              style={inputStyle}
            />
            <label style={{ ...labelStyle, marginTop: "14px" }}>First day of your last period</label>
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              style={inputStyle}
            />
          </Card>
          <Card>
            <label style={labelStyle}>HRT / medications you're taking</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
              {HRT_TYPES.map((t) => (
                <Chip key={t} active={hrt.includes(t)} onClick={() => toggle(hrt, setHrt, t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </Card>
        </div>
      )}

      {step === 3 && (
        <div>
          <SectionTitle
            eyebrow="Goals"
            title="What matters most right now?"
            sub="We'll keep your coaching focused on these."
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {GOALS.map((g) => (
              <Chip key={g.id} active={goals.includes(g.id)} onClick={() => toggle(goals, setGoals, g.id)}>
                {g.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
        {step > 0 && (
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <div style={{ flex: 1 }} />
        {step < 3 ? (
          <Button variant="primary" onClick={() => canNext && setStep(step + 1)} style={{ opacity: canNext ? 1 : 0.5 }}>
            Continue
          </Button>
        ) : (
          <Button variant="accent" onClick={finish}>
            Start tracking →
          </Button>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  fontFamily: theme.sans,
  fontSize: "12px",
  color: theme.muted,
  fontWeight: 700,
  display: "block",
  marginBottom: "6px",
};
const inputStyle = {
  width: "100%",
  padding: "12px",
  border: `1px solid ${theme.line}`,
  borderRadius: "8px",
  fontFamily: theme.sans,
  fontSize: "14px",
  color: theme.ink,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};
