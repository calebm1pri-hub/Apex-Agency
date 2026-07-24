// Catalog of stages, symptoms, triggers, and HRT/med types.
// Everything the UI offers to track lives here so it's easy to extend.

export const STAGES = [
  {
    id: "peri",
    label: "Perimenopause",
    blurb: "Cycles still happening but changing — the transition years.",
  },
  {
    id: "meno",
    label: "Menopause",
    blurb: "It has been around 12 months since your last period.",
  },
  {
    id: "post",
    label: "Postmenopause",
    blurb: "More than a year past your final period.",
  },
  {
    id: "unsure",
    label: "Not sure yet",
    blurb: "Still figuring it out — that's completely okay.",
  },
];

// Each symptom: id, label, short description, and a small emoji glyph.
export const SYMPTOMS = [
  { id: "hot_flashes", label: "Hot flashes", glyph: "🔥" },
  { id: "night_sweats", label: "Night sweats", glyph: "💧" },
  { id: "sleep", label: "Sleep trouble", glyph: "🌙" },
  { id: "brain_fog", label: "Brain fog", glyph: "🌫️" },
  { id: "mood_swings", label: "Mood swings", glyph: "🎭" },
  { id: "anxiety", label: "Anxiety", glyph: "😰" },
  { id: "low_mood", label: "Low mood", glyph: "☁️" },
  { id: "fatigue", label: "Fatigue", glyph: "🔋" },
  { id: "joint_pain", label: "Joint / muscle aches", glyph: "🦴" },
  { id: "headache", label: "Headaches", glyph: "🤕" },
  { id: "palpitations", label: "Heart palpitations", glyph: "💓" },
  { id: "irregular_cycle", label: "Irregular periods", glyph: "📅" },
  { id: "libido", label: "Low libido", glyph: "💤" },
  { id: "dryness", label: "Vaginal dryness", glyph: "🌵" },
  { id: "weight", label: "Weight changes", glyph: "⚖️" },
  { id: "bloating", label: "Bloating", glyph: "🎈" },
  { id: "hair_skin", label: "Hair / skin changes", glyph: "💇" },
  { id: "irritability", label: "Irritability", glyph: "⚡" },
];

export const SYMPTOM_BY_ID = Object.fromEntries(SYMPTOMS.map((s) => [s.id, s]));

// Severity scale used by the sliders (0 = none .. 3 = severe).
export const SEVERITY_LABELS = ["None", "Mild", "Moderate", "Severe"];
export const SEVERITY_MAX = 3;

// Lifestyle / trigger factors logged as simple present/absent chips.
export const TRIGGERS = [
  { id: "caffeine", label: "Caffeine", glyph: "☕" },
  { id: "alcohol", label: "Alcohol", glyph: "🍷" },
  { id: "sugar", label: "Sugar", glyph: "🍰" },
  { id: "spicy", label: "Spicy food", glyph: "🌶️" },
  { id: "stress", label: "High stress", glyph: "😵" },
  { id: "poor_sleep", label: "Poor sleep", glyph: "😴" },
  { id: "late_meal", label: "Late meal", glyph: "🌜" },
  { id: "dehydrated", label: "Dehydrated", glyph: "🏜️" },
];

export const TRIGGER_BY_ID = Object.fromEntries(TRIGGERS.map((t) => [t.id, t]));

// HRT / medication categories offered during setup.
export const HRT_TYPES = [
  "Estrogen (patch)",
  "Estrogen (gel)",
  "Estrogen (pill)",
  "Progesterone",
  "Combined HRT",
  "Testosterone",
  "Vaginal estrogen",
  "Non-hormonal (e.g. SSRI)",
  "Supplement",
  "Other",
];

// Optional goals shown in onboarding — used to tailor coach tone.
export const GOALS = [
  { id: "sleep_better", label: "Sleep better" },
  { id: "fewer_flashes", label: "Fewer hot flashes" },
  { id: "steadier_mood", label: "Steadier mood" },
  { id: "more_energy", label: "More energy" },
  { id: "understand", label: "Understand my patterns" },
  { id: "doctor_ready", label: "Prepare for my doctor" },
];

// Mood / energy 1..5 wording for the check-in.
export const SCALE_1_5 = ["", "Very low", "Low", "Okay", "Good", "Great"];
