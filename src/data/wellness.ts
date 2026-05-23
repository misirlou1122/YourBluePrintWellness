import type { ProfileSummary, ReportExport, WellnessTile } from "../types/wellness";

export const profileSummary: ProfileSummary = {
  name: "Your Profile",
  age: "Add age",
  height: "Add height",
  sex: "Female",
  mainGoals: ["Lower stress", "Support labs", "Build strength", "Stay consistent"]
};

export const reportExports: ReportExport[] = [
  {
    title: "Print Wellness Summary",
    description: "Printable overview of goals, daily trackers, notes, reminders, and progress."
  },
  {
    title: "Print Lab Summary",
    description: "Printable lab result summary with saved values and trend notes."
  },
  {
    title: "Print Doctor Appointment Summary",
    description: "Printable visit prep with things to discuss, questions, notes, and follow-up tasks."
  },
  {
    title: "Print Medication List",
    description: "Printable medication and supplement list with dosage, timing, and refill reminders."
  },
  {
    title: "Print Body Measurements / Shopping Reference",
    description: "Printable measurements, sizing notes, brand fit notes, and shopping reference."
  }
];

export const profileSettingsTile: WellnessTile = {
  id: "settings",
  title: "Account / Profile",
  subtitle: "Profile, sign-in, avatar, support",
  icon: "settings",
  subcategories: ["Profile and sign-in", "Profile picture", "Wellness profile", "Custom tiles", "Report a problem", "Safety note"],
  groups: [
    {
      title: "Profile and sign-in",
      description: "Manage account details, wellness profile, avatar, and support options.",
      fields: ["Selected profile", "Custom tiles", "Notes"]
    }
  ]
};

export const noteCategories = [
  "Health",
  "Bloodwork / Labs",
  "Doctor Appointments",
  "Medications & Supplements",
  "Vitals",
  "Weight / BMI",
  "Body Measurements",
  "Shopping Reference",
  "Fitness",
  "Food & Hydration",
  "Alcohol Tracker",
  "Period Tracker",
  "Cycle Symptoms",
  "Hormone-Related Notes",
  "Birth Control Notes",
  "Ovulation",
  "Fertility Notes",
  "Perimenopause / Menopause",
  "Testosterone Tracker",
  "Men's Health",
  "Prostate Health Notes",
  "Libido / Energy / Mood",
  "Hair Loss Notes",
  "Muscle / Strength Progress",
  "Sleep / Recovery",
  "Mood / Mental Health",
  "Skin & Beauty",
  "Hair Care",
  "Recipes",
  "Documents",
  "General Notes"
];

export const noteSuggestionRules = [
  {
    category: "Body Measurements",
    keywords: [
      "measurements",
      "waist",
      "hips",
      "bust",
      "chest",
      "inseam",
      "clothes",
      "clothing",
      "dress size",
      "pants size",
      "bra size",
      "online shopping",
      "shoes",
      "shoe size",
      "ring size"
    ]
  },
  { category: "Birth Control Notes", keywords: ["birth control", "pill", "iud", "contraception"] },
  { category: "Perimenopause / Menopause", keywords: ["menopause", "hot flash", "perimenopause"] },
  { category: "Testosterone Tracker", keywords: ["testosterone", "t levels", "low t"] },
  { category: "Prostate Health Notes", keywords: ["prostate", "psa"] },
  { category: "Hair Loss Notes", keywords: ["hair loss", "thinning hair"] },
  { category: "Muscle / Strength Progress", keywords: ["muscle", "strength progress", "strength gain"] },
  { category: "Alcohol Tracker", keywords: ["margarita", "wine", "beer", "cocktail", "alcohol", "drink"] },
  { category: "Bloodwork / Labs", keywords: ["a1c", "cholesterol", "ldl", "hdl", "triglycerides", "glucose", "labs"] },
  { category: "Fitness", keywords: ["treadmill", "walked", "walk", "workout", "pilates", "sets", "reps", "miles", "gym"] },
  { category: "Mood / Mental Health", keywords: ["anxious", "overwhelmed", "sad", "mood", "tired", "foggy", "hopeful", "irritable"] },
  { category: "Skin & Beauty", keywords: ["niacinamide", "retinol", "serum", "breakout", "sunscreen", "cleanser", "moisturizer"] },
  { category: "Hair Care", keywords: ["shampoo", "conditioner", "curls", "wash day", "curl", "scalp", "hair", "refresh"] },
  { category: "Recipes", keywords: ["recipe", "chicken", "protein", "fiber", "meal"] },
  { category: "Doctor Appointments", keywords: ["doctor", "appointment", "follow up", "questions", "specialist"] },
  { category: "Medications & Supplements", keywords: ["medication", "dose", "supplement", "refill", "pharmacist"] },
  { category: "Food & Hydration", keywords: ["protein", "fiber", "water", "snack", "meal", "nausea"] },
  { category: "Weight / BMI", keywords: ["weight", "bmi", "weighed", "scale"] },
  { category: "Period Tracker", keywords: ["period", "cramps", "cycle", "flow", "pms", "bloating", "ovulation"] },
  { category: "Libido / Energy / Mood", keywords: ["libido", "energy", "low energy"] },
  { category: "Sleep / Recovery", keywords: ["sleep", "recovery", "fatigue", "tired"] }
];

export const wellnessTiles: WellnessTile[] = [
  {
    id: "daily",
    title: "Daily Snapshot",
    subtitle: "Today at a glance, trackers, history",
    icon: "activity",
    subcategories: ["Today at a glance", "Today's daily tracker", "Daily History", "Reset Today"],
    groups: [
      {
        title: "Today at a glance",
        description: "View and update today's water, protein, fiber, mood, medication, workout, food, alcohol, and reminder status.",
        fields: ["Water", "Protein", "Fiber", "Mood", "Medication status", "Workout status"]
      }
    ]
  },
  {
    id: "reports",
    title: "Print Reports",
    subtitle: "Wellness, labs, meds, appointments",
    icon: "book",
    subcategories: ["Wellness Summary", "Lab Summary", "Appointment Summary", "Medication List", "Measurements"],
    groups: [
      {
        title: "Printable reports",
        description: "Open focused print views for wellness summaries, labs, appointment prep, medication lists, and body measurements.",
        fields: ["Report type", "Print preview", "Save as PDF"]
      }
    ]
  },
  {
    id: "health",
    title: "Health",
    subtitle: "History, vitals, symptoms, questions",
    icon: "heart",
    subcategories: [
      "Overview",
      "Vitals",
      "Blood pressure",
      "Heart rate",
      "Weight",
      "Symptoms",
      "Health goals",
      "Family history",
      "Genetics / risk factors",
      "Doctor questions",
      "Health notes"
    ],
    groups: [
      {
        title: "Overview",
        description: "A private snapshot for organizing health history and wellness priorities.",
        fields: ["Primary focus", "Known conditions", "Current care team", "Last wellness visit"],
        cards: [
          { title: "Main goal", body: "Build a clearer picture of patterns over time.", meta: "Personal tracking" },
          { title: "Care reminder", body: "Use this space to prepare for visits, not to diagnose symptoms.", meta: "Safety first" }
        ]
      },
      {
        title: "Vitals",
        description: "Track blood pressure, heart rate, oxygen, temperature, weight, BMI, and related context.",
        fields: ["Blood pressure", "Heart rate", "Oxygen", "Temperature", "Weight", "BMI", "Notes"]
      },
      {
        title: "Symptoms",
        description: "Track symptom notes gently with timing, context, and intensity.",
        fields: ["Symptom", "Date/time", "Intensity", "Possible trigger", "Notes"],
        cards: [{ title: "Symptom note", body: "Add timing, context, intensity, and anything you want to remember.", meta: "Personal tracking" }]
      },
      {
        title: "Health goals",
        description: "Keep wellness goals visible and realistic.",
        fields: ["Goal", "Why it matters", "Next tiny step", "Target date"],
        checklist: ["Walk 3 days this week", "Drink more water", "Prepare doctor questions"]
      },
      {
        title: "Family history",
        description: "Future-ready area for family history and health patterns.",
        fields: ["Relationship", "Condition or concern", "Age range", "Notes"]
      },
      {
        title: "Genetics / risk factors",
        description: "Future entries can organize risk-factor discussions for a clinician.",
        fields: ["Risk factor", "Source", "Doctor reviewed?", "Notes"]
      },
      {
        title: "Doctor questions",
        description: "Questions to bring to appointments.",
        checklist: ["Ask about cholesterol", "Discuss A1C", "Mention nausea", "Review recent labs"]
      },
      {
        title: "Health notes",
        description: "A calm notebook for patterns, reminders, and context.",
        fields: ["Note title", "Category", "Date", "Details"]
      }
    ]
  },
  {
    id: "labs",
    title: "Bloodwork / Labs",
    subtitle: "Labs, manual values, trends",
    icon: "flask",
    subcategories: [
      "Upload lab PDF",
      "A1C",
      "Cholesterol",
      "Glucose",
      "Iron / Ferritin",
      "Vitamin D",
      "Liver enzymes",
      "Kidney markers",
      "Thyroid",
      "Other labs"
    ],
    metrics: [
      {
        label: "A1C",
        current: "5.8%",
        previous: "6.0%",
        goal: "Discuss personal goal range with clinician",
        trend: "down",
        date: "May 2026",
        notes: "Trend card for future lab extraction."
      },
      {
        label: "Cholesterol",
        current: "186 mg/dL",
        previous: "194 mg/dL",
        goal: "Provider-defined goal range",
        trend: "down",
        date: "May 2026",
        notes: "Future support for total, LDL, HDL, and triglycerides."
      },
      {
        label: "Glucose",
        current: "96 mg/dL",
        previous: "99 mg/dL",
        goal: "Provider-defined goal range",
        trend: "stable",
        date: "May 2026",
        notes: "Manual entry now, automated extraction later."
      }
    ],
    groups: [
      {
        title: "Upload lab PDF",
        description: "Upload area for future Quest, MyChart, or doctor portal PDFs.",
        fields: ["PDF file", "Lab date", "Ordering doctor", "Notes"]
      },
      {
        title: "A1C",
        description: "Manual entry and trend preview for A1C values.",
        fields: ["Current value", "Previous value", "Goal range", "Date of result", "Notes"]
      },
      {
        title: "Cholesterol",
        description: "Organize total cholesterol, LDL, HDL, and triglycerides.",
        fields: ["Total", "LDL", "HDL", "Triglycerides", "Date of result", "Notes"]
      },
      {
        title: "Glucose",
        description: "Track glucose values with context and provider-defined goals.",
        fields: ["Value", "Fasting?", "Date of result", "Notes"]
      },
      {
        title: "Other labs",
        description: "Future-ready space for iron, ferritin, vitamin D, liver, kidney, and thyroid markers.",
        fields: ["Marker", "Value", "Unit", "Reference range", "Notes"]
      }
    ],
    futureNotes: [
      "Future: upload lab PDFs securely.",
      "Future: read lab PDFs and organize common values after you review them.",
      "Future: save reviewed lab values to your private account."
    ]
  },
  {
    id: "appointments",
    title: "Doctor Appointments",
    subtitle: "Visits, questions, checklist, notes",
    icon: "calendar",
    subcategories: [
      "Upcoming appointments",
      "Past appointments",
      "Things To Discuss",
      "Questions for doctor",
      "After appointment notes",
      "Follow-up tasks",
      "Print appointment summary"
    ],
    groups: [
      {
        title: "Upcoming appointments",
        description: "Keep appointment details and preparation in one place.",
        fields: ["Doctor name", "Specialty", "Date/time", "Location", "Phone number", "Notes"],
        cards: [
          {
            title: "Dr. Rivera",
            body: "Primary care check-in on June 12, 2026 at 10:30 AM.",
            meta: "Location and phone details"
          }
        ]
      },
      {
        title: "Things To Discuss",
        description: "A visit-specific checklist that can be included in a printed summary.",
        checklist: [
          "Ask about cholesterol",
          "Discuss A1C",
          "Mention nausea",
          "Ask about medication timing",
          "Ask about supplements",
          "Review recent labs"
        ]
      },
      {
        title: "Questions for doctor",
        description: "Prepare short questions before each appointment.",
        fields: ["Question", "Priority", "Related labs or symptoms", "Answered?"]
      },
      {
        title: "After appointment notes",
        description: "Capture takeaways right after the visit.",
        fields: ["Summary", "Medication changes", "Labs ordered", "Next appointment"]
      },
      {
        title: "Follow-up tasks",
        description: "Track the small things that are easy to forget.",
        checklist: ["Schedule bloodwork", "Upload visit summary", "Call pharmacy", "Book follow-up"]
      }
    ]
  },
  {
    id: "medications",
    title: "Medications & Supplements",
    subtitle: "Dose, timing, refills, safety notes",
    icon: "pill",
    subcategories: [
      "Current medications",
      "Supplements",
      "Dosage",
      "Time of day",
      "Taken today",
      "Missed dose log",
      "Refill reminder",
      "Side effects notes",
      "Alcohol interaction warning"
    ],
    groups: [
      {
        title: "Current medications",
        description: "Track what you take and when, using safe language.",
        fields: ["Name", "Dosage", "Time of day", "Taken today?", "Notes"],
        cards: [{ title: "Medication status", body: "Use daily checkboxes to track whether an item was marked taken today.", meta: "Personal tracking" }]
      },
      {
        title: "Supplements",
        description: "Organize supplement timing and notes to review with a professional.",
        fields: ["Supplement", "Amount", "Time of day", "Reason", "Notes"]
      },
      {
        title: "Missed dose log",
        description: "A simple log for missed or delayed doses.",
        fields: ["Medication", "Date", "What happened", "Follow-up note"]
      },
      {
        title: "Refill reminder",
        description: "Reminder details for future notifications.",
        fields: ["Medication", "Days remaining", "Pharmacy", "Reminder date"]
      },
      {
        title: "Safety note",
        description: "Check with your doctor or pharmacist for medication interactions.",
        cards: [{ title: "Alcohol interaction reminder", body: "Confirm interactions with a licensed professional.", meta: "No medical advice" }]
      }
    ]
  },
  {
    id: "vitals",
    title: "Vitals",
    subtitle: "Blood pressure, heart rate, weight",
    icon: "activity",
    subcategories: ["Blood pressure", "Oxygen", "Heart rate", "BMI", "Weight", "Temperature", "Blood sugar"],
    groups: [
      {
        title: "Blood pressure",
        description: "Manual tracking for readings and context.",
        fields: ["Systolic", "Diastolic", "Pulse", "Date/time", "Notes"],
        cards: [{ title: "Reading note", body: "Add readings with date, context, and any notes you want to remember.", meta: "Personal tracking" }]
      },
      {
        title: "Oxygen",
        description: "Optional oxygen saturation tracking.",
        fields: ["SpO2", "Date/time", "Context", "Notes"]
      },
      {
        title: "Weight and BMI",
        description: "Track weight trend gently without turning it into judgment.",
        fields: ["Weight", "BMI", "Date", "Notes"]
      },
      {
        title: "Temperature and blood sugar",
        description: "Optional manual fields for future vitals entries.",
        fields: ["Temperature", "Blood sugar", "Context", "Notes"]
      }
    ]
  },
  {
    id: "weight",
    title: "Weight / BMI & Measurements",
    subtitle: "Weight trend, BMI, measurements, shopping",
    icon: "activity",
    subcategories: ["Latest weight", "Weight trend", "Add weight", "BMI", "Body measurements", "Shopping Reference", "History"],
    groups: [
      {
        title: "Latest weight",
        description: "Track weight and BMI as personal wellness data.",
        fields: ["Date", "Weight", "Unit", "BMI", "Notes"]
      },
      {
        title: "Weight trend",
        description: "A graph helps you see saved weight entries over time.",
        fields: ["Start date", "End date", "Trend note", "Notes"]
      },
      {
        title: "Body measurements",
        description: "Reference measurements and fit notes for progress tracking and online shopping.",
        fields: ["Date", "Waist", "Hips", "Bust/chest", "Inseam", "Notes"]
      }
    ]
  },
  {
    id: "measurements",
    title: "Body Measurements",
    subtitle: "Shopping reference, fit notes, progress",
    icon: "ruler",
    subcategories: [
      "Latest Measurements",
      "Measurement History",
      "Shopping Reference",
      "Tops",
      "Bottoms",
      "Dresses",
      "Shoes",
      "Brands"
    ],
    groups: [
      {
        title: "Latest Measurements",
        description: "Quick reference for online shopping and body progress tracking.",
        fields: ["Date", "Waist", "Hips", "Bust/chest", "Inseam", "Notes"]
      },
      {
        title: "Shopping Reference",
        description: "Fit notes, favorite brands, and sizing reminders.",
        fields: ["Tops size notes", "Bottoms size notes", "Dress size notes", "Shoe size notes", "Online shopping notes"]
      }
    ]
  },
  {
    id: "fitness",
    title: "Fitness",
    subtitle: "Plans, completed workouts, movement notes",
    icon: "dumbbell",
    subcategories: ["What I Want To Do", "What I Did Today", "Cardio", "Strength", "Treadmill", "Recovery"],
    groups: [
      {
        title: "What I Want To Do",
        description: "Choose from supportive movement categories.",
        checklist: ["Cardio", "Arms", "Legs", "Core", "Full body", "Pilates", "Stretching", "Recovery day"]
      },
      {
        title: "What I Did Today",
        description: "Log completed movement without pressure.",
        fields: ["Cardio completed", "Strength completed", "Sets/reps", "Duration", "Miles", "Intensity", "Notes"]
      },
      {
        title: "Treadmill",
        description: "Track treadmill sessions with simple fields.",
        fields: ["Minutes", "Miles", "Incline", "Speed", "Notes"],
        cards: [{ title: "Treadmill note", body: "Log minutes, miles, incline, speed, and how the session felt.", meta: "Personal tracking" }]
      },
      {
        title: "Strength",
        description: "Capture exercises, sets, reps, and resistance.",
        fields: ["Exercise name", "Sets", "Reps", "Weight/resistance", "Notes"]
      }
    ]
  },
  {
    id: "muscle-strength",
    title: "Muscle / Strength Progress",
    subtitle: "Strength notes, recovery, progress",
    icon: "dumbbell",
    subcategories: ["Strength progress", "Muscle notes", "Measurements", "Photos", "Recovery", "Notes"],
    groups: [
      {
        title: "Strength progress",
        description: "Track strength changes, muscle goals, and recovery notes for personal organization.",
        fields: ["Date", "Exercise or area", "Sets/reps/weight", "Progress note", "Recovery note", "Notes"]
      },
      {
        title: "Muscle notes",
        description: "Capture observations about strength, soreness, measurements, and progress photos.",
        fields: ["Date", "Body area", "Observation", "Related workout", "Notes"]
      }
    ]
  },
  {
    id: "food",
    title: "Food & Hydration",
    subtitle: "Water, protein, fiber, meals, cravings",
    icon: "droplets",
    subcategories: ["Water tracker", "Protein tracker", "Fiber tracker", "Meals", "Snacks", "Caffeine", "Cravings", "Nausea notes", "Food notes"],
    groups: [
      {
        title: "Progress trackers",
        description: "Glowing progress for hydration and nutrition habits.",
        fields: ["Water", "Protein", "Fiber", "Daily note"]
      },
      {
        title: "Meals and snacks",
        description: "A lightweight place to capture what you ate.",
        fields: ["Meal", "Snack", "Caffeine", "Cravings", "Nausea notes", "Food notes"],
        cards: [{ title: "Meal note", body: "Save meals, snacks, caffeine, cravings, nausea, and context.", meta: "Personal tracking" }]
      }
    ]
  },
  {
    id: "alcohol",
    title: "Alcohol Tracker",
    subtitle: "Drinks, context, mood, sleep impact",
    icon: "wine",
    subcategories: ["Date", "Drink type", "Number of drinks", "Context", "Mood before/after", "Sleep impact", "Medication reminder", "Trends"],
    groups: [
      {
        title: "Drink log",
        description: "Personal tracking without judgment.",
        fields: ["Date", "Drink type", "Number of drinks", "Context/notes", "Mood before", "Mood after"],
        cards: [{ title: "Drink log note", body: "Track drink count, context, mood, sleep impact, and notes.", meta: "Personal tracking" }]
      },
      {
        title: "Medication interaction reminder",
        description: "Check with your doctor or pharmacist for medication interactions.",
        fields: ["Medication reviewed?", "Question for pharmacist", "Notes"]
      },
      {
        title: "Trends",
        description: "Future trend views can summarize patterns over time.",
        cards: [{ title: "Trend preview", body: "Trend summaries can be added later.", meta: "Future feature" }]
      }
    ]
  },
  {
    id: "period",
    title: "Period Tracker",
    subtitle: "Cycle, symptoms, energy, notes",
    icon: "calendarHeart",
    subcategories: ["Start date", "End date", "Flow level", "Cramps", "Nausea", "Bloating", "Headache", "Cravings", "Mood", "Energy", "Notes", "Cycle day"],
    groups: [
      {
        title: "Cycle overview",
        description: "A gentle, non-childish cycle tracking space.",
        fields: ["Period start date", "Period end date", "Cycle day", "Notes"],
        cards: [{ title: "Cycle day", body: "Use this area for cycle-day notes, symptoms, and context.", meta: "Personal tracking" }]
      },
      {
        title: "Symptoms",
        description: "Track flow, cramps, nausea, bloating, headache, cravings, mood, and energy.",
        fields: ["Flow level", "Cramps", "Nausea", "Bloating", "Headache", "Cravings", "Mood", "Energy"]
      }
    ]
  },
  {
    id: "cycle-symptoms",
    title: "Cycle Symptoms",
    subtitle: "Mood, cramps, bloating, sleep, skin",
    icon: "calendarHeart",
    subcategories: ["Mood changes", "Anxiety", "Irritability", "Fatigue", "Cravings", "Cramps", "Bloating", "Nausea", "Headache", "Breast tenderness", "Sleep changes", "Skin changes", "Notes"],
    groups: [
      {
        title: "Cycle symptom entry",
        description: "Track cycle-related symptoms and context for personal organization only.",
        fields: ["Date", "Cycle day", "Symptoms", "Intensity", "Sleep changes", "Skin changes", "Notes"]
      }
    ]
  },
  {
    id: "hormone-notes",
    title: "Hormone / Cycle Notes",
    subtitle: "Symptoms, hormones, fertility, menopause",
    icon: "sparkles",
    subcategories: [
      "Cycle symptoms",
      "Mood changes",
      "Cramps",
      "Flow tracking",
      "PMS / mood symptoms",
      "Birth control notes",
      "Ovulation",
      "Fertility notes",
      "Perimenopause / Menopause",
      "Questions for doctor",
      "Notes"
    ],
    groups: [
      {
        title: "Cycle symptoms",
        description: "Track cycle-related symptoms and context for personal organization only.",
        fields: ["Date", "Cycle day", "Symptoms", "Intensity", "Sleep changes", "Skin changes", "Notes"]
      },
      {
        title: "Hormone-related note",
        description: "General notes for patterns, hormones, cycle changes, fertility, menopause, and doctor questions without diagnosis or medical advice.",
        fields: ["Date", "Pattern or concern", "Context", "Question for doctor", "Notes"]
      }
    ]
  },
  {
    id: "birth-control",
    title: "Birth Control Notes",
    subtitle: "Questions, timing, symptoms, notes",
    icon: "pill",
    subcategories: ["Current method", "Timing", "Side effect notes", "Questions for doctor", "Notes"],
    groups: [
      {
        title: "Birth control note",
        description: "Organize notes and questions to review with a licensed professional.",
        fields: ["Date", "Method", "Timing note", "Side effect note", "Question for doctor", "Notes"]
      }
    ]
  },
  {
    id: "ovulation",
    title: "Ovulation",
    subtitle: "Tracking notes and patterns",
    icon: "calendarHeart",
    subcategories: ["Estimated date", "Symptoms", "Energy", "Mood", "Notes"],
    groups: [
      {
        title: "Ovulation note",
        description: "Optional tracking notes for personal organization only.",
        fields: ["Date", "Estimated cycle day", "Symptoms", "Mood/energy", "Notes"]
      }
    ]
  },
  {
    id: "fertility",
    title: "Fertility Notes",
    subtitle: "Questions, tracking notes, appointments",
    icon: "heart",
    subcategories: ["Tracking notes", "Doctor questions", "Appointments", "Labs", "Notes"],
    groups: [
      {
        title: "Fertility note",
        description: "A private place for notes and questions to discuss with a clinician.",
        fields: ["Date", "Topic", "Question for doctor", "Related appointment or lab", "Notes"]
      }
    ]
  },
  {
    id: "menopause",
    title: "Perimenopause / Menopause",
    subtitle: "Symptoms, sleep, energy, doctor questions",
    icon: "sparkles",
    subcategories: ["Hot flashes", "Sleep", "Mood", "Energy", "Cycle changes", "Doctor questions", "Notes"],
    groups: [
      {
        title: "Perimenopause / menopause note",
        description: "Track changes and questions for personal organization only.",
        fields: ["Date", "Symptom or change", "Intensity", "Sleep/energy", "Question for doctor", "Notes"]
      }
    ]
  },
  {
    id: "testosterone",
    title: "Testosterone Tracker",
    subtitle: "Labs, symptoms, energy, questions",
    icon: "flask",
    subcategories: ["Test date", "Testosterone value", "Reference range", "Symptoms/energy notes", "Doctor questions", "Lab upload"],
    groups: [
      {
        title: "Testosterone entry",
        description: "Track lab values and questions without medical interpretation.",
        fields: ["Test date", "Testosterone value", "Unit", "Reference range", "Symptoms/energy notes", "Doctor questions", "Notes"]
      },
      {
        title: "Lab upload",
        description: "PDF upload is not connected yet. Manual entries save locally.",
        fields: ["Document name", "Lab date", "Notes"]
      }
    ]
  },
  {
    id: "mens-health",
    title: "Men's Health",
    subtitle: "Preventive notes, energy, recovery",
    icon: "heart",
    subcategories: ["Prostate health notes", "PSA lab", "Libido notes", "Energy notes", "Mood notes", "Sleep/recovery notes", "Hair loss notes", "Fertility notes", "Questions for doctor"],
    groups: [
      {
        title: "Men's health note",
        description: "Organize preventive health notes and doctor questions.",
        fields: ["Date", "Topic", "Notes", "Question for doctor", "Follow-up"]
      }
    ]
  },
  {
    id: "prostate",
    title: "Prostate Health Notes",
    subtitle: "PSA notes, questions, follow-up",
    icon: "heart",
    subcategories: ["PSA lab", "Symptoms notes", "Doctor questions", "Follow-up", "Notes"],
    groups: [
      {
        title: "Prostate health note",
        description: "Track notes and questions to discuss with a licensed professional.",
        fields: ["Date", "PSA note", "Symptom note", "Question for doctor", "Follow-up", "Notes"]
      }
    ]
  },
  {
    id: "libido-energy-mood",
    title: "Libido / Energy / Mood",
    subtitle: "Energy, mood, recovery notes",
    icon: "brain",
    subcategories: ["Libido notes", "Energy notes", "Mood notes", "Sleep", "Stress", "Doctor questions"],
    groups: [
      {
        title: "Libido / energy / mood entry",
        description: "Gentle tracking for patterns and clinician conversations.",
        fields: ["Date", "Libido note", "Energy level", "Mood", "Sleep/recovery", "Notes"]
      }
    ]
  },
  {
    id: "hair-loss",
    title: "Hair Loss Notes",
    subtitle: "Shedding, scalp, products, questions",
    icon: "scissors",
    subcategories: ["Shedding notes", "Thinning notes", "Scalp notes", "Products", "Progress photos", "Doctor questions"],
    groups: [
      {
        title: "Hair loss note",
        description: "Track hair and scalp observations for personal reference.",
        fields: ["Date", "Observation", "Scalp notes", "Products used", "Question for doctor", "Notes"]
      }
    ]
  },
  {
    id: "sleep-recovery",
    title: "Sleep / Recovery",
    subtitle: "Sleep quality, rest, recovery notes",
    icon: "activity",
    subcategories: ["Sleep quality", "Hours", "Recovery", "Fatigue", "Stress", "Notes"],
    groups: [
      {
        title: "Sleep / recovery entry",
        description: "Track sleep and recovery patterns without medical interpretation.",
        fields: ["Date", "Sleep hours", "Sleep quality", "Recovery", "Fatigue", "Notes"]
      }
    ]
  },
  {
    id: "mood",
    title: "Mood / Mental Health",
    subtitle: "Check-ins, notes, brain dump",
    icon: "brain",
    subcategories: ["Quick tap mood", "Quick Notes / Brain Dump", "Sentence field", "Notes", "Intensity", "Date/time", "Patterns"],
    groups: [
      {
        title: "Quick tap options",
        description: "Gentle check-ins for how the day feels.",
        checklist: ["Calm", "Anxious", "Overwhelmed", "Tired", "Sad", "Hopeful", "Irritable", "Foggy", "Energetic", "Nauseous"]
      },
      {
        title: "Entry fields",
        description: "A short sentence and note area for context.",
        fields: ["Short sentence", "Notes", "Intensity slider", "Date/time"]
      }
    ]
  },
  {
    id: "skin",
    title: "Skin & Beauty",
    subtitle: "Routines, products, irritation log",
    icon: "sparkles",
    subcategories: ["AM routine", "PM routine", "Current products", "Products to try", "Irritation/breakout log", "Progress photos", "Routine order"],
    groups: [
      {
        title: "AM skincare routine",
        description: "Clean, premium routine tracking.",
        checklist: ["Cleanser", "Toner", "Serum", "Eye cream", "Moisturizer", "Sunscreen"]
      },
      {
        title: "PM skincare routine",
        description: "Routine order: cleanser -> toner -> serum -> retinol/active -> eye cream -> moisturizer.",
        checklist: ["Cleanser", "Toner", "Serum", "Retinol/active", "Eye cream", "Moisturizer"]
      },
      {
        title: "Products and reactions",
        description: "Track current products, products to try, irritation, and breakouts.",
        fields: ["Product", "AM or PM", "Reaction", "Breakout note", "Photo note"]
      }
    ]
  },
  {
    id: "hair",
    title: "Hair Care",
    subtitle: "Wash day, curl routine, scalp notes",
    icon: "scissors",
    subcategories: ["Wash day", "Refresh day", "Products used", "Curl routine", "Scalp notes", "Progress photos", "Products to try"],
    groups: [
      {
        title: "Routine log",
        description: "Track wash days, refresh days, and product notes.",
        fields: ["Wash day", "Refresh day", "Products used", "Curl routine", "Scalp notes", "Products to try"],
        cards: [{ title: "Wash day note", body: "Track wash days, refresh days, products used, and scalp notes.", meta: "Personal tracking" }]
      },
      {
        title: "Progress photos",
        description: "Photo notes are local only. Real photo storage is not connected yet.",
        fields: ["Photo type", "Date", "Notes", "Comparison notes"]
      }
    ]
  },
  {
    id: "recipes",
    title: "Recipes",
    subtitle: "Saved meals, protein, fiber, notes",
    icon: "book",
    subcategories: [
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
    ],
    groups: [
      {
        title: "Recipe categories",
        description: "Organize meals by goal, time of day, and saved ideas.",
        checklist: ["Breakfast", "Lunch", "Dinner", "Snacks", "Smoothies", "Meal prep", "High protein", "High fiber"]
      },
      {
        title: "Recipe card",
        description: "Future recipe cards can include ingredients, directions, nutrition estimates, and notes.",
        fields: ["Ingredients", "Directions", "Protein estimate", "Fiber estimate", "Notes", "Log this meal"]
      }
    ]
  },
  {
    id: "documents",
    title: "Documents & Uploads",
    subtitle: "PDFs, photos, print reports, notes",
    icon: "upload",
    subcategories: ["Upload PDF", "Upload photo", "Lab documents", "Doctor documents", "Print Reports", "Progress photos", "Notes/documents"],
    groups: [
      {
        title: "Upload PDF",
        description: "Upload UI only. Real storage is intentionally not connected.",
        fields: ["Document type", "File", "Date", "Notes"]
      },
      {
        title: "Document library",
        description: "Future areas for lab documents, doctor documents, exported reports, progress photos, and notes.",
        checklist: ["Lab documents", "Doctor documents", "Exported reports", "Progress photos", "Notes/documents"]
      }
    ],
    futureNotes: [
      "Future: save private uploads securely.",
      "Future: keep documents available only inside your account.",
      "Future: never expose uploaded health documents publicly."
    ]
  },
  {
    id: "notes",
    title: "Quick Notes / Brain Dump",
    subtitle: "Capture anything, then route it",
    icon: "note",
    subcategories: ["Blank note", "Where should this go?", "Keyword suggestion", "General Notes"],
    groups: [
      {
        title: "Blank note",
        description: "Quickly type anything, save it, and choose a destination category.",
        fields: ["Note", "Suggested category", "Selected category", "Saved status"]
      },
      {
        title: "AI suggestion plan",
        description: "Keyword suggestions are local now. AI suggestions can be added later."
      }
    ]
  },
  {
    id: "reminders",
    title: "Reminders",
    subtitle: "Medication, water, appointments, custom",
    icon: "bell",
    subcategories: [
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
      "Custom reminder"
    ],
    groups: [
      {
        title: "Reminder types",
        description: "Create reminders for future notifications.",
        checklist: [
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
          "Custom reminder"
        ]
      },
      {
        title: "Reminder fields",
        description: "Future reminders can connect to notification and calendar flows.",
        fields: ["Title", "Date", "Time", "Recurrence", "Notes", "Completed checkbox"]
      }
    ]
  },
  {
    id: "photos",
    title: "Progress Photos",
    subtitle: "Body, face, skin, hair notes",
    icon: "camera",
    subcategories: ["Body progress photos", "Face progress photos", "Skin progress photos", "Hair progress photos", "Date", "Notes", "Comparison"],
    groups: [
      {
        title: "Photo categories",
        description: "Private layout for progress photo tracking.",
        checklist: ["Body progress photos", "Face progress photos", "Skin progress photos", "Hair progress photos"]
      },
      {
        title: "Comparison view",
        description: "Future comparison views can stay private and secure.",
        fields: ["Photo type", "Date", "Notes", "Comparison notes"]
      }
    ],
    futureNotes: ["Future: save photos securely inside your private account."]
  }
];
