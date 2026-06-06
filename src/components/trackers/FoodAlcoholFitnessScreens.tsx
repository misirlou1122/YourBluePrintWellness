import { useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { CollapsibleSectionCard } from "../CollapsibleSectionCard";
import { EntryActions } from "../EntryActions";
import { EmptyState } from "../EmptyState";
import { FormField, TextAreaField } from "../FormField";
import { ProgressBar } from "../ProgressBar";
import { SectionCard } from "../SectionCard";
import { useLocalCollection, useLocalStorage } from "../../lib/useLocalStorage";
import { mergeDailyTracker, todayKey, type DailyTrackerMap } from "../../lib/dailyTracking";

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
  completed: false
};

function percent(value: string, goal: number) {
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) {
    return 0;
  }

  return Math.min(100, Math.round((numeric / goal) * 100));
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
  const { items, add, update, remove, toggleComplete } = useLocalCollection<FitnessLog>("ybw.fitness", [], "fitness");
  const [draft, setDraft] = useLocalStorage("ybw.fitnessDraft", emptyFitness);
  const [, setDailyTrackers] = useLocalStorage<DailyTrackerMap>("ybw.dailyTrackers", {});
  const [editingId, setEditingId] = useState<string | null>(null);
  const setField = (field: keyof typeof emptyFitness, value: string | boolean) => setDraft((current) => ({ ...current, [field]: value }));
  const reset = () => { setDraft(emptyFitness); setEditingId(null); };
  const save = () => {
    if (!Object.values(draft).some((value) => String(value).trim())) return;
    const entry = { ...draft, date: draft.date || todayKey() };
    if (editingId) update(editingId, entry);
    else add(entry);
    setDailyTrackers((current) =>
      mergeDailyTracker(current, entry.date, {
        workoutStatus: entry.completed ? entry.completedWorkout || entry.plannedWorkout || "completed" : entry.plannedWorkout || "planned"
      })
    );
    reset();
  };

  return (
    <div className="grid gap-4">
      <CollapsibleSectionCard storageKey="ybw.fitness.formOpen" forceOpen={Boolean(editingId)} eyebrow={editingId ? "Edit workout" : "Add workout"} title="Fitness tracker" sectionLabel="What I Did Today">
        <div className="grid gap-3">
          <FormField label="Date" type="date" value={draft.date} onChange={(value) => setField("date", value)} />
          <FormField label="Planned workout" value={draft.plannedWorkout} onChange={(value) => setField("plannedWorkout", value)} />
          <FormField label="Completed workout" value={draft.completedWorkout} onChange={(value) => setField("completedWorkout", value)} />
          <FormField label="Cardio" value={draft.cardio} onChange={(value) => setField("cardio", value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Treadmill minutes" type="number" value={draft.treadmillMinutes} onChange={(value) => setField("treadmillMinutes", value)} />
            <FormField label="Treadmill miles" type="number" value={draft.treadmillMiles} onChange={(value) => setField("treadmillMiles", value)} />
            <FormField label="Treadmill incline" type="number" value={draft.treadmillIncline} onChange={(value) => setField("treadmillIncline", value)} />
            <FormField label="Treadmill speed" type="number" value={draft.treadmillSpeed} onChange={(value) => setField("treadmillSpeed", value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Strength exercise" value={draft.strengthExercise} onChange={(value) => setField("strengthExercise", value)} />
            <FormField label="Sets" type="number" value={draft.sets} onChange={(value) => setField("sets", value)} />
            <FormField label="Reps" type="number" value={draft.reps} onChange={(value) => setField("reps", value)} />
            <FormField label="Weight/resistance" value={draft.weight} onChange={(value) => setField("weight", value)} />
          </div>
          <TextAreaField label="Notes" value={draft.notes} onChange={(value) => setField("notes", value)} />
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-midnight/45 px-3 text-sm text-white">
            <input type="checkbox" checked={Boolean(draft.completed)} onChange={(event) => setField("completed", event.target.checked)} className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40" />
            Completed
          </label>
        </div>
        <button type="button" onClick={save} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {editingId ? "Save changes" : "Add workout"}
        </button>
      </CollapsibleSectionCard>
      {items.length ? (
        <SectionCard title="Fitness history">
          <div className="grid gap-3">
            {items.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <label className="flex flex-1 items-start gap-3 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={Boolean(entry.completed)}
                      onChange={() => {
                        const nextCompleted = !entry.completed;
                        toggleComplete(entry.id);
                        setDailyTrackers((current) =>
                          mergeDailyTracker(current, entry.date || todayKey(), {
                            workoutStatus: nextCompleted ? entry.completedWorkout || entry.plannedWorkout || "completed" : entry.plannedWorkout || "planned"
                          })
                        );
                      }}
                      className="mt-1 size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
                    />
                    <span>
                      <span className="block font-semibold">{entry.completedWorkout || entry.plannedWorkout || entry.cardio || "Workout"}</span>
                      <span className="mt-1 block text-xs text-lavender/80">{entry.date || "No date"}</span>
                      <span className="mt-1 block text-periwinkle/85">
                        {[entry.treadmillMinutes && `${entry.treadmillMinutes} min treadmill`, entry.strengthExercise, entry.notes].filter(Boolean).join(" | ")}
                      </span>
                    </span>
                  </label>
                  <EntryActions onEdit={() => { const { id: _id, ...rest } = entry; setDraft(rest); setEditingId(entry.id); }} onDelete={() => remove(entry.id)} />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      ) : (
        <EmptyState title="No workouts yet" message="Add your first planned or completed workout." />
      )}
    </div>
  );
}
