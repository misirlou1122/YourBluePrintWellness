import type { DailySnapshotItem, ProfileSummary, ReportExport, WellnessTile } from "../types/wellness";

export const profileSummary: ProfileSummary = {
  name: "Your Profile",
  age: "Add age",
  height: "Add height",
  sex: "Female",
  mainGoals: ["Lower stress", "Support labs", "Build strength", "Stay consistent"]
};

export const dailySnapshot: DailySnapshotItem[] = [
  { label: "Mood", value: "Hopeful", detail: "Gentle morning check-in" },
  { label: "Water intake", value: "56 oz", detail: "Goal: 80 oz" },
  { label: "Medication status", value: "Taken", detail: "Morning routine complete" },
  { label: "Cycle day", value: "Day 18", detail: "Estimated cycle day" },
  { label: "Workout status", value: "Planned", detail: "20 min treadmill" },
  { label: "Upcoming reminder", value: "7:30 PM", detail: "Skincare routine" }
];

export const reportExports: ReportExport[] = [
  {
    title: "Export Doctor Summary as PDF",
    description: "Preview includes labs, medications, symptoms, mood notes, questions, and upcoming appointments."
  },
  {
    title: "Export Lab Trends",
    description: "Draft report for A1C, cholesterol, glucose, blood pressure, and weight trends."
  },
  {
    title: "Export Medication List",
    description: "Medication and supplement list with dosage, timing, and refill reminders."
  },
  {
    title: "Export Appointment Notes",
    description: "Things to discuss, questions, after-visit notes, and follow-up tasks."
  },
  {
    title: "Export Wellness Summary",
    description: "A private overview of wellness goals, habits, reminders, and progress."
  }
];

export const noteCategories = [
  "Health",
  "Bloodwork / Labs",
  "Doctor Appointments",
  "Medications & Supplements",
  "Vitals",
  "Fitness",
  "Food & Hydration",
  "Alcohol Tracker",
  "Period Tracker",
  "Mood / Mental Health",
  "Skin & Beauty",
  "Hair Care",
  "Recipes",
  "Documents",
  "General Notes"
];

export const noteSuggestionRules = [
  { category: "Alcohol Tracker", keywords: ["margarita", "wine", "beer", "cocktail", "alcohol", "drink"] },
  { category: "Skin & Beauty", keywords: ["niacinamide", "retinol", "serum", "breakout", "sunscreen", "cleanser"] },
  { category: "Fitness", keywords: ["treadmill", "walked", "workout", "pilates", "sets", "reps", "miles"] },
  { category: "Bloodwork / Labs", keywords: ["a1c", "cholesterol", "ldl", "hdl", "triglycerides", "glucose", "labs"] },
  { category: "Doctor Appointments", keywords: ["doctor", "appointment", "follow up", "questions", "specialist"] },
  { category: "Medications & Supplements", keywords: ["medication", "dose", "supplement", "refill", "pharmacist"] },
  { category: "Mood / Mental Health", keywords: ["anxious", "sad", "overwhelmed", "foggy", "hopeful", "irritable"] },
  { category: "Food & Hydration", keywords: ["protein", "fiber", "water", "snack", "meal", "nausea"] },
  { category: "Period Tracker", keywords: ["period", "cramps", "cycle", "flow", "bloating"] },
  { category: "Hair Care", keywords: ["wash day", "curl", "scalp", "hair", "refresh"] }
];

export const wellnessTiles: WellnessTile[] = [
  {
    id: "health",
    title: "Health",
    subtitle: "History, goals, symptoms, questions",
    icon: "heart",
    subcategories: [
      "Overview",
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
        title: "Symptoms",
        description: "Track symptom notes gently with timing, context, and intensity.",
        fields: ["Symptom", "Date/time", "Intensity", "Possible trigger", "Notes"],
        cards: [{ title: "Example symptom note", body: "Mild nausea after dinner. Hydrated and rested.", meta: "Starter example" }]
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
      "Future: upload lab PDFs to Azure Blob Storage.",
      "Future: use Azure AI Document Intelligence to extract A1C, cholesterol, LDL, HDL, triglycerides, glucose, and related values.",
      "Future: store reviewed lab values in Azure SQL Database through Azure Functions."
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
      "Export appointment summary"
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
        description: "A visit-specific checklist that can become part of an export later.",
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
        cards: [{ title: "Medication example", body: "Morning dose marked taken today.", meta: "Starter example" }]
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
        cards: [{ title: "Example reading", body: "118/76 with resting heart rate 72.", meta: "Starter example" }]
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
        cards: [{ title: "Example treadmill", body: "20 minutes, 1.1 miles, comfortable pace.", meta: "Starter example" }]
      },
      {
        title: "Strength",
        description: "Capture exercises, sets, reps, and resistance.",
        fields: ["Exercise name", "Sets", "Reps", "Weight/resistance", "Notes"]
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
        cards: [{ title: "Example meal note", body: "Greek yogurt, berries, and water.", meta: "Starter example" }]
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
        cards: [{ title: "Example entry", body: "One margarita at dinner. Slept lightly.", meta: "Starter example" }]
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
        cards: [{ title: "Cycle day", body: "Day 18 estimate.", meta: "Starter example" }]
      },
      {
        title: "Symptoms",
        description: "Track flow, cramps, nausea, bloating, headache, cravings, mood, and energy.",
        fields: ["Flow level", "Cramps", "Nausea", "Bloating", "Headache", "Cravings", "Mood", "Energy"]
      }
    ]
  },
  {
    id: "mood",
    title: "Mood / Mental Health",
    subtitle: "Quick check-ins, notes, intensity",
    icon: "brain",
    subcategories: ["Quick tap mood", "Sentence field", "Notes", "Intensity", "Date/time", "Patterns"],
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
        cards: [{ title: "Example wash day", body: "Gentle shampoo, mask, curl cream, diffuser.", meta: "Starter example" }]
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
    subtitle: "PDFs, photos, reports, notes",
    icon: "upload",
    subcategories: ["Upload PDF", "Upload photo", "Lab documents", "Doctor documents", "Exported reports", "Progress photos", "Notes/documents"],
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
      "Future: store private uploads in Azure Blob Storage.",
      "Future: protect access with Azure Static Web Apps authentication or Microsoft Entra External ID.",
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
    futureNotes: ["Future: store photos securely in Azure Blob Storage with authenticated access only."]
  }
];
