import type { TrendDirection } from "../types/wellness";

export interface LabResult {
  id: string;
  marker: string;
  current: string;
  previous: string;
  referenceRange: string;
  date: string;
  trend: TrendDirection;
  notes: string;
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  phone: string;
  notes: string;
  thingsToDiscuss: string[];
  questions: string[];
  afterNotes: string;
  followUpTasks: string[];
  status: "upcoming" | "past";
}

export interface MedicationItem {
  id: string;
  name: string;
  kind: "Medication" | "Supplement";
  dose: string;
  time: string;
  takenToday: boolean;
  refill: string;
  notes: string;
}

export interface VitalEntry {
  label: string;
  value: string;
  date: string;
  notes: string;
}

export interface FitnessEntry {
  id: string;
  type: string;
  detail: string;
  duration: string;
  intensity: string;
  notes: string;
}

export interface FoodHydrationSample {
  waterPercent: number;
  proteinPercent: number;
  fiberPercent: number;
  meals: string[];
  snacks: string[];
  caffeine: string;
  nauseaCravings: string;
}

export interface AlcoholEntry {
  id: string;
  drinkType: string;
  drinks: string;
  date: string;
  moodBefore: string;
  moodAfter: string;
  notes: string;
}

export interface PeriodEntry {
  startDate: string;
  endDate: string;
  flow: string;
  symptoms: string[];
  mood: string;
  energy: string;
  notes: string;
}

export interface MoodEntry {
  mood: string;
  intensity: number;
  dateTime: string;
  note: string;
}

export interface BeautyRoutine {
  title: string;
  steps: string[];
}

export interface ProductNote {
  name: string;
  status: string;
  notes: string;
}

export interface RecipeCard {
  id: string;
  title: string;
  category: string;
  protein: string;
  fiber: string;
  notes: string;
}

export interface ReminderSample {
  id: string;
  title: string;
  date: string;
  time: string;
  recurrence: string;
  category: string;
  notes: string;
  completed: boolean;
}

export interface QuickNoteSample {
  id: string;
  note: string;
  category: string;
  createdAt: string;
}

export interface DocumentSample {
  id: string;
  title: string;
  category: string;
  date: string;
  notes: string;
}

export interface ProgressPhotoSample {
  id: string;
  category: string;
  date: string;
  notes: string;
}

export const labResults: LabResult[] = [
  {
    id: "a1c",
    marker: "A1C",
    current: "5.8%",
    previous: "6.0%",
    referenceRange: "Discuss personal goal range with clinician",
    date: "2026-05-08",
    trend: "down",
    notes: "Sample trend only. No medical interpretation is provided."
  },
  {
    id: "cholesterol",
    marker: "Total Cholesterol",
    current: "186 mg/dL",
    previous: "194 mg/dL",
    referenceRange: "Provider-defined range",
    date: "2026-05-08",
    trend: "down",
    notes: "Sample card for trend layout."
  },
  {
    id: "glucose",
    marker: "Glucose",
    current: "96 mg/dL",
    previous: "99 mg/dL",
    referenceRange: "Provider-defined range",
    date: "2026-05-08",
    trend: "stable",
    notes: "Manual entry."
  },
  {
    id: "ldl",
    marker: "LDL",
    current: "112 mg/dL",
    previous: "119 mg/dL",
    referenceRange: "Provider-defined range",
    date: "2026-05-08",
    trend: "down",
    notes: "Lipid panel detail."
  },
  {
    id: "hdl",
    marker: "HDL",
    current: "54 mg/dL",
    previous: "52 mg/dL",
    referenceRange: "Provider-defined range",
    date: "2026-05-08",
    trend: "up",
    notes: "Lipid panel detail."
  },
  {
    id: "triglycerides",
    marker: "Triglycerides",
    current: "136 mg/dL",
    previous: "142 mg/dL",
    referenceRange: "Provider-defined range",
    date: "2026-05-08",
    trend: "down",
    notes: "Lipid panel detail."
  }
];

export const appointments: Appointment[] = [
  {
    id: "appt-1",
    doctor: "Dr. Sample Rivera",
    specialty: "Primary care",
    date: "2026-06-12",
    time: "10:30 AM",
    location: "Sample Wellness Clinic",
    phone: "(555) 010-2026",
    notes: "Bring recent lab printout and medication list.",
    thingsToDiscuss: [
      "Ask about cholesterol",
      "Discuss A1C",
      "Mention nausea",
      "Ask about medication timing",
      "Ask about supplements",
      "Review recent labs"
    ],
    questions: ["What lab trends should I watch?", "Should I adjust the timing of supplements?"],
    afterNotes: "After-visit notes will go here.",
    followUpTasks: ["Schedule bloodwork", "Upload visit summary", "Book follow-up"],
    status: "upcoming"
  },
  {
    id: "appt-2",
    doctor: "Dr. Sample Chen",
    specialty: "Dermatology",
    date: "2026-04-16",
    time: "2:00 PM",
    location: "Sample Skin Studio",
    phone: "(555) 010-1515",
    notes: "Discuss irritation log and current products.",
    thingsToDiscuss: ["Review current products", "Ask about retinol timing"],
    questions: ["Which products should not be layered?"],
    afterNotes: "Sample past visit note.",
    followUpTasks: ["Patch test new product"],
    status: "past"
  }
];

export const medications: MedicationItem[] = [
  {
    id: "med-1",
    name: "Medication example",
    kind: "Medication",
    dose: "Sample dose",
    time: "Morning",
    takenToday: true,
    refill: "Refill reminder to add",
    notes: "Check with a doctor or pharmacist for interactions."
  },
  {
    id: "sup-1",
    name: "Supplement example",
    kind: "Supplement",
    dose: "Sample amount",
    time: "Evening",
    takenToday: false,
    refill: "Review next month",
    notes: "Discuss supplements with a licensed professional."
  }
];

export const vitals: VitalEntry[] = [
  { label: "Blood pressure", value: "118/76", date: "2026-05-21", notes: "Sample resting reading." },
  { label: "Oxygen", value: "98%", date: "2026-05-21", notes: "Optional tracking." },
  { label: "Heart rate", value: "72 bpm", date: "2026-05-21", notes: "Resting sample." },
  { label: "Weight", value: "Sample weight", date: "2026-05-21", notes: "Private value example." },
  { label: "BMI", value: "To calculate", date: "2026-05-21", notes: "No interpretation." },
  { label: "Temperature", value: "98.2 F", date: "2026-05-21", notes: "Sample temperature." }
];

export const fitnessPlan = ["Cardio", "Arms", "Legs", "Core", "Full body", "Pilates", "Stretching", "Recovery day"];

export const completedWorkouts: FitnessEntry[] = [
  {
    id: "fit-1",
    type: "Treadmill",
    detail: "20 minutes, 1.1 miles, 2 incline, 3.2 speed",
    duration: "20 min",
    intensity: "Moderate",
    notes: "Felt steady and calm."
  },
  {
    id: "fit-2",
    type: "Strength",
    detail: "Arms, 3 sets, 10 reps, light resistance",
    duration: "18 min",
    intensity: "Light",
    notes: "Focused on form."
  }
];

export const foodHydration: FoodHydrationSample = {
  waterPercent: 70,
  proteinPercent: 62,
  fiberPercent: 48,
  meals: ["Greek yogurt with berries", "Chicken salad bowl"],
  snacks: ["String cheese", "Apple slices"],
  caffeine: "One iced coffee",
  nauseaCravings: "Mild sweet craving after dinner."
};

export const alcoholEntries: AlcoholEntry[] = [
  {
    id: "alc-1",
    drinkType: "Margarita",
    drinks: "1",
    date: "2026-05-18",
    moodBefore: "Relaxed",
    moodAfter: "Sleepy",
    notes: "Dinner out sample note."
  }
];

export const periodEntry: PeriodEntry = {
  startDate: "2026-05-02",
  endDate: "2026-05-06",
  flow: "Medium",
  symptoms: ["Cramps", "Bloating", "Cravings"],
  mood: "Sensitive",
  energy: "Lower",
  notes: "Gentle tracking sample."
};

export const moodEntries: MoodEntry[] = [
  { mood: "Hopeful", intensity: 4, dateTime: "2026-05-21 08:30", note: "Felt clear after a slow morning." },
  { mood: "Tired", intensity: 3, dateTime: "2026-05-20 21:15", note: "Needed an earlier bedtime." }
];

export const skincareRoutines: BeautyRoutine[] = [
  { title: "AM routine", steps: ["Cleanser", "Toner", "Serum", "Eye cream", "Moisturizer", "Sunscreen"] },
  { title: "PM routine", steps: ["Cleanser", "Toner", "Serum", "Retinol/active", "Eye cream", "Moisturizer"] }
];

export const skincareProducts: ProductNote[] = [
  { name: "Niacinamide serum", status: "Product to try", notes: "Patch test first." },
  { name: "Gentle cleanser", status: "Current product", notes: "No irritation noted." }
];

export const haircareRoutine: BeautyRoutine = {
  title: "Curl routine",
  steps: ["Wash day", "Conditioner", "Leave-in", "Curl cream", "Diffuse", "Refresh day"]
};

export const hairProducts: ProductNote[] = [
  { name: "Curl cream", status: "Current product", notes: "Good definition sample note." },
  { name: "Scalp serum", status: "Product to try", notes: "Watch for sensitivity." }
];

export const recipeCards: RecipeCard[] = [
  {
    id: "rec-1",
    title: "High protein breakfast bowl",
    category: "Breakfast",
    protein: "30 g estimate",
    fiber: "8 g estimate",
    notes: "Greek yogurt, berries, chia, and nuts."
  },
  {
    id: "rec-2",
    title: "Heart healthy chicken dinner",
    category: "Dinner",
    protein: "36 g estimate",
    fiber: "10 g estimate",
    notes: "Chicken, greens, beans, and olive oil dressing."
  }
];

export const recipeCategories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Smoothies",
  "Meal prep",
  "High protein",
  "Diabetic-friendly",
  "Heart healthy",
  "High fiber",
  "Period support foods",
  "Saved recipes",
  "Recipes to try"
];

export const reminderCategories = [
  "Doctor appointment",
  "Schedule bloodwork",
  "Take medication",
  "Refill prescription",
  "Drink water",
  "Log weight",
  "Upload lab results",
  "Skincare routine",
  "Haircare routine",
  "Period check-in",
  "Take progress photo",
  "Follow up with doctor",
  "Custom"
];

export const reminderRecurrences = ["one-time", "daily", "weekly", "monthly", "every 3 months", "custom"];

export const sampleReminders: ReminderSample[] = [
  {
    id: "rem-1",
    title: "Drink water",
    date: "2026-05-22",
    time: "2:00 PM",
    recurrence: "daily",
    category: "Drink water",
    notes: "Gentle hydration check.",
    completed: false
  },
  {
    id: "rem-2",
    title: "Skincare routine",
    date: "2026-05-22",
    time: "7:30 PM",
    recurrence: "daily",
    category: "Skincare routine",
    notes: "Evening routine.",
    completed: true
  }
];

export const sampleQuickNotes: QuickNoteSample[] = [
  {
    id: "note-1",
    note: "Ask doctor about cholesterol at the next appointment.",
    category: "Doctor Appointments",
    createdAt: "2026-05-21 09:15"
  },
  {
    id: "note-2",
    note: "I walked on the treadmill for 20 minutes.",
    category: "Fitness",
    createdAt: "2026-05-20 18:45"
  }
];

export const documents: DocumentSample[] = [
  { id: "doc-1", title: "Sample lab PDF note", category: "Lab documents", date: "2026-05-08", notes: "No real file stored." },
  { id: "doc-2", title: "Sample appointment note", category: "Doctor documents", date: "2026-04-16", notes: "Sample note." }
];

export const progressPhotos: ProgressPhotoSample[] = [
  { id: "photo-1", category: "Body", date: "2026-05-01", notes: "Comparison note, no real image stored." },
  { id: "photo-2", category: "Skin", date: "2026-05-12", notes: "Progress note." },
  { id: "photo-3", category: "Hair", date: "2026-05-18", notes: "Curl routine progress note." }
];
