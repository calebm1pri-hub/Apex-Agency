"use client";
import { useState, useEffect, useRef } from "react";

/* ─── THEME ─── warm, calm women's-health palette ─── */
export const theme = {
  serif: "'Playfair Display', Georgia, serif",
  sans: "'DM Sans', 'Helvetica Neue', sans-serif",
  plum: "#5b3a5b", // deep primary
  plumSoft: "#7d5a7d",
  rose: "#c96a7a", // accent
  roseSoft: "#e8a7b1",
  peach: "#f6ede9", // page background
  cream: "#fffaf7",
  ink: "#2e2430", // text
  muted: "#8a7c86",
  line: "#ece0e4",
  green: "#4f9d7d",
  amber: "#dd9b3f",
  red: "#cf5b52",
};

/* ─── scroll-reveal (lifted from original page.jsx) ─── */
export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView(0.12);
  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── primitives ─── */
export function Card({ children, style = {}, ...rest }) {
  return (
    <div
      style={{
        background: theme.cream,
        border: `1px solid ${theme.line}`,
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 1px 2px rgba(91,58,91,0.04)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      {eyebrow && (
        <div
          style={{
            fontFamily: theme.sans,
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: theme.rose,
            marginBottom: "8px",
            fontWeight: 700,
          }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        style={{
          fontFamily: theme.serif,
          fontSize: "26px",
          fontWeight: 700,
          margin: 0,
          color: theme.ink,
          lineHeight: 1.15,
          letterSpacing: "-0.5px",
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            fontFamily: theme.sans,
            fontSize: "14px",
            color: theme.muted,
            margin: "8px 0 0",
            lineHeight: 1.6,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function Button({ children, variant = "primary", style = {}, ...rest }) {
  const variants = {
    primary: { background: theme.plum, color: "#fff", border: "none" },
    accent: { background: theme.rose, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: theme.plum, border: `1px solid ${theme.line}` },
    danger: { background: "transparent", color: theme.red, border: `1px solid ${theme.red}55` },
  };
  return (
    <button
      style={{
        padding: "13px 20px",
        borderRadius: "10px",
        fontFamily: theme.sans,
        fontSize: "14px",
        fontWeight: 700,
        cursor: "pointer",
        transition: "transform 0.12s ease, opacity 0.2s ease",
        ...variants[variant],
        ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      {...rest}
    >
      {children}
    </button>
  );
}

// Selectable chip / pill (multi-select friendly).
export function Chip({ active, onClick, children, glyph }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "9px 14px",
        borderRadius: "999px",
        border: active ? `1.5px solid ${theme.rose}` : `1px solid ${theme.line}`,
        background: active ? `${theme.rose}14` : theme.cream,
        color: active ? theme.plum : theme.muted,
        fontFamily: theme.sans,
        fontSize: "13px",
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {glyph && <span aria-hidden>{glyph}</span>}
      {children}
    </button>
  );
}

export function StatTile({ value, label, accent = theme.plum }) {
  return (
    <div
      style={{
        padding: "16px",
        background: theme.cream,
        borderRadius: "12px",
        border: `1px solid ${theme.line}`,
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: theme.serif, fontSize: "28px", fontWeight: 700, color: accent }}>
        {value}
      </div>
      <div style={{ fontFamily: theme.sans, fontSize: "11px", color: theme.muted, marginTop: "4px", lineHeight: 1.3 }}>
        {label}
      </div>
    </div>
  );
}

/* ─── severity slider (0..3) ─── */
export function SeveritySlider({ value, onChange, labels }) {
  const max = labels.length - 1;
  return (
    <div>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: theme.rose, height: "6px", cursor: "pointer" }}
      />
      <div
        style={{
          fontFamily: theme.sans,
          fontSize: "11px",
          color: (value ?? 0) > 0 ? theme.rose : theme.muted,
          fontWeight: (value ?? 0) > 0 ? 700 : 500,
          marginTop: "2px",
        }}
      >
        {labels[value ?? 0]}
      </div>
    </div>
  );
}

/* ─── 1..5 segmented scale (mood / energy / sleep quality) ─── */
export function Scale1to5({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: "8px",
            border: value === n ? `1.5px solid ${theme.plum}` : `1px solid ${theme.line}`,
            background: value === n ? `${theme.plum}12` : theme.cream,
            color: value === n ? theme.plum : theme.muted,
            fontFamily: theme.sans,
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

/* ─── SVG sparkline ─── data: [{key, value}], value may be null (gap) ─── */
export function SparkLine({ data, color = theme.rose, min = null, max = null, height = 44 }) {
  const vals = data.map((d) => d.value).filter((v) => v != null);
  if (vals.length < 2) {
    return (
      <div style={{ fontFamily: theme.sans, fontSize: "11px", color: theme.muted, padding: "12px 0" }}>
        Not enough data yet
      </div>
    );
  }
  const lo = min ?? Math.min(...vals);
  const hi = max ?? Math.max(...vals);
  const span = hi - lo || 1;
  const w = 100;
  const n = data.length;
  const x = (i) => (n === 1 ? 0 : (i / (n - 1)) * w);
  const y = (v) => height - ((v - lo) / span) * (height - 6) - 3;

  // Build a path, breaking on null gaps.
  let d = "";
  let pen = false;
  data.forEach((pt, i) => {
    if (pt.value == null) {
      pen = false;
      return;
    }
    const cmd = pen ? "L" : "M";
    d += `${cmd}${x(i).toFixed(1)},${y(pt.value).toFixed(1)} `;
    pen = true;
  });

  const last = [...data].reverse().find((p) => p.value != null);
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {last && (
        <circle cx={x(data.indexOf(last))} cy={y(last.value)} r="2.4" fill={color} />
      )}
    </svg>
  );
}

/* ─── horizontal bar row (symptom frequency etc.) ─── */
export function BarRow({ label, value, max, color = theme.plumSoft, suffix = "" }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontFamily: theme.sans, fontSize: "12px", color: theme.ink }}>{label}</span>
        <span style={{ fontFamily: theme.sans, fontSize: "12px", color: theme.muted, fontWeight: 700 }}>
          {value}
          {suffix}
        </span>
      </div>
      <div style={{ height: "8px", background: theme.line, borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "999px", transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

/* ─── calendar heatmap ─── days: [{key, intensity 0..1, label}] ─── */
export function Heatmap({ weeks, colorFor }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {week.map((cell, ci) => (
            <div
              key={ci}
              title={cell ? cell.title : ""}
              style={{
                width: "13px",
                height: "13px",
                borderRadius: "3px",
                background: cell ? colorFor(cell) : "transparent",
                border: cell && cell.intensity === 0 ? `1px solid ${theme.line}` : "none",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
