"use client";
import { useState } from "react";
import { SYMPTOM_BY_ID, TRIGGERS, SEVERITY_LABELS, SCALE_1_5 } from "../lib/catalog";
import { todayKey, prettyDate } from "../lib/dates";
import { theme, Card, Button, Chip, SectionTitle, SeveritySlider, Scale1to5 } from "./ui";

// Core daily log. Upserts an entry for the chosen date. `existing` is the
// currently-stored entry for that date (or undefined).
export default function DailyCheckin({ profile, dateKey, existing, onSave, onPickDate }) {
  const blank = {
    mood: null,
    energy: null,
    sleepHours: "",
    sleepQuality: null,
    symptoms: {},
    triggers: [],
    exercise: false,
    hrtTaken: false,
    helped: "",
    note: "",
  };
  const [form, setForm] = useState({ ...blank, ...(existing || {}) });
  const [saved, setSaved] = useState(false);

  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setSaved(false);
  };
  const setSymptom = (id, v) => set({ symptoms: { ...form.symptoms, [id]: v } });
  const toggleTrigger = (id) =>
    set({
      triggers: form.triggers.includes(id)
        ? form.triggers.filter((t) => t !== id)
        : [...form.triggers, id],
    });

  const save = () => {
    const clean = {
      ...form,
      sleepHours: form.sleepHours === "" ? null : Number(form.sleepHours),
    };
    onSave(dateKey, clean);
    setSaved(true);
  };

  const tracked = profile?.trackedSymptoms || [];
  const isToday = dateKey === todayKey();

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 20px 40px" }}>
      <SectionTitle
        eyebrow={isToday ? "Today's check-in" : "Check-in"}
        title={isToday ? "How are you today?" : `Logging ${prettyDate(dateKey, { weekday: true })}`}
        sub="Takes under a minute. Everything is optional."
      />

      {/* date control */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <label style={{ fontFamily: theme.sans, fontSize: "12px", color: theme.muted, fontWeight: 700 }}>
          Date
        </label>
        <input
          type="date"
          value={dateKey}
          max={todayKey()}
          onChange={(e) => onPickDate(e.target.value)}
          style={{
            padding: "8px 10px",
            border: `1px solid ${theme.line}`,
            borderRadius: "8px",
            fontFamily: theme.sans,
            fontSize: "13px",
            color: theme.ink,
            background: "#fff",
          }}
        />
      </div>

      {/* mood & energy */}
      <Card style={{ marginBottom: "12px" }}>
        <FieldLabel>Mood {form.mood ? `— ${SCALE_1_5[form.mood]}` : ""}</FieldLabel>
        <Scale1to5 value={form.mood} onChange={(v) => set({ mood: v })} />
        <FieldLabel style={{ marginTop: "16px" }}>
          Energy {form.energy ? `— ${SCALE_1_5[form.energy]}` : ""}
        </FieldLabel>
        <Scale1to5 value={form.energy} onChange={(v) => set({ energy: v })} />
      </Card>

      {/* sleep */}
      <Card style={{ marginBottom: "12px" }}>
        <FieldLabel>Sleep</FieldLabel>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 110px" }}>
            <div style={{ fontFamily: theme.sans, fontSize: "11px", color: theme.muted, marginBottom: "4px" }}>
              Hours
            </div>
            <input
              type="number"
              min={0}
              max={16}
              step={0.5}
              placeholder="7.5"
              value={form.sleepHours}
              onChange={(e) => set({ sleepHours: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${theme.line}`,
                borderRadius: "8px",
                fontFamily: theme.sans,
                fontSize: "14px",
                boxSizing: "border-box",
                background: "#fff",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: theme.sans, fontSize: "11px", color: theme.muted, marginBottom: "4px" }}>
              Quality {form.sleepQuality ? `— ${SCALE_1_5[form.sleepQuality]}` : ""}
            </div>
            <Scale1to5 value={form.sleepQuality} onChange={(v) => set({ sleepQuality: v })} />
          </div>
        </div>
      </Card>

      {/* symptoms */}
      {tracked.length > 0 && (
        <Card style={{ marginBottom: "12px" }}>
          <FieldLabel>Symptoms</FieldLabel>
          <div style={{ display: "grid", gap: "16px", marginTop: "8px" }}>
            {tracked.map((id) => {
              const s = SYMPTOM_BY_ID[id];
              if (!s) return null;
              return (
                <div key={id}>
                  <div style={{ fontFamily: theme.sans, fontSize: "13px", color: theme.ink, marginBottom: "4px" }}>
                    <span aria-hidden>{s.glyph}</span> {s.label}
                  </div>
                  <SeveritySlider
                    value={form.symptoms[id] ?? 0}
                    onChange={(v) => setSymptom(id, v)}
                    labels={SEVERITY_LABELS}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* triggers */}
      <Card style={{ marginBottom: "12px" }}>
        <FieldLabel>Anything today? (triggers)</FieldLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
          {TRIGGERS.map((t) => (
            <Chip key={t.id} glyph={t.glyph} active={form.triggers.includes(t.id)} onClick={() => toggleTrigger(t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
          <Chip active={form.exercise} onClick={() => set({ exercise: !form.exercise })} glyph="🚶">
            Moved / exercised
          </Chip>
          {(profile?.hrt || []).length > 0 && (
            <Chip active={form.hrtTaken} onClick={() => set({ hrtTaken: !form.hrtTaken })} glyph="💊">
              Took HRT / meds
            </Chip>
          )}
        </div>
      </Card>

      {/* what helped + note */}
      <Card style={{ marginBottom: "20px" }}>
        <FieldLabel>What helped today? (optional)</FieldLabel>
        <input
          type="text"
          placeholder="e.g. a cool room, a walk, magnesium…"
          value={form.helped}
          onChange={(e) => set({ helped: e.target.value })}
          style={noteInput}
        />
        <FieldLabel style={{ marginTop: "14px" }}>Notes (optional)</FieldLabel>
        <textarea
          rows={2}
          placeholder="Anything else you want to remember…"
          value={form.note}
          onChange={(e) => set({ note: e.target.value })}
          style={{ ...noteInput, resize: "vertical" }}
        />
      </Card>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Button variant="accent" onClick={save} style={{ flex: 1 }}>
          {saved ? "Saved ✓" : existing ? "Update check-in" : "Save check-in"}
        </Button>
      </div>
      {saved && (
        <div style={{ fontFamily: theme.sans, fontSize: "12px", color: theme.green, textAlign: "center", marginTop: "10px" }}>
          Saved on your device.
        </div>
      )}
    </div>
  );
}

function FieldLabel({ children, style = {} }) {
  return (
    <div style={{ fontFamily: theme.sans, fontSize: "13px", fontWeight: 700, color: theme.plum, ...style }}>
      {children}
    </div>
  );
}

const noteInput = {
  width: "100%",
  padding: "11px",
  border: `1px solid ${theme.line}`,
  borderRadius: "8px",
  fontFamily: theme.sans,
  fontSize: "14px",
  color: theme.ink,
  outline: "none",
  boxSizing: "border-box",
  marginTop: "6px",
  background: "#fff",
};
