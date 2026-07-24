"use client";
import { useState, useRef } from "react";
import { STAGES, SEVERITY_LABELS } from "../lib/catalog";
import { todayKey, addDays, prettyRange, prettyDate } from "../lib/dates";
import { reportStats, correlations, forecast } from "../lib/insights";
import { theme, Card, Button, SectionTitle } from "./ui";

const RANGES = [
  { days: 30, label: "Last 30 days" },
  { days: 90, label: "Last 90 days" },
  { days: 365, label: "Last year" },
];

export default function Report({ state, onExport, onImport, onErase }) {
  const { entries, profile } = state;
  const [rangeDays, setRangeDays] = useState(90);
  const [importErr, setImportErr] = useState("");
  const [confirmErase, setConfirmErase] = useState(false);
  const fileRef = useRef(null);

  const endKey = todayKey();
  const startKey = addDays(endKey, -(rangeDays - 1));
  const stats = reportStats(entries, profile, startKey, endKey);
  const cors = correlations(entries, profile);
  const f = forecast(entries, profile);
  const stageLabel = STAGES.find((s) => s.id === profile?.stage)?.label || "—";
  const hrtList = (profile?.hrt || []).map((h) => h.name).join(", ") || "None recorded";

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        onImport(String(reader.result));
        setImportErr("");
      } catch {
        setImportErr("That file couldn't be read. Make sure it's a Navigator backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 20px 40px" }}>
      <SectionTitle
        eyebrow="Share & export"
        title="Doctor-ready report"
        sub="A clear summary for appointments — or a gentle briefing for a partner. Nothing is uploaded; export or print stays with you."
      />

      {/* range + actions */}
      <div className="no-print" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
        {RANGES.map((r) => (
          <button
            key={r.days}
            onClick={() => setRangeDays(r.days)}
            style={{
              padding: "7px 14px",
              borderRadius: "999px",
              border: rangeDays === r.days ? `1.5px solid ${theme.plum}` : `1px solid ${theme.line}`,
              background: rangeDays === r.days ? `${theme.plum}10` : theme.cream,
              color: rangeDays === r.days ? theme.plum : theme.muted,
              fontFamily: theme.sans,
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {r.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <Button variant="primary" onClick={() => window.print()}>
          Print / Save PDF
        </Button>
      </div>

      {/* ===== PRINTABLE REPORT ===== */}
      <div className="print-area">
        <Card style={{ marginBottom: "14px" }}>
          <div style={{ borderBottom: `2px solid ${theme.plum}`, paddingBottom: "12px", marginBottom: "14px" }}>
            <div style={{ fontFamily: theme.serif, fontSize: "22px", fontWeight: 700, color: theme.plum }}>
              Menopause Navigator — Summary
            </div>
            <div style={{ fontFamily: theme.sans, fontSize: "12px", color: theme.muted, marginTop: "4px" }}>
              {prettyRange(startKey, endKey)} · generated {prettyDate(endKey)}
            </div>
          </div>

          <Grid2>
            <Field label="Stage" value={stageLabel} />
            <Field label="HRT / medications" value={hrtList} />
            <Field label="Days logged" value={`${stats.logged} of ${stats.nDays} (${stats.coverage}%)`} />
            <Field
              label="HRT adherence"
              value={stats.adherence == null ? "—" : `${stats.adherence}%`}
            />
            <Field label="Avg mood (1–5)" value={fmt(stats.moodAvg)} />
            <Field label="Avg energy (1–5)" value={fmt(stats.energyAvg)} />
            <Field label="Avg sleep (hrs)" value={fmt(stats.sleepAvg)} />
            <Field label="Forecast" value={forecastWord(f.level)} />
          </Grid2>
        </Card>

        {/* symptom table */}
        <Card style={{ marginBottom: "14px" }}>
          <ReportHeading>Symptom summary</ReportHeading>
          {stats.symptomRows.length === 0 ? (
            <Muted>No symptoms tracked in this period.</Muted>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Symptom", "Days present", "Avg severity", "Peak"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        textAlign: i === 0 ? "left" : "center",
                        fontFamily: theme.sans,
                        fontSize: "11px",
                        color: theme.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.line}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.symptomRows.map((r) => (
                  <tr key={r.id}>
                    <td style={tdStyle("left")}>{r.label}</td>
                    <td style={tdStyle("center")}>{r.daysPresent}</td>
                    <td style={tdStyle("center")}>{fmt(r.avgSev)} / 3</td>
                    <td style={tdStyle("center")}>{SEVERITY_LABELS[Math.round(r.peak)] || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* notable patterns */}
        {cors.length > 0 && (
          <Card style={{ marginBottom: "14px" }}>
            <ReportHeading>Notable patterns</ReportHeading>
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
              {cors.slice(0, 4).map((c) => (
                <li key={`${c.triggerId}-${c.symptomId}`} style={{ fontFamily: theme.sans, fontSize: "13px", color: theme.ink, lineHeight: 1.6, marginBottom: "4px" }}>
                  {c.text}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <div style={{ fontFamily: theme.sans, fontSize: "10px", color: theme.muted, lineHeight: 1.6, padding: "0 4px" }}>
          Self-reported data captured with Menopause Navigator. Averages exclude days not logged.
          This summary is for discussion with a clinician and is not a diagnosis.
        </div>
      </div>

      {/* ===== CAREGIVER SHARE (screen only) ===== */}
      <Card className="no-print" style={{ marginTop: "18px", background: `${theme.rose}0a`, borderColor: `${theme.rose}33` }}>
        <ReportHeading>For a partner or caregiver</ReportHeading>
        <div style={{ fontFamily: theme.sans, fontSize: "14px", color: theme.ink, lineHeight: 1.65 }}>
          {caregiverMessage(f.level, stats)}
        </div>
      </Card>

      {/* ===== DATA & PRIVACY (screen only) ===== */}
      <Card className="no-print" style={{ marginTop: "18px" }}>
        <ReportHeading>Your data & privacy</ReportHeading>
        <div style={{ fontFamily: theme.sans, fontSize: "13px", color: theme.muted, lineHeight: 1.6, marginBottom: "14px" }}>
          Everything lives only in this browser. Back it up or move it to another device with export / import.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <Button variant="ghost" onClick={onExport}>
            Export backup (JSON)
          </Button>
          <Button variant="ghost" onClick={() => fileRef.current?.click()}>
            Import backup
          </Button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleImportFile} style={{ display: "none" }} />
          {!confirmErase ? (
            <Button variant="danger" onClick={() => setConfirmErase(true)}>
              Erase all data
            </Button>
          ) : (
            <>
              <Button variant="danger" onClick={onErase}>
                Yes, erase everything
              </Button>
              <Button variant="ghost" onClick={() => setConfirmErase(false)}>
                Cancel
              </Button>
            </>
          )}
        </div>
        {importErr && (
          <div style={{ fontFamily: theme.sans, fontSize: "12px", color: theme.red, marginTop: "10px" }}>{importErr}</div>
        )}
      </Card>
    </div>
  );
}

/* ── helpers ── */
function Field({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: theme.sans, fontSize: "11px", color: theme.muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </div>
      <div style={{ fontFamily: theme.sans, fontSize: "15px", color: theme.ink, fontWeight: 600, marginTop: "2px" }}>{value}</div>
    </div>
  );
}
function Grid2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>{children}</div>;
}
function ReportHeading({ children }) {
  return (
    <div style={{ fontFamily: theme.sans, fontSize: "13px", fontWeight: 700, color: theme.plum, marginBottom: "10px" }}>
      {children}
    </div>
  );
}
function Muted({ children }) {
  return <div style={{ fontFamily: theme.sans, fontSize: "13px", color: theme.muted }}>{children}</div>;
}
function tdStyle(align) {
  return {
    textAlign: align,
    fontFamily: theme.sans,
    fontSize: "13px",
    color: theme.ink,
    padding: "8px 4px",
    borderBottom: `1px solid ${theme.line}`,
  };
}
function fmt(n) {
  return n ? n.toFixed(1) : "—";
}
function forecastWord(level) {
  return level === "red" ? "Harder days likely" : level === "amber" ? "Take it easy" : "Steady";
}
function caregiverMessage(level, stats) {
  const lead =
    level === "red"
      ? "The next couple of days may be harder than usual."
      : level === "amber"
      ? "The next couple of days might be a little tougher."
      : "Things look fairly steady right now.";
  const help =
    level === "green"
      ? "A bit of patience and normal support goes a long way."
      : "Small things help: keep the space cool, protect her sleep, take a few tasks off her plate, and lead with patience rather than fixing.";
  const sleepNote =
    stats.sleepAvg && stats.sleepAvg < 6.5 ? " Sleep has been running short lately, which can amplify everything." : "";
  return `${lead} ${help}${sleepNote}`;
}
