"use client";
import { useState } from "react";
import { SYMPTOM_BY_ID } from "../lib/catalog";
import { lastNDays, weekdayIndex, prettyDate, todayKey } from "../lib/dates";
import { series, metrics, streak, entryLoad, maxLoad } from "../lib/insights";
import { theme, Card, SectionTitle, SparkLine, StatTile, Heatmap, Reveal } from "./ui";

const RANGES = [
  { days: 7, label: "7d" },
  { days: 30, label: "30d" },
  { days: 90, label: "90d" },
];

export default function Dashboard({ state }) {
  const { entries, profile } = state;
  const [range, setRange] = useState(30);
  const dayKeys = lastNDays(range);

  const loggedInRange = dayKeys.filter((k) => entries[k]).length;
  const strk = streak(entries);
  const mL = maxLoad(profile);

  // Top tracked symptoms by average severity in range.
  const tracked = profile?.trackedSymptoms || [];
  const topSymptoms = tracked
    .map((id) => {
      const s = series(entries, dayKeys, metrics.symptom(id))
        .map((d) => d.value)
        .filter((v) => v != null);
      const avg = s.length ? s.reduce((a, b) => a + b, 0) / s.length : 0;
      return { id, avg };
    })
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 3)
    .filter((x) => x.avg > 0);

  const heat = buildHeatmap(entries, mL);

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 20px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <SectionTitle eyebrow="Your trends" title="Dashboard" />
        <div style={{ display: "flex", gap: "6px" }}>
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setRange(r.days)}
              style={{
                padding: "7px 14px",
                borderRadius: "999px",
                border: range === r.days ? `1.5px solid ${theme.plum}` : `1px solid ${theme.line}`,
                background: range === r.days ? `${theme.plum}10` : theme.cream,
                color: range === r.days ? theme.plum : theme.muted,
                fontFamily: theme.sans,
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loggedInRange === 0 ? (
        <Card style={{ textAlign: "center", padding: "40px 20px", marginTop: "8px" }}>
          <div style={{ fontSize: "34px", marginBottom: "10px" }}>🌤️</div>
          <div style={{ fontFamily: theme.serif, fontSize: "20px", color: theme.ink, marginBottom: "6px" }}>
            No check-ins yet in this range
          </div>
          <div style={{ fontFamily: theme.sans, fontSize: "14px", color: theme.muted }}>
            Head to Check-in and log today. Your trends build from there.
          </div>
        </Card>
      ) : (
        <>
          {/* stat tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "8px", marginBottom: "16px" }}>
            <StatTile value={strk} label="Day streak" accent={theme.rose} />
            <StatTile value={loggedInRange} label={`Check-ins / ${range}d`} accent={theme.plum} />
            <StatTile value={`${Math.round((loggedInRange / range) * 100)}%`} label="Coverage" accent={theme.plumSoft} />
          </div>

          {/* calendar heatmap */}
          <Reveal>
            <Card style={{ marginBottom: "14px" }}>
              <CardHeading>Daily symptom load</CardHeading>
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", overflowX: "auto", paddingBottom: "4px" }}>
                <Heatmap
                  weeks={heat.weeks}
                  colorFor={(cell) => loadColor(cell.intensity)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px" }}>
                <span style={{ fontFamily: theme.sans, fontSize: "10px", color: theme.muted }}>lighter</span>
                {[0, 0.25, 0.5, 0.75, 1].map((i) => (
                  <div key={i} style={{ width: "13px", height: "13px", borderRadius: "3px", background: loadColor(i), border: i === 0 ? `1px solid ${theme.line}` : "none" }} />
                ))}
                <span style={{ fontFamily: theme.sans, fontSize: "10px", color: theme.muted }}>heavier</span>
              </div>
            </Card>
          </Reveal>

          {/* wellbeing sparklines */}
          <Reveal delay={0.05}>
            <Card style={{ marginBottom: "14px" }}>
              <CardHeading>Wellbeing</CardHeading>
              <TrendRow label="Mood" color={theme.rose} data={series(entries, dayKeys, metrics.mood)} min={1} max={5} />
              <TrendRow label="Energy" color={theme.plum} data={series(entries, dayKeys, metrics.energy)} min={1} max={5} />
              <TrendRow label="Sleep (hrs)" color={theme.green} data={series(entries, dayKeys, metrics.sleepHours)} />
            </Card>
          </Reveal>

          {/* top symptoms sparklines */}
          {topSymptoms.length > 0 && (
            <Reveal delay={0.1}>
              <Card>
                <CardHeading>Most active symptoms</CardHeading>
                {topSymptoms.map((s) => (
                  <TrendRow
                    key={s.id}
                    label={`${SYMPTOM_BY_ID[s.id]?.glyph || ""} ${SYMPTOM_BY_ID[s.id]?.label || s.id}`}
                    color={theme.roseSoft}
                    data={series(entries, dayKeys, metrics.symptom(s.id))}
                    min={0}
                    max={3}
                    trailColor={theme.rose}
                  />
                ))}
              </Card>
            </Reveal>
          )}
        </>
      )}
    </div>
  );
}

function TrendRow({ label, color, data, min, max, trailColor }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "8px 0", borderTop: `1px solid ${theme.line}` }}>
      <div style={{ flex: "0 0 108px", fontFamily: theme.sans, fontSize: "12px", color: theme.ink }}>{label}</div>
      <div style={{ flex: 1 }}>
        <SparkLine data={data} color={trailColor || color} min={min} max={max} />
      </div>
    </div>
  );
}

function CardHeading({ children }) {
  return (
    <div style={{ fontFamily: theme.sans, fontSize: "13px", fontWeight: 700, color: theme.plum, marginBottom: "10px" }}>
      {children}
    </div>
  );
}

function loadColor(intensity) {
  if (intensity <= 0) return theme.cream;
  // interpolate peach → rose → plum
  const stops = [
    [0.0, [246, 237, 233]],
    [0.5, [232, 167, 177]],
    [1.0, [91, 58, 91]],
  ];
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (intensity >= stops[i][0] && intensity <= stops[i + 1][0]) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const t = (intensity - lo[0]) / (hi[0] - lo[0] || 1);
  const c = lo[1].map((v, i) => Math.round(v + (hi[1][i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

// Build a column-per-week grid (Sun..Sat rows) for the last ~13 weeks.
function buildHeatmap(entries, mL) {
  const days = lastNDays(91);
  // pad the front so the first column starts on Sunday
  const firstDow = weekdayIndex(days[0]);
  const padded = [...Array(firstDow).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) {
    const week = padded.slice(i, i + 7).map((k) => {
      if (!k) return null;
      const e = entries[k];
      const load = e ? entryLoad(e) : 0;
      const intensity = e ? (mL > 0 ? Math.min(1, load / mL) : 0) : 0;
      return {
        key: k,
        intensity: e ? Math.max(0.06, intensity) : 0, // faint mark for logged-but-symptom-free days
        title: e ? `${prettyDate(k)} · load ${load}` : prettyDate(k),
        logged: !!e,
      };
    });
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return { weeks };
}
