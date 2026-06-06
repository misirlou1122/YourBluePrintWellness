import { useState } from "react";
import { AlertTriangle, CheckCircle2, Dumbbell, Flame, Minus, Plus, Timer, Trash2 } from "lucide-react";
import { CollapsibleSectionCard } from "../CollapsibleSectionCard";
import { EntryActions } from "../EntryActions";
import { EmptyState } from "../EmptyState";
import { FormField, TextAreaField } from "../FormField";
import { ProgressBar } from "../ProgressBar";
import { SectionCard } from "../SectionCard";
import { parseWeightPounds } from "../../lib/bodyMetrics";
import { mergeDailyTracker, todayKey, type DailyTrackerMap } from "../../lib/dailyTracking";
import {
  buildFitnessActivity,
  calculateActivityCalories,
  calculateWorkoutCalories,
  cardioOptions,
  getFitnessActivityOption,
  mindBodyOptions,
  parsePositiveNumber,
  quickWorkoutOptions,
  strengthMachineOptions,
  summarizeWorkout,
  type FitnessActivityEntry,
  type FitnessActivityOption,
  type FitnessSetEntry
} from "../../lib/fitnessEstimator";
import { createId, useLocalCollection, useLocalStorage } from "../../lib/useLocalStorage";
import { emptyUserProfile } from "../../types/userProfile";

interface FoodLog {
  id: string;
  date: string;
  waterAmount: string;
  protein: string;
  fiber: string;
  meals: string;
  snacks: string;
  caffeine: string;
  cravings: string;
  nausea: string;
  notes: string;
}

interface AlcoholLog {
  id: string;
  date: string;
  drinkType: string;
  drinks: string;
  moodBefore: string;
  moodAfter: string;
  sleepImpact: string;
  notes: string;
}

interface FitnessLog {
  id: string;
  date: string;
  plannedWorkout: string;
  completedWorkout: string;
  cardio: string;
  treadmillMinutes: string;
  treadmillMiles: string;
  treadmillIncline: string;
  treadmillSpeed: string;
  strengthExercise: string;
  sets: string;
  reps: string;
  weight: string;
  notes: string;
  completed?: boolean;
  selectedPlans?: string[];
  activities?: FitnessActivityEntry[];
  estimatedCalories?: number;
  bodyWeight?: string;
}

const emptyFood: Omit<FoodLog, "id"> = {
  date: "",
  waterAmount: "",
  protein: "",
  fiber: "",
  meals: "",
  snacks: "",
  caffeine: "",
  cravings: "",
  nausea: "",
  notes: ""
};

const emptyAlcohol: Omit<AlcoholLog, "id"> = {
  date: "",
  drinkType: "",
  drinks: "1",
  moodBefore: "",
  moodAfter: "",
  sleepImpact: "",
  notes: ""
};

const emptyFitness: Omit<FitnessLog, "id"> = {
  date: "",
  plannedWorkout: "",
  completedWorkout: "",
  cardio: "",
  treadmillMinutes: "",
  treadmillMiles: "",
  treadmillIncline: "",
  treadmillSpeed: "",
  strengthExercise: "",
  sets: "",
  reps: "",
  weight: "",
  notes: "",
  completed: true,
  selectedPlans: [],
  activities: [],
  estimatedCalories: 0,
  bodyWeight: ""
};

function percent(value: string, goal: number) {
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) {
    return 0;
  }

  return Math.min(100, Math.round((numeric / goal) * 100));
}

type FitnessDraft = Omit<FitnessLog, "id">;

function normalizeFitnessActivity(activity: FitnessActivityEntry): FitnessActivityEntry {
  const option = getFitnessActivityOption(activity.optionId);

  return {
    ...activity,
    type: activity.type ?? option?.type ?? "cardio",
    name: activity.name || option?.label || "Workout",
    minutes: activity.minutes ?? option?.defaultMinutes ?? "",
    met: activity.met ?? option?.met,
    speed: activity.speed ?? option?.defaultSpeed,
    incline: activity.incline ?? option?.defaultIncline,
    sets: Array.isArray(activity.sets) ? activity.sets : option?.type === "strength" ? [] : undefined
  };
}

function normalizeFitnessDraft(value: FitnessDraft): FitnessDraft {
  return {
    ...emptyFitness,
    ...value,
    selectedPlans: Array.isArray(value.selectedPlans) ? value.selectedPlans : [],
    activities: Array.isArray(value.activities) ? value.activities.map(normalizeFitnessActivity) : [],
    completed: value.completed ?? true
  };
}

function normalizeFitnessLog(entry: FitnessLog) {
  const { id, ...rest } = entry;
  return { id, ...normalizeFitnessDraft(rest) };
}

function formatFitnessNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function caloriesProgress(calories: number) {
  return Math.min(100, Math.round((calories / 500) * 100));
}

function createActivity(option: FitnessActivityOption) {
  return buildFitnessActivity(option, createId("fitness-activity"), [createId("fitness-set"), createId("fitness-set"), createId("fitness-set")]);
}

function activityDetail(activity: FitnessActivityEntry) {
  if (activity.type === "strength") {
    const sets = activity.sets ?? [];
    const setLabel = sets.length ? `${sets.length} set${sets.length === 1 ? "" : "s"}` : "sets";
    const weights = sets.map((set) => (set.weight ? `${set.weight} lb` : "")).filter(Boolean);
    return [setLabel, weights.join(", ")].filter(Boolean).join(" | ");
  }

  if (activity.optionId === "treadmill-walk") {
    return `${activity.minutes || "0"} min | ${activity.speed || "0"} mph | ${activity.incline || "0"}% incline`;
  }

  return `${activity.minutes || "0"} min`;
}

function ChoiceButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-14 rounded-2xl border px-3 text-sm font-semibold transition ${
        selected ? "border-ice/70 bg-ice/15 text-ice shadow-ice" : "border-white/10 bg-midnight/45 text-periwinkle/85"
      }`}
    >
      {label}
    </button>
  );
}

function NumberStepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  suffix
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  step?: number;
  min?: number;
  suffix?: string;
}) {
  const numeric = parsePositiveNumber(value);
  const adjust = (delta: number) => onChange(formatFitnessNumber(Math.max(min, numeric + delta)));

  return (
    <label className="grid gap-1 text-sm text-periwinkle/85">
      <span>{label}</span>
      <div className="grid min-h-12 grid-cols-[2.75rem_1fr_2.75rem] overflow-hidden rounded-2xl border border-white/10 bg-midnight/55">
        <button type="button" onClick={() => adjust(-step)} className="grid place-items-center border-r border-white/10 text-ice" aria-label={`Decrease ${label}`}>
          <Minus size={16} aria-hidden="true" />
        </button>
        <div className="flex min-w-0 items-center">
          <input
            type="number"
            value={value}
            min={min}
            step={step}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-2 text-center text-sm font-semibold text-white outline-none"
          />
          {suffix ? <span className="pr-3 text-xs text-periwinkle/65">{suffix}</span> : null}
        </div>
        <button type="button" onClick={() => adjust(step)} className="grid place-items-center border-l border-white/10 text-ice" aria-label={`Increase ${label}`}>
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </label>
  );
}

export function FoodHydrationScreen() {
  const { items, add, update, remove } = useLocalCollection<FoodLog>("ybw.foodLogs", [], "food");
  const [draft, setDraft] = useLocalStorage("ybw.foodDraft", emptyFood);
  const [, setDailyTrackers] = useLocalStorage<DailyTrackerMap>("ybw.dailyTrackers", {});
  const [editingId, setEditingId] = useState<string | null>(null);
  const latest = items[0];

  const setField = (field: keyof typeof emptyFood, value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const reset = () => {
    setDraft(emptyFood);
    setEditingId(null);
  };
  const save = () => {
    if (!Object.values(draft).some((value) => String(value).trim())) {
      return;
    }
    const entry = { ...draft, date: draft.date || new Date().toISOString().slice(0, 10) };
    if (editingId) update(editingId, entry);
    else add(entry);
    setDailyTrackers((current) =>
      mergeDailyTracker(current, entry.date, {
        water: Number.parseFloat(entry.waterAmount) || 0,
        protein: Number.parseFloat(entry.protein) || 0,
        fiber: Number.parseFloat(entry.fiber) || 0
      })
    );
    reset();
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <ProgressBar label="Water" value={percent(latest?.waterAmount ?? "0", 80)} detail={latest ? `${latest.waterAmount} oz logged` : "No water logged yet"} tone="aqua" />
        <ProgressBar label="Protein" value={percent(latest?.protein ?? "0", 110)} detail={latest ? `${latest.protein} g logged` : "No protein logged yet"} tone="lavender" />
        <ProgressBar label="Fiber" value={percent(latest?.fiber ?? "0", 25)} detail={latest ? `${latest.fiber} g logged` : "No fiber logged yet"} tone="blue" />
      </div>

      <CollapsibleSectionCard storageKey="ybw.food.formOpen" forceOpen={Boolean(editingId)} eyebrow={editingId ? "Edit food log" : "Add food log"} title={editingId ? "Update food and hydration" : "Food and hydration log"} sectionLabel="Meals">
        <div className="grid gap-3">
          <FormField label="Date" type="date" value={draft.date} onChange={(value) => setField("date", value)} />
          <div className="grid gap-3 sm:grid-cols-3">
            <FormField label="Water amount" value={draft.waterAmount} onChange={(value) => setField("waterAmount", value)} placeholder="oz" />
            <FormField label="Protein" value={draft.protein} onChange={(value) => setField("protein", value)} placeholder="grams" />
            <FormField label="Fiber" value={draft.fiber} onChange={(value) => setField("fiber", value)} placeholder="grams" />
          </div>
          <TextAreaField label="Meals" value={draft.meals} onChange={(value) => setField("meals", value)} />
          <TextAreaField label="Snacks" value={draft.snacks} onChange={(value) => setField("snacks", value)} />
          <FormField label="Caffeine" value={draft.caffeine} onChange={(value) => setField("caffeine", value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Cravings" value={draft.cravings} onChange={(value) => setField("cravings", value)} />
            <FormField label="Nausea" value={draft.nausea} onChange={(value) => setField("nausea", value)} />
          </div>
          <TextAreaField label="Notes" value={draft.notes} onChange={(value) => setField("notes", value)} />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={save} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
            <Plus size={18} aria-hidden="true" />
            {editingId ? "Save changes" : "Add food log"}
          </button>
          {editingId ? <button type="button" onClick={reset} className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85">Cancel edit</button> : null}
        </div>
      </CollapsibleSectionCard>

      {items.length ? (
        <SectionCard title="Food and hydration history">
          <div className="grid gap-3">
            {items.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{entry.date}</h3>
                    <p className="mt-1 text-sm text-periwinkle/85">Water {entry.waterAmount || "0"} oz | Protein {entry.protein || "0"} g | Fiber {entry.fiber || "0"} g</p>
                  </div>
                  <EntryActions onEdit={() => { const { id: _id, ...rest } = entry; setDraft(rest); setEditingId(entry.id); }} onDelete={() => remove(entry.id)} />
                </div>
                {entry.meals ? <p className="mt-3 text-sm leading-6 text-white">Meals: {entry.meals}</p> : null}
                {entry.snacks ? <p className="mt-1 text-sm leading-6 text-periwinkle/85">Snacks: {entry.snacks}</p> : null}
                {[entry.caffeine, entry.cravings, entry.nausea, entry.notes].filter(Boolean).length ? (
                  <p className="mt-2 text-sm leading-6 text-periwinkle/80">{[entry.caffeine, entry.cravings, entry.nausea, entry.notes].filter(Boolean).join(" | ")}</p>
                ) : null}
              </article>
            ))}
          </div>
        </SectionCard>
      ) : (
        <EmptyState title="No food logs yet" message="Add your first food and hydration log." />
      )}
    </div>
  );
}

export function AlcoholScreen() {
  const { items, add, update, remove } = useLocalCollection<AlcoholLog>("ybw.alcohol", [], "alcohol");
  const [draft, setDraft] = useLocalStorage("ybw.alcoholDraft", emptyAlcohol);
  const [, setDailyTrackers] = useLocalStorage<DailyTrackerMap>("ybw.dailyTrackers", {});
  const [editingId, setEditingId] = useState<string | null>(null);
  const setField = (field: keyof typeof emptyAlcohol, value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const reset = () => { setDraft(emptyAlcohol); setEditingId(null); };
  const save = () => {
    if (!draft.drinkType.trim()) return;
    const entry = { ...draft, date: draft.date || new Date().toISOString().slice(0, 10) };
    if (editingId) update(editingId, entry);
    else add(entry);
    setDailyTrackers((current) =>
      mergeDailyTracker(current, entry.date, {
        alcohol: `${entry.drinks || "1"} standard drink${Number(entry.drinks) === 1 ? "" : "s"} | ${entry.drinkType}`,
        alcoholDrinkType: entry.drinkType,
        alcoholAmount: Number.parseFloat(entry.drinks) || 0
      })
    );
    reset();
  };

  return (
    <div className="grid gap-4">
      <SectionCard className="border-champagne/20 bg-champagne/10">
        <div className="flex items-start gap-3 text-champagne">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-6 text-white">Check with your doctor or pharmacist for medication interactions.</p>
        </div>
      </SectionCard>
      <CollapsibleSectionCard storageKey="ybw.alcohol.formOpen" forceOpen={Boolean(editingId)} eyebrow={editingId ? "Edit alcohol log" : "Add alcohol log"} title="Alcohol tracker" sectionLabel="Drink type">
        <div className="grid gap-3">
          <FormField label="Date" type="date" value={draft.date} onChange={(value) => setField("date", value)} />
          <FormField label="Drink type" value={draft.drinkType} onChange={(value) => setField("drinkType", value)} />
          <FormField label="Number of drinks" type="number" value={draft.drinks} onChange={(value) => setField("drinks", value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Mood before" value={draft.moodBefore} onChange={(value) => setField("moodBefore", value)} />
            <FormField label="Mood after" value={draft.moodAfter} onChange={(value) => setField("moodAfter", value)} />
          </div>
          <FormField label="Sleep impact" value={draft.sleepImpact} onChange={(value) => setField("sleepImpact", value)} />
          <TextAreaField label="Notes" value={draft.notes} onChange={(value) => setField("notes", value)} />
        </div>
        <button type="button" onClick={save} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {editingId ? "Save changes" : "Add alcohol log"}
        </button>
      </CollapsibleSectionCard>
      {items.length ? (
        <SectionCard title="Alcohol history">
          <div className="grid gap-3">
            {items.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{entry.drinkType}</h3>
                    <p className="mt-1 text-xs text-periwinkle/75">{entry.date} | {entry.drinks} drink(s)</p>
                  </div>
                  <EntryActions onEdit={() => { const { id: _id, ...rest } = entry; setDraft(rest); setEditingId(entry.id); }} onDelete={() => remove(entry.id)} />
                </div>
                <p className="mt-2 text-sm leading-6 text-periwinkle/85">{[entry.moodBefore, entry.moodAfter, entry.sleepImpact, entry.notes].filter(Boolean).join(" | ")}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      ) : (
        <EmptyState title="No alcohol logs yet" message="Add your first alcohol log." />
      )}
    </div>
  );
}

export function FitnessScreen() {
  const { items, add, update, remove } = useLocalCollection<FitnessLog>("ybw.fitness", [], "fitness");
  const [draft, setDraft] = useLocalStorage<FitnessDraft>("ybw.fitnessDraft", emptyFitness);
  const [, setDailyTrackers] = useLocalStorage<DailyTrackerMap>("ybw.dailyTrackers", {});
  const [profile] = useLocalStorage("ybw.userProfile", emptyUserProfile);
  const [editingId, setEditingId] = useState<string | null>(null);
  const normalizedDraft = normalizeFitnessDraft(draft);
  const activities = normalizedDraft.activities ?? [];
  const selectedPlans = normalizedDraft.selectedPlans ?? [];
  const estimateWeightLabel = String(normalizedDraft.bodyWeight ?? "").trim() || profile.weight || "170 lb";
  const estimateWeightPounds = parseWeightPounds(estimateWeightLabel) || 170;
  const estimatedCalories = calculateWorkoutCalories(activities, estimateWeightPounds);
  const workoutSummary = summarizeWorkout(activities, selectedPlans) || normalizedDraft.completedWorkout || normalizedDraft.plannedWorkout || "Workout";
  const latestEntry = items[0] ? normalizeFitnessLog(items[0]) : null;

  const updateDraft = (updater: (current: FitnessDraft) => FitnessDraft) => {
    setDraft((current) => updater(normalizeFitnessDraft(current)));
  };

  const setField = <K extends keyof FitnessDraft>(field: K, value: FitnessDraft[K]) => {
    updateDraft((current) => ({ ...current, [field]: value }));
  };

  const setActivities = (updater: (current: FitnessActivityEntry[]) => FitnessActivityEntry[]) => {
    updateDraft((current) => ({ ...current, activities: updater(current.activities ?? []) }));
  };

  const toggleQuickPlan = (option: (typeof quickWorkoutOptions)[number]) => {
    updateDraft((current) => {
      const currentPlans = current.selectedPlans ?? [];
      const isSelected = currentPlans.includes(option.id);
      const selectedPlans = isSelected ? currentPlans.filter((planId) => planId !== option.id) : [...currentPlans, option.id];
      let nextActivities = current.activities ?? [];

      if (option.activityOptionId) {
        const activityOption = getFitnessActivityOption(option.activityOptionId);
        if (isSelected) {
          nextActivities = nextActivities.filter((activity) => activity.optionId !== option.activityOptionId);
        } else if (activityOption && !nextActivities.some((activity) => activity.optionId === option.activityOptionId)) {
          nextActivities = [...nextActivities, createActivity(activityOption)];
        }
      }

      return { ...current, selectedPlans, activities: nextActivities };
    });
  };

  const toggleActivity = (option: FitnessActivityOption) => {
    updateDraft((current) => {
      const currentActivities = current.activities ?? [];
      const hasActivity = currentActivities.some((activity) => activity.optionId === option.id);
      const activities = hasActivity ? currentActivities.filter((activity) => activity.optionId !== option.id) : [...currentActivities, createActivity(option)];
      const linkedQuickPlan = quickWorkoutOptions.find((quickOption) => quickOption.activityOptionId === option.id);
      let selectedPlans = current.selectedPlans ?? [];

      if (linkedQuickPlan) {
        selectedPlans = hasActivity
          ? selectedPlans.filter((planId) => planId !== linkedQuickPlan.id)
          : selectedPlans.includes(linkedQuickPlan.id)
            ? selectedPlans
            : [...selectedPlans, linkedQuickPlan.id];
      } else if (option.type === "strength" && !selectedPlans.includes("strength-machines")) {
        selectedPlans = [...selectedPlans, "strength-machines"];
      }

      return { ...current, selectedPlans, activities };
    });
  };

  const updateActivity = (activityId: string, updates: Partial<FitnessActivityEntry>) => {
    setActivities((current) => current.map((activity) => (activity.id === activityId ? { ...activity, ...updates } : activity)));
  };

  const removeActivity = (activityId: string) => {
    setActivities((current) => current.filter((activity) => activity.id !== activityId));
  };

  const updateSet = (activityId: string, setId: string, updates: Partial<FitnessSetEntry>) => {
    setActivities((current) =>
      current.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              sets: (activity.sets ?? []).map((set) => (set.id === setId ? { ...set, ...updates } : set))
            }
          : activity
      )
    );
  };

  const addSet = (activityId: string) => {
    setActivities((current) =>
      current.map((activity) => {
        if (activity.id !== activityId) return activity;
        const sets = activity.sets ?? [];
        const lastSet = sets[sets.length - 1];
        return {
          ...activity,
          sets: [...sets, { id: createId("fitness-set"), reps: lastSet?.reps || "10", weight: lastSet?.weight || "25" }]
        };
      })
    );
  };

  const removeSet = (activityId: string, setId: string) => {
    setActivities((current) =>
      current.map((activity) =>
        activity.id === activityId ? { ...activity, sets: (activity.sets ?? []).filter((set) => set.id !== setId) } : activity
      )
    );
  };

  const reset = () => {
    setDraft(emptyFitness);
    setEditingId(null);
  };

  const save = () => {
    const current = normalizeFitnessDraft(draft);
    const hasWorkout = Boolean((current.activities ?? []).length || (current.selectedPlans ?? []).length || current.notes.trim() || current.plannedWorkout.trim() || current.completedWorkout.trim());
    if (!hasWorkout) return;

    const entryActivities = current.activities ?? [];
    const entrySelectedPlans = current.selectedPlans ?? [];
    const weightLabel = String(current.bodyWeight ?? "").trim() || profile.weight || "170 lb";
    const weightPounds = parseWeightPounds(weightLabel) || 170;
    const calories = calculateWorkoutCalories(entryActivities, weightPounds);
    const summary = summarizeWorkout(entryActivities, entrySelectedPlans) || current.completedWorkout || current.plannedWorkout || "Workout";
    const cardioActivities = entryActivities.filter((activity) => activity.type === "cardio");
    const strengthActivities = entryActivities.filter((activity) => activity.type === "strength");
    const treadmill = cardioActivities.find((activity) => activity.optionId === "treadmill-walk");
    const maxSets = Math.max(0, ...strengthActivities.map((activity) => activity.sets?.length ?? 0));
    const allSets = strengthActivities.flatMap((activity) => activity.sets ?? []);
    const entry: Omit<FitnessLog, "id"> = {
      ...current,
      date: current.date || todayKey(),
      bodyWeight: weightLabel,
      estimatedCalories: calories,
      plannedWorkout: current.completed ? current.plannedWorkout || summary : summary,
      completedWorkout: current.completed ? summary : "",
      cardio: cardioActivities.map((activity) => `${activity.name} ${activityDetail(activity)}`).join(" | "),
      treadmillMinutes: treadmill?.minutes ?? "",
      treadmillIncline: treadmill?.incline ?? "",
      treadmillSpeed: treadmill?.speed ?? "",
      treadmillMiles: current.treadmillMiles,
      strengthExercise: strengthActivities.map((activity) => `${activity.name} ${activityDetail(activity)}`).join(" | "),
      sets: maxSets ? String(maxSets) : "",
      reps: allSets[0]?.reps ?? "",
      weight: allSets.map((set) => (set.weight ? `${set.weight} lb` : "")).filter(Boolean).join(", ")
    };

    if (editingId) update(editingId, entry);
    else add(entry);

    setDailyTrackers((current) =>
      mergeDailyTracker(current, entry.date, {
        workoutStatus: `${summary} ${entry.completed ? "completed" : "planned"}${entry.completed && calories ? ` | ${calories} kcal` : ""}`,
        workoutCalories: entry.completed ? calories : 0
      })
    );
    reset();
  };

  return (
    <div className="grid gap-4">
      <SectionCard title="Fitness snapshot" description={latestEntry ? `${latestEntry.date || "Latest workout"} | ${latestEntry.completed ? "Completed" : "Planned"}` : "No workouts logged yet."}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-ice/20 bg-ice/10 p-4">
            <div className="flex items-center gap-2 text-ice">
              <Flame size={18} aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Estimate</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-white">{estimatedCalories} kcal</p>
            <p className="mt-1 text-xs leading-5 text-periwinkle/75">{estimateWeightLabel}</p>
          </div>
          <div className="rounded-2xl border border-lavender/20 bg-lavender/10 p-4">
            <div className="flex items-center gap-2 text-lavender">
              <Dumbbell size={18} aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Workout</p>
            </div>
            <p className="mt-2 text-lg font-semibold leading-tight text-white">{workoutSummary}</p>
            <p className="mt-1 text-xs leading-5 text-periwinkle/75">{activities.length} selected</p>
          </div>
          <div className="rounded-2xl border border-aqua/20 bg-aqua/10 p-4">
            <div className="flex items-center gap-2 text-aqua">
              <Timer size={18} aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Status</p>
            </div>
            <p className="mt-2 text-lg font-semibold text-white">{normalizedDraft.completed ? "Done" : "Planned"}</p>
            <p className="mt-1 text-xs leading-5 text-periwinkle/75">{normalizedDraft.date || todayKey()}</p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar label="Calories burned" value={caloriesProgress(estimatedCalories)} detail={`${estimatedCalories} kcal estimated`} tone="aqua" />
        </div>
      </SectionCard>

      <CollapsibleSectionCard storageKey="ybw.fitness.formOpen" forceOpen={Boolean(editingId)} eyebrow={editingId ? "Edit workout" : "Add workout"} title="Workout builder" sectionLabel="What I Did Today">
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Date" type="date" value={normalizedDraft.date} onChange={(value) => setField("date", value)} />
            <FormField label="Estimate weight" value={normalizedDraft.bodyWeight} onChange={(value) => setField("bodyWeight", value)} placeholder={profile.weight || "170 lb"} />
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-midnight/45 p-1">
            <button
              type="button"
              onClick={() => setField("completed", true)}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${normalizedDraft.completed ? "bg-ice/15 text-ice shadow-ice" : "text-periwinkle/75"}`}
            >
              <CheckCircle2 size={17} aria-hidden="true" />
              Done
            </button>
            <button
              type="button"
              onClick={() => setField("completed", false)}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${!normalizedDraft.completed ? "bg-lavender/15 text-lavender shadow-ice" : "text-periwinkle/75"}`}
            >
              <Timer size={17} aria-hidden="true" />
              Plan
            </button>
          </div>

          <div className="grid gap-2">
            <p className="text-sm font-semibold text-periwinkle/85">Workout picks</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {quickWorkoutOptions.map((option) => (
                <ChoiceButton key={option.id} label={option.label} selected={selectedPlans.includes(option.id)} onClick={() => toggleQuickPlan(option)} />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <p className="text-sm font-semibold text-periwinkle/85">Cardio + classes</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[...cardioOptions, ...mindBodyOptions].map((option) => (
                <ChoiceButton
                  key={option.id}
                  label={option.label}
                  selected={activities.some((activity) => activity.optionId === option.id)}
                  onClick={() => toggleActivity(option)}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <p className="text-sm font-semibold text-periwinkle/85">Gym machines</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {strengthMachineOptions.map((option) => (
                <ChoiceButton
                  key={option.id}
                  label={option.label}
                  selected={activities.some((activity) => activity.optionId === option.id)}
                  onClick={() => toggleActivity(option)}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {activities.length ? (
              activities.map((activity) => {
                const activityCalories = calculateActivityCalories(activity, estimateWeightPounds);
                return (
                  <article key={activity.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{activity.name}</h3>
                        <p className="mt-1 text-xs text-lavender/80">{activityCalories} kcal | {activityDetail(activity)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeActivity(activity.id)}
                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-periwinkle/80"
                        aria-label={`Remove ${activity.name}`}
                      >
                        <Trash2 size={17} aria-hidden="true" />
                      </button>
                    </div>

                    {activity.type === "cardio" ? (
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <NumberStepper label="Minutes" value={activity.minutes} onChange={(value) => updateActivity(activity.id, { minutes: value })} suffix="min" />
                        {activity.optionId === "treadmill-walk" ? (
                          <>
                            <NumberStepper label="Speed" value={activity.speed ?? ""} onChange={(value) => updateActivity(activity.id, { speed: value })} step={0.1} suffix="mph" />
                            <NumberStepper label="Incline" value={activity.incline ?? ""} onChange={(value) => updateActivity(activity.id, { incline: value })} step={0.5} suffix="%" />
                          </>
                        ) : null}
                      </div>
                    ) : null}

                    {activity.type === "mind-body" ? (
                      <div className="mt-3 max-w-sm">
                        <NumberStepper label="Minutes" value={activity.minutes} onChange={(value) => updateActivity(activity.id, { minutes: value })} suffix="min" />
                      </div>
                    ) : null}

                    {activity.type === "strength" ? (
                      <div className="mt-3 grid gap-3">
                        <div className="max-w-sm">
                          <NumberStepper label="Minutes" value={activity.minutes} onChange={(value) => updateActivity(activity.id, { minutes: value })} suffix="min" />
                        </div>
                        {(activity.sets ?? []).map((set, index) => (
                          <div key={set.id} className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:grid-cols-[5rem_1fr_1fr_auto] sm:items-end">
                            <p className="text-sm font-semibold text-white sm:pb-3">Set {index + 1}</p>
                            <NumberStepper label="Reps" value={set.reps} onChange={(value) => updateSet(activity.id, set.id, { reps: value })} />
                            <NumberStepper label="Weight" value={set.weight} onChange={(value) => updateSet(activity.id, set.id, { weight: value })} step={5} suffix="lb" />
                            <button
                              type="button"
                              onClick={() => removeSet(activity.id, set.id)}
                              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-3 text-periwinkle/80"
                              aria-label={`Remove set ${index + 1}`}
                            >
                              <Trash2 size={17} aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addSet(activity.id)}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice"
                        >
                          <Plus size={18} aria-hidden="true" />
                          Add set
                        </button>
                      </div>
                    ) : null}
                  </article>
                );
              })
            ) : (
              <EmptyState title="No workout selected yet" message="Choose a workout, class, or machine." icon={Dumbbell} />
            )}
          </div>

          <TextAreaField label="Notes" value={normalizedDraft.notes} onChange={(value) => setField("notes", value)} />
        </div>
        <button type="button" onClick={save} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {editingId ? "Save changes" : normalizedDraft.completed ? "Save workout" : "Save plan"}
        </button>
      </CollapsibleSectionCard>
      {items.length ? (
        <SectionCard title="Fitness history">
          <div className="grid gap-3">
            {items.map((rawEntry) => {
              const entry = normalizeFitnessLog(rawEntry);
              const entryWeightPounds = parseWeightPounds(entry.bodyWeight || profile.weight) || 170;
              const entryCalories = Number(entry.estimatedCalories) || calculateWorkoutCalories(entry.activities ?? [], entryWeightPounds);
              const entrySummary = summarizeWorkout(entry.activities ?? [], entry.selectedPlans ?? []) || entry.completedWorkout || entry.plannedWorkout || entry.cardio || "Workout";
              return (
                <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex flex-1 items-start gap-3 text-sm text-white">
                      <input
                        type="checkbox"
                        checked={Boolean(entry.completed)}
                        onChange={() => {
                          const nextCompleted = !entry.completed;
                          update(entry.id, { completed: nextCompleted });
                          setDailyTrackers((current) =>
                            mergeDailyTracker(current, entry.date || todayKey(), {
                              workoutStatus: `${entrySummary} ${nextCompleted ? "completed" : "planned"}${nextCompleted && entryCalories ? ` | ${entryCalories} kcal` : ""}`,
                              workoutCalories: nextCompleted ? entryCalories : 0
                            })
                          );
                        }}
                        className="mt-1 size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
                      />
                      <span>
                        <span className="block font-semibold">{entrySummary}</span>
                        <span className="mt-1 block text-xs text-lavender/80">{entry.date || "No date"} | {entryCalories} kcal estimated</span>
                        <span className="mt-1 block text-periwinkle/85">
                          {(entry.activities ?? []).length
                            ? (entry.activities ?? []).map((activity) => `${activity.name}: ${activityDetail(activity)}`).join(" | ")
                            : [entry.treadmillMinutes && `${entry.treadmillMinutes} min treadmill`, entry.strengthExercise, entry.notes].filter(Boolean).join(" | ")}
                        </span>
                        {entry.notes ? <span className="mt-1 block text-periwinkle/75">{entry.notes}</span> : null}
                      </span>
                    </label>
                    <EntryActions
                      onEdit={() => {
                        const { id: _id, ...rest } = entry;
                        setDraft(rest);
                        setEditingId(entry.id);
                      }}
                      onDelete={() => remove(entry.id)}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </SectionCard>
      ) : (
        <EmptyState title="No workouts yet" message="Add your first planned or completed workout." />
      )}
    </div>
  );
}
