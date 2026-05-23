import { RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import type { WellnessProfileId } from "../data/wellnessProfiles";
import type { TileId } from "../types/wellness";
import { getDailyTracker, mergeDailyTracker, resetDailyTracker, todayKey, type DailyTrackerEntry, type DailyTrackerMap } from "../lib/dailyTracking";
import { useLocalStorage } from "../lib/useLocalStorage";
import { FormField } from "./FormField";
import { ProgressBar } from "./ProgressBar";
import { ProgressRing } from "./ProgressRing";
import { SectionCard } from "./SectionCard";

interface DailyTrackersScreenProps {
  selectedProfile: WellnessProfileId;
  customTileIds: TileId[];
}

const dailyDefaults = {
  mood: "not checked in",
  medicationStatus: "not taken",
  workoutStatus: "not logged",
  alcohol: "none logged",
  foodNotes: "none logged",
  reminderCompletion: "not checked"
};

function dailyInputValue(value: string, defaultValue: string) {
  return value === defaultValue ? "" : value;
}

function dailyDisplayValue(value: string, defaultValue: string) {
  return value.trim() ? value : defaultValue;
}

export function DailyTrackersScreen({ selectedProfile, customTileIds }: DailyTrackersScreenProps) {
  const [dailyTrackers, setDailyTrackers] = useLocalStorage<DailyTrackerMap>("ybw.dailyTrackers", {});
  const [lastDailyDate, setLastDailyDate] = useLocalStorage("ybw.lastDailyTrackingDate", todayKey());
  const today = todayKey();
  const todayTracker = getDailyTracker(dailyTrackers, today);
  const showCycle = selectedProfile === "female" || (selectedProfile === "custom" && customTileIds.includes("period"));
  const dailyHistory = Object.values(dailyTrackers)
    .filter((entry) => entry.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);

  useEffect(() => {
    setDailyTrackers((current) => (current[today] ? current : mergeDailyTracker(current, today, {})));

    if (lastDailyDate !== today) {
      setLastDailyDate(today);
    }
  }, [lastDailyDate, setDailyTrackers, setLastDailyDate, today]);

  const updateToday = (updates: Partial<DailyTrackerEntry>) => {
    setDailyTrackers((current) => mergeDailyTracker(current, today, updates));
  };

  const setNumberField = (field: "water" | "protein" | "fiber", value: string) => {
    updateToday({ [field]: Number.parseFloat(value) || 0 });
  };

  const resetToday = () => {
    if (window.confirm("Reset today's daily tracker values? This will not delete saved entries or daily history.")) {
      setDailyTrackers((current) => resetDailyTracker(current, today));
    }
  };

  const snapshotItems = [
    { label: "Date", value: today, detail: "Daily values reset by date" },
    { label: "Mood", value: dailyDisplayValue(todayTracker.mood, dailyDefaults.mood), detail: todayTracker.mood === dailyDefaults.mood || !todayTracker.mood.trim() ? "Add a mood check-in" : "Mood checked in" },
    { label: "Water intake", value: `${todayTracker.water} oz`, detail: "Goal: 80 oz" },
    { label: "Medication status", value: dailyDisplayValue(todayTracker.medicationStatus, dailyDefaults.medicationStatus), detail: todayTracker.medicationStatus === "taken" ? "Marked for today" : "Not marked yet" },
    ...(showCycle ? [{ label: "Cycle day", value: "Add note", detail: "Track in Period Tracker" }] : []),
    { label: "Workout status", value: dailyDisplayValue(todayTracker.workoutStatus, dailyDefaults.workoutStatus), detail: todayTracker.workoutStatus === dailyDefaults.workoutStatus || !todayTracker.workoutStatus.trim() ? "No workout logged" : "Movement logged" },
    { label: "Food", value: dailyDisplayValue(todayTracker.foodNotes, dailyDefaults.foodNotes), detail: "Today only" },
    { label: "Alcohol", value: dailyDisplayValue(todayTracker.alcohol, dailyDefaults.alcohol), detail: "Today only" },
    { label: "Reminders", value: dailyDisplayValue(todayTracker.reminderCompletion, dailyDefaults.reminderCompletion), detail: "Today only" }
  ];

  return (
    <div className="grid gap-4">
      <SectionCard title="Today at a glance" description="A clean snapshot of today's daily tracking.">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua/75">Daily Snapshot</p>
          <ShieldCheck size={22} className="text-ice" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {snapshotItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-midnight/45 p-3">
              <p className="text-xs text-periwinkle/70">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
              <p className="mt-1 text-[0.72rem] leading-4 text-periwinkle/70">{item.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-3 sm:grid-cols-3">
        <ProgressRing label="Daily consistency" value={todayTracker.dailyConsistency} caption={`${today}: today's daily tracker`} />
        <div className="grid gap-3 sm:col-span-2">
          <ProgressBar label="Water" value={Math.min(100, Math.round((todayTracker.water / 80) * 100))} detail={`${todayTracker.water} oz of 80 oz target`} tone="aqua" />
          <ProgressBar label="Protein" value={Math.min(100, Math.round((todayTracker.protein / 110) * 100))} detail={`${todayTracker.protein} g of 110 g target`} tone="lavender" />
          <ProgressBar label="Fiber" value={Math.min(100, Math.round((todayTracker.fiber / 25) * 100))} detail={`${todayTracker.fiber} g of 25 g target`} tone="blue" />
        </div>
      </div>

      <SectionCard title="Today's daily tracker" description="These values save by date and reset automatically when a new day starts.">
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <FormField label="Water" type="number" value={todayTracker.water ? String(todayTracker.water) : ""} onChange={(value) => setNumberField("water", value)} placeholder="oz" />
            <FormField label="Protein" type="number" value={todayTracker.protein ? String(todayTracker.protein) : ""} onChange={(value) => setNumberField("protein", value)} placeholder="grams" />
            <FormField label="Fiber" type="number" value={todayTracker.fiber ? String(todayTracker.fiber) : ""} onChange={(value) => setNumberField("fiber", value)} placeholder="grams" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Mood" value={dailyInputValue(todayTracker.mood, dailyDefaults.mood)} onChange={(value) => updateToday({ mood: value })} placeholder={dailyDefaults.mood} />
            <FormField label="Medication status" value={dailyInputValue(todayTracker.medicationStatus, dailyDefaults.medicationStatus)} onChange={(value) => updateToday({ medicationStatus: value })} placeholder={dailyDefaults.medicationStatus} />
            <FormField label="Workout status" value={dailyInputValue(todayTracker.workoutStatus, dailyDefaults.workoutStatus)} onChange={(value) => updateToday({ workoutStatus: value })} placeholder={dailyDefaults.workoutStatus} />
            <FormField label="Alcohol" value={dailyInputValue(todayTracker.alcohol, dailyDefaults.alcohol)} onChange={(value) => updateToday({ alcohol: value })} placeholder={dailyDefaults.alcohol} />
            <FormField label="Food notes" value={dailyInputValue(todayTracker.foodNotes, dailyDefaults.foodNotes)} onChange={(value) => updateToday({ foodNotes: value })} placeholder={dailyDefaults.foodNotes} />
            <FormField label="Reminder completion" value={dailyInputValue(todayTracker.reminderCompletion, dailyDefaults.reminderCompletion)} onChange={(value) => updateToday({ reminderCompletion: value })} placeholder={dailyDefaults.reminderCompletion} />
          </div>
          <button
            type="button"
            onClick={resetToday}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-lavender/25 bg-lavender/10 px-4 text-sm font-semibold text-lavender"
          >
            <RotateCcw size={18} aria-hidden="true" />
            Reset Today
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Daily History" description="Previous daily tracker entries are kept by date.">
        {dailyHistory.length ? (
          <div className="grid gap-3">
            {dailyHistory.map((entry) => (
              <article key={entry.date} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{entry.date}</h3>
                    <p className="mt-1 text-xs text-lavender/80">{entry.dailyConsistency}% daily consistency</p>
                  </div>
                  <p className="text-xs text-periwinkle/70">{dailyDisplayValue(entry.medicationStatus, dailyDefaults.medicationStatus)}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-periwinkle/85">
                  Water {entry.water} oz | Protein {entry.protein} g | Fiber {entry.fiber} g | Mood {dailyDisplayValue(entry.mood, dailyDefaults.mood)} | Workout {dailyDisplayValue(entry.workoutStatus, dailyDefaults.workoutStatus)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-white/10 bg-midnight/45 p-4 text-sm text-periwinkle/85">No daily history yet. Tomorrow, today's tracker will appear here.</p>
        )}
      </SectionCard>
    </div>
  );
}
