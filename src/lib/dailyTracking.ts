export interface DailyTrackerEntry {
  date: string;
  water: number;
  protein: number;
  fiber: number;
  dailyConsistency: number;
  medicationStatus: "not taken" | "taken";
  mood: string;
  workoutStatus: string;
  alcohol: string;
  foodNotes: string;
  reminderCompletion: string;
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
    protein: 0,
    fiber: 0,
    dailyConsistency: 0,
    medicationStatus: "not taken",
    mood: "not checked in",
    workoutStatus: "not logged",
    alcohol: "none logged",
    foodNotes: "none logged",
    reminderCompletion: "not checked",
    updatedAt: new Date().toISOString()
  };
}

export function calculateDailyConsistency(entry: DailyTrackerEntry) {
  const completed = [
    entry.water > 0,
    entry.protein > 0,
    entry.fiber > 0,
    entry.medicationStatus === "taken",
    entry.mood !== "not checked in",
    entry.workoutStatus !== "not logged",
    entry.alcohol !== "none logged",
    entry.foodNotes !== "none logged",
    entry.reminderCompletion !== "not checked"
  ].filter(Boolean).length;

  return Math.round((completed / 9) * 100);
}

export function getDailyTracker(trackers: DailyTrackerMap, date = todayKey()) {
  return trackers[date] ?? emptyDailyTracker(date);
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
