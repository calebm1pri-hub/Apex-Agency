"use client";
import { useState, useEffect } from "react";
import {
  load,
  save,
  clear,
  emptyState,
  hasProfile,
  setProfile,
  upsertEntry,
  downloadBackup,
  importJson,
} from "../lib/storage";
import { todayKey } from "../lib/dates";
import { theme } from "../components/ui";
import Onboarding from "../components/Onboarding";
import DailyCheckin from "../components/DailyCheckin";
import Dashboard from "../components/Dashboard";
import Forecast from "../components/Forecast";
import Insights from "../components/Insights";
import Report from "../components/Report";

const TABS = [
  { id: "checkin", label: "Check-in", glyph: "✍️" },
  { id: "dashboard", label: "Trends", glyph: "📈" },
  { id: "forecast", label: "Forecast", glyph: "🌤️" },
  { id: "insights", label: "Insights", glyph: "💡" },
  { id: "report", label: "Report", glyph: "📄" },
];

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState(emptyState());
  const [tab, setTab] = useState("checkin");
  const [checkinDate, setCheckinDate] = useState(todayKey());

  // Hydrate from localStorage only on the client (avoids SSR mismatch).
  useEffect(() => {
    const loaded = load();
    setState(loaded);
    setMounted(true);
  }, []);

  // Persist on every change once mounted.
  const commit = (next) => {
    setState(next);
    save(next);
  };

  const handleOnboarding = (profile) => {
    commit(setProfile(state, profile));
    setTab("checkin");
  };

  const handleSaveEntry = (dateKey, entry) => {
    commit(upsertEntry(state, dateKey, entry));
  };

  const handleExport = () => {
    downloadBackup(state, `navigator-backup-${todayKey()}.json`);
  };

  const handleImport = (text) => {
    const next = importJson(text); // throws on bad input → Report shows error
    commit(next);
    setTab("dashboard");
  };

  const handleErase = () => {
    clear();
    const fresh = emptyState();
    setState(fresh);
    setTab("checkin");
    setCheckinDate(todayKey());
  };

  // ---- render ----
  if (!mounted) {
    return (
      <Shell>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ fontFamily: theme.serif, fontSize: "20px", color: theme.plumSoft }}>Loading your space…</div>
        </div>
      </Shell>
    );
  }

  if (!hasProfile(state)) {
    return (
      <Shell>
        <Header />
        <Onboarding onComplete={handleOnboarding} />
      </Shell>
    );
  }

  const view = {
    checkin: (
      <DailyCheckin
        profile={state.profile}
        dateKey={checkinDate}
        existing={state.entries[checkinDate]}
        onSave={handleSaveEntry}
        onPickDate={setCheckinDate}
      />
    ),
    dashboard: <Dashboard state={state} />,
    forecast: <Forecast state={state} />,
    insights: <Insights state={state} />,
    report: <Report state={state} onExport={handleExport} onImport={handleImport} onErase={handleErase} />,
  }[tab];

  return (
    <Shell>
      <Header />
      <div style={{ paddingBottom: "84px" }}>{view}</div>

      {/* bottom tab bar */}
      <nav
        className="no-print"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(255,250,247,0.94)",
          backdropFilter: "blur(10px)",
          borderTop: `1px solid ${theme.line}`,
          display: "flex",
          justifyContent: "space-around",
          padding: "8px 4px 10px",
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                flex: 1,
                padding: "4px 0",
              }}
            >
              <span style={{ fontSize: "18px", opacity: active ? 1 : 0.5, transition: "opacity 0.2s" }}>{t.glyph}</span>
              <span
                style={{
                  fontFamily: theme.sans,
                  fontSize: "10px",
                  fontWeight: active ? 700 : 500,
                  color: active ? theme.plum : theme.muted,
                }}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: theme.peach, color: theme.ink }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {/* print + reset styles */}
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        input, textarea, button { font-family: inherit; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          .print-area { display: block !important; }
        }
      `}</style>
      {children}
    </div>
  );
}

function Header() {
  return (
    <header
      className="no-print"
      style={{
        padding: "18px 20px 6px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        maxWidth: "680px",
        margin: "0 auto",
      }}
    >
      <span style={{ color: theme.rose, fontSize: "18px" }}>❋</span>
      <span style={{ fontFamily: theme.serif, fontSize: "18px", fontWeight: 700, color: theme.plum, letterSpacing: "-0.3px" }}>
        Navigator
      </span>
      <span
        style={{
          marginLeft: "auto",
          fontFamily: theme.sans,
          fontSize: "10px",
          color: theme.muted,
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        🔒 Private to this device
      </span>
    </header>
  );
}
