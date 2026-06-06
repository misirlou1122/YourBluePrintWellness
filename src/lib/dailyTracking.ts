export interface DailyWaterEntry {
  id: string;
  amount: number;
  createdAt: string;
}

export interface DailyFoodEntry {
  id: string;
  input: string;
  matchedFoodName: string;
  quantityLabel: string;
  calories: number;
  protein: number;
  fiber: number;
  createdAt: string;
}

export interface DailyTrackerEntry {
  date: string;
  water: number;
  waterEntries: DailyWaterEntry[];
  protein: number;
  fiber: number;
  calories: number;
  dailyConsistency: number;
  medicationStatus: string;
  mood: string;
  workoutStatus: string;
  workoutCalories: number;
  alcohol: string;
  alcoholDrinkType: string;
  alcoholAmount: number;
  foodEntries: DailyFoodEntry[];
  updatedAt: string;
}

export type DailyTrackerMap = Record<string, DailyTrackerEntry>;

export function todayKey(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

export function emptyDailyTracker(date = todayKey()): DailyTrackerEntry {
  return {
    date,
    water: 0,
    waterEntries: [],
    protein: 0,
    fiber: 0,
    calories: 0,
    dailyConsistency: 0,
    medicationStatus: "not taken",
    mood: "not checked in",
    workoutStatus: "not logged",
    workoutCalories: 0,
    alcohol: "none logged",
    alcoholDrinkType: "",
    alcoholAmount: 0,
    foodEntries: [],
    updatedAt: new Date().toISOString()
  };
}

export function totalFoodNutrition(foodEntries: DailyFoodEntry[] = []) {
  return foodEntries.reduce(
    (totals, entry) => ({
      calories: totals.calories + (Number(entry.calories) || 0),
      protein: totals.protein + (Number(entry.protein) || 0),
      fiber: totals.fiber + (Number(entry.fiber) || 0)
    }),
    { calories: 0, protein: 0, fiber: 0 }
  );
}

export function calculateDailyConsistency(entry: DailyTrackerEntry) {
  const isFilled = (value: string, defaultValue: string) => Boolean(value.trim()) && value !== defaultValue;
  const completed = [
    entry.water > 0,
    entry.protein > 0,
    entry.fiber > 0,
    entry.calories > 0,
    isFilled(entry.medicationStatus, "not taken"),
    isFilled(entry.mood, "not checked in"),
    isFilled(entry.workoutStatus, "not logged")
  ].filter(Boolean).length;

  return Math.round((completed / 7) * 100);
}

export function getDailyTracker(trackers: DailyTrackerMap, date = todayKey()) {
  const existing = trackers[date];
  if (!existing) {
    return emptyDailyTracker(date);
  }

  return {
    ...emptyDailyTracker(date),
    ...existing,
    date,
    waterEntries: Array.isArray(existing.waterEntries) ? existing.waterEntries : [],
    foodEntries: Array.isArray(existing.foodEntries) ? existing.foodEntries : []
  };
}

export function mergeDailyTracker(trackers: DailyTrackerMap, date: string, updates: Partial<DailyTrackerEntry>) {
  const nextEntry = {
    ...getDailyTracker(trackers, date),
    ...updates,
    date,
    updatedAt: new Date().toISOString()
  };

  return {
    ...trackers,
    [date]: {
      ...nextEntry,
      dailyConsistency: updates.dailyConsistency ?? calculateDailyConsistency(nextEntry)
    }
  };
}

export function resetDailyTracker(trackers: DailyTrackerMap, date = todayKey()) {
  return {
    ...trackers,
    [date]: emptyDailyTracker(date)
  };
}
