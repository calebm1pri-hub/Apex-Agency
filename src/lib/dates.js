// Date helpers — all local-time, no external date library.
// Entries are keyed by "YYYY-MM-DD" strings.

export function toKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey() {
  return toKey(new Date());
}

// Add (or subtract) whole days to a date key, returning a new key.
export function addDays(key, n) {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

// Whole-day difference a - b (positive if a is later than b).
export function daysBetween(aKey, bKey) {
  const MS = 24 * 60 * 60 * 1000;
  const a = fromKey(aKey).getTime();
  const b = fromKey(bKey).getTime();
  return Math.round((a - b) / MS);
}

// Ascending list of every day key in the last `n` days, ending today.
export function lastNDays(n, endKey = todayKey()) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(endKey, -i));
  return out;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function prettyDate(key, { weekday = false } = {}) {
  const d = fromKey(key);
  const base = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return weekday ? `${WEEKDAYS[d.getDay()]}, ${base}` : base;
}

export function prettyRange(startKey, endKey) {
  return `${prettyDate(startKey)} – ${prettyDate(endKey)}, ${fromKey(endKey).getFullYear()}`;
}

export function weekdayIndex(key) {
  return fromKey(key).getDay(); // 0 = Sunday
}
