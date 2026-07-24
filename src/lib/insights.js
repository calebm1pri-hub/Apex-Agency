// On-device analytics: symptom load, trends, trigger correlations, and a
// transparent "hard-day" forecast. All pure functions over the entries map —
// no ML, no network, just readable heuristics with named, tunable constants.

import { SYMPTOM_BY_ID, TRIGGER_BY_ID, SEVERITY_MAX } from "./catalog";
import { toKey, addDays, daysBetween, todayKey, fromKey } from "./dates";

// ---- tunable thresholds ----
export const MIN_SAMPLE = 4; // min days on each side before we trust a correlation
export const MIN_EFFECT = 0.25; // min avg-severity gap (0..3 scale) to surface
export const LUTEAL_WINDOW = 5; // days before expected period counted as high-risk
export const SLEEP_DEBT_HOURS = 6; // nights below this count as short sleep
export const RECENT_DAYS = 7; // window for "recent" trend/trigger signals

// Sum of symptom severities for a single entry (the day's overall "load").
export function entryLoad(entry) {
  if (!entry || !entry.symptoms) return 0;
  return Object.values(entry.symptoms).reduce((a, b) => a + (b || 0), 0);
}

// Max possible load given how many symptoms the profile tracks — used to
// normalize the heatmap so colors are comparable across users.
export function maxLoad(profile) {
  const n = (profile?.trackedSymptoms || []).length || 1;
  return n * SEVERITY_MAX;
}

// Entries within the last `days`, ascending, as [{ key, entry }].
export function recentEntries(entries, days, endKey = todayKey()) {
  const startKey = addDays(endKey, -(days - 1));
  return Object.keys(entries)
    .filter((k) => k >= startKey && k <= endKey)
    .sort()
    .map((k) => ({ key: k, entry: entries[k] }));
}

function avg(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// ---- trends: a value series per metric over a day range (for sparklines) ----
export function series(entries, dayKeys, pick) {
  return dayKeys.map((k) => {
    const e = entries[k];
    return { key: k, value: e ? pick(e) : null };
  });
}

// Convenience metric pickers.
export const metrics = {
  mood: (e) => e.mood ?? null,
  energy: (e) => e.energy ?? null,
  sleepHours: (e) => (typeof e.sleepHours === "number" ? e.sleepHours : null),
  sleepQuality: (e) => e.sleepQuality ?? null,
  load: (e) => entryLoad(e),
  symptom: (id) => (e) => (e.symptoms ? e.symptoms[id] ?? 0 : 0),
};

// ---- logging streak (consecutive days ending today or yesterday) ----
export function streak(entries) {
  let count = 0;
  let cursor = todayKey();
  // Allow the streak to still count if today isn't logged yet.
  if (!entries[cursor]) cursor = addDays(cursor, -1);
  while (entries[cursor]) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

// ---- correlations: how much worse are symptoms on trigger days? ----
// For each (trigger, symptom) pair with enough data, compare average severity
// on days the trigger was present vs. absent. Returns ranked, plain-language
// findings. We look at same-day effects; alcohol/late-meal also next-day.
export function correlations(entries, profile) {
  const keys = Object.keys(entries).sort();
  if (keys.length < MIN_SAMPLE * 2) return [];
  const tracked = profile?.trackedSymptoms || [];
  const findings = [];

  for (const triggerId of Object.keys(TRIGGER_BY_ID)) {
    for (const symptomId of tracked) {
      const withVals = [];
      const withoutVals = [];
      for (const k of keys) {
        const e = entries[k];
        if (!e || !e.symptoms || e.symptoms[symptomId] == null) continue;
        const sev = e.symptoms[symptomId] || 0;
        const present = (e.triggers || []).includes(triggerId);
        if (present) withVals.push(sev);
        else withoutVals.push(sev);
      }
      if (withVals.length < MIN_SAMPLE || withoutVals.length < MIN_SAMPLE) continue;
      const aWith = avg(withVals);
      const aWithout = avg(withoutVals);
      const effect = aWith - aWithout;
      if (effect < MIN_EFFECT) continue; // only surface "makes it worse"
      const pct =
        aWithout > 0 ? Math.round((effect / aWithout) * 100) : null;
      findings.push({
        triggerId,
        symptomId,
        effect,
        pct,
        sample: withVals.length,
        text: buildCorrelationText(triggerId, symptomId, pct, effect, withVals.length),
      });
    }
  }

  return findings.sort((a, b) => b.effect - a.effect).slice(0, 6);
}

function buildCorrelationText(triggerId, symptomId, pct, effect, sample) {
  const t = TRIGGER_BY_ID[triggerId]?.label?.toLowerCase() || triggerId;
  const s = SYMPTOM_BY_ID[symptomId]?.label?.toLowerCase() || symptomId;
  const magnitude =
    pct != null ? `about ${pct}% worse` : `noticeably worse (+${effect.toFixed(1)})`;
  return `Your ${s} tends to be ${magnitude} on days with ${t} (seen across ${sample} days).`;
}

// ---- cycle phase estimate (only when cycle data is present) ----
// Returns { daysUntilPeriod, inLutealWindow } or null.
export function cyclePhase(profile, refKey = todayKey()) {
  if (!profile?.lastPeriod || !profile?.cycleLength) return null;
  const len = profile.cycleLength;
  let next = profile.lastPeriod;
  // Advance predicted period date until it's on/after the reference day.
  let guard = 0;
  while (daysBetween(refKey, next) > 0 && guard < 60) {
    next = addDays(next, len);
    guard += 1;
  }
  const daysUntil = daysBetween(next, refKey); // >= 0
  return {
    daysUntilPeriod: daysUntil,
    inLutealWindow: daysUntil <= LUTEAL_WINDOW && daysUntil >= 0,
    nextPeriodKey: next,
  };
}

// ---- hard-day forecast ----
// Combines recent symptom-load trend, cycle timing, recent trigger exposure,
// and sleep debt into a green/amber/red rating with human-readable reasons.
export function forecast(entries, profile, refKey = todayKey()) {
  const reasons = [];
  let score = 0;

  const recent = recentEntries(entries, RECENT_DAYS, refKey);
  const loads = recent.map((r) => entryLoad(r.entry));
  const maxL = maxLoad(profile);

  // (a) recent load trend: is the back half heavier than the front half?
  if (recent.length >= 4) {
    const half = Math.floor(recent.length / 2);
    const early = avg(loads.slice(0, half));
    const late = avg(loads.slice(half));
    if (late > early + maxL * 0.1) {
      score += 2;
      reasons.push("Your symptoms have been trending up over the past few days.");
    } else if (late < early - maxL * 0.1) {
      reasons.push("Your symptoms have been easing over the past few days.");
    }
  }

  // (b) overall recent severity level
  const recentAvg = avg(loads);
  if (maxL > 0 && recentAvg > maxL * 0.4) {
    score += 2;
    reasons.push("Recent days have carried a heavier-than-usual symptom load.");
  }

  // (c) cycle timing
  const phase = cyclePhase(profile, refKey);
  if (phase && phase.inLutealWindow) {
    score += 2;
    const d = phase.daysUntilPeriod;
    reasons.push(
      d === 0
        ? "Your period is expected around now — a common time for symptoms to peak."
        : `You're about ${d} day${d === 1 ? "" : "s"} from your expected period, when symptoms often intensify.`
    );
  }

  // (d) sleep debt in the recent window
  const shortNights = recent.filter(
    (r) => typeof r.entry.sleepHours === "number" && r.entry.sleepHours < SLEEP_DEBT_HOURS
  ).length;
  if (shortNights >= 2) {
    score += 1;
    reasons.push(`You've had ${shortNights} short nights of sleep recently.`);
  }

  // (e) recent trigger clustering (last 2 logged days)
  const last2 = recent.slice(-2);
  const recentTriggers = new Set();
  last2.forEach((r) => (r.entry.triggers || []).forEach((t) => recentTriggers.add(t)));
  if (recentTriggers.size >= 3) {
    score += 1;
    reasons.push("Several known triggers showed up in your last couple of check-ins.");
  }

  let level = "green";
  if (score >= 5) level = "red";
  else if (score >= 2) level = "amber";

  if (reasons.length === 0) {
    reasons.push("Nothing in your recent data points to a harder-than-usual stretch.");
  }

  return { level, score, reasons, phase, hasData: recent.length > 0 };
}

// ---- summary stats for the doctor report ----
export function reportStats(entries, profile, startKey, endKey) {
  const inRange = Object.keys(entries)
    .filter((k) => k >= startKey && k <= endKey)
    .sort();
  const nDays = daysBetween(endKey, startKey) + 1;
  const logged = inRange.length;

  const tracked = profile?.trackedSymptoms || [];
  const symptomRows = tracked
    .map((id) => {
      const vals = inRange
        .map((k) => entries[k]?.symptoms?.[id])
        .filter((v) => typeof v === "number");
      const daysPresent = vals.filter((v) => v > 0).length;
      const avgSev = avg(vals);
      const peak = vals.length ? Math.max(...vals) : 0;
      return { id, label: SYMPTOM_BY_ID[id]?.label || id, daysPresent, avgSev, peak, logged: vals.length };
    })
    .sort((a, b) => b.avgSev - a.avgSev);

  const moodAvg = avg(inRange.map((k) => entries[k]?.mood).filter((v) => typeof v === "number"));
  const energyAvg = avg(inRange.map((k) => entries[k]?.energy).filter((v) => typeof v === "number"));
  const sleepAvg = avg(
    inRange.map((k) => entries[k]?.sleepHours).filter((v) => typeof v === "number")
  );

  // HRT adherence: of days where hrtTaken is recorded, share taken.
  const hrtDays = inRange.filter((k) => typeof entries[k]?.hrtTaken === "boolean");
  const hrtTaken = hrtDays.filter((k) => entries[k].hrtTaken).length;
  const adherence = hrtDays.length ? Math.round((hrtTaken / hrtDays.length) * 100) : null;

  return {
    nDays,
    logged,
    coverage: nDays ? Math.round((logged / nDays) * 100) : 0,
    symptomRows,
    moodAvg,
    energyAvg,
    sleepAvg,
    adherence,
  };
}

// Deterministic, supportive coach tips derived from the current data.
export function coachTips(entries, profile) {
  const tips = [];
  const cors = correlations(entries, profile);
  cors.slice(0, 2).forEach((c) => {
    const t = TRIGGER_BY_ID[c.triggerId]?.label?.toLowerCase();
    tips.push(
      `Consider easing back on ${t} for a week and watch whether your ${
        SYMPTOM_BY_ID[c.symptomId]?.label?.toLowerCase()
      } settles.`
    );
  });

  const recent = recentEntries(entries, RECENT_DAYS);
  const shortNights = recent.filter(
    (r) => typeof r.entry.sleepHours === "number" && r.entry.sleepHours < SLEEP_DEBT_HOURS
  ).length;
  if (shortNights >= 2) {
    tips.push(
      "Sleep has been short lately. A consistent wind-down routine and a cooler bedroom can blunt night sweats and steady mood."
    );
  }

  const exerciseDays = recent.filter((r) => r.entry.exercise).length;
  if (recent.length >= 4 && exerciseDays <= 1) {
    tips.push(
      "Even short daily walks are linked to better sleep and steadier mood during this transition."
    );
  }

  if (tips.length === 0) {
    tips.push(
      "Keep checking in daily — a couple more weeks of data will unlock personalized patterns and correlations."
    );
  }
  return tips;
}
