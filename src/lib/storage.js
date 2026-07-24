// Privacy-first persistence: everything lives in localStorage, nothing is
// ever sent anywhere. A single versioned blob under one key.

export const STORAGE_KEY = "pmnav.v1";
export const SCHEMA_VERSION = 1;

export function emptyState() {
  return { version: SCHEMA_VERSION, profile: null, entries: {} };
}

// Load the full state. Returns a fresh empty state if nothing is stored or
// the stored data is unreadable (never throws to the UI).
export function load() {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return migrate(parsed);
  } catch {
    return emptyState();
  }
}

export function save(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked — fail silently; the in-memory state still works.
  }
}

export function clear() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

// Bring older/foreign blobs up to the current shape defensively.
function migrate(state) {
  if (!state || typeof state !== "object") return emptyState();
  const base = emptyState();
  return {
    version: SCHEMA_VERSION,
    profile: state.profile ?? base.profile,
    entries: state.entries && typeof state.entries === "object" ? state.entries : {},
  };
}

export function hasProfile(state) {
  return !!(state && state.profile && state.profile.stage);
}

// --- convenience updaters (return new state, immutable-style) ---

export function setProfile(state, profile) {
  return { ...state, profile };
}

export function upsertEntry(state, dateKey, entry) {
  return {
    ...state,
    entries: { ...state.entries, [dateKey]: entry },
  };
}

// --- export / import for backup & device transfer ---

export function exportJson(state) {
  return JSON.stringify(state, null, 2);
}

// Parse an imported string; throws on malformed input so the caller can
// surface a friendly error.
export function importJson(text) {
  const parsed = JSON.parse(text);
  return migrate(parsed);
}

// Trigger a browser download of the current data.
export function downloadBackup(state, filename) {
  if (typeof window === "undefined") return;
  const blob = new Blob([exportJson(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "navigator-backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
