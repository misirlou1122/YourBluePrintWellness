import { useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import {
  alcoholEntries,
  completedWorkouts,
  fitnessPlan,
  foodHydration,
  type AlcoholEntry,
  type FitnessEntry
} from "../../data/sampleData";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { Checklist } from "../Checklist";
import { FormField, SelectField, TextAreaField } from "../FormField";
import { ProgressBar } from "../ProgressBar";
import { SectionCard } from "../SectionCard";

export function FoodHydrationScreen() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <ProgressBar label="Water" value={foodHydration.waterPercent} detail="56 oz of 80 oz sample target" tone="aqua" />
        <ProgressBar label="Protein" value={foodHydration.proteinPercent} detail="68 g of 110 g sample target" tone="lavender" />
        <ProgressBar label="Fiber" value={foodHydration.fiberPercent} detail="12 g of 25 g sample target" tone="blue" />
      </div>

      <SectionCard title="Meals and snacks" description="Simple notes for meals, snacks, caffeine, nausea, and cravings.">
        <div className="grid gap-3">
          {[...foodHydration.meals, ...foodHydration.snacks].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-midnight/45 p-3 text-sm text-white">
              {item}
            </div>
          ))}
          <div className="rounded-2xl border border-ice/15 bg-ice/10 p-3 text-sm text-ice">{foodHydration.caffeine}</div>
          <div className="rounded-2xl border border-lavender/20 bg-lavender/10 p-3 text-sm text-lavender">
            {foodHydration.nauseaCravings}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Food log placeholder" description="This form is local UI only for now.">
        <div className="grid gap-3">
          <TextAreaField label="Meal notes" />
          <TextAreaField label="Snack notes" />
          <FormField label="Caffeine tracker" />
          <TextAreaField label="Nausea/cravings notes" />
        </div>
      </SectionCard>
    </div>
  );
}

export function AlcoholScreen() {
  const [entries, setEntries] = useLocalStorage<AlcoholEntry[]>("ybw.alcohol", alcoholEntries);
  const [drinkType, setDrinkType] = useState("");
  const [drinks, setDrinks] = useState("1");
  const [date, setDate] = useState("");
  const [moodBefore, setMoodBefore] = useState("");
  const [moodAfter, setMoodAfter] = useState("");
  const [notes, setNotes] = useState("");

  const addDrink = () => {
    if (!drinkType.trim()) {
      return;
    }

    setEntries([
      {
        id: `alc-${Date.now()}`,
        drinkType: drinkType.trim(),
        drinks,
        date: date || "No date yet",
        moodBefore,
        moodAfter,
        notes
      },
      ...entries
    ]);
    setDrinkType("");
    setDrinks("1");
    setDate("");
    setMoodBefore("");
    setMoodAfter("");
    setNotes("");
  };

  return (
    <div className="grid gap-4">
      <SectionCard className="border-champagne/20 bg-champagne/10">
        <div className="flex items-start gap-3 text-champagne">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-6 text-white">
            Check with your doctor or pharmacist for medication interactions. This tracker does not provide medical advice.
          </p>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Add drink" title="Drink log" description="Personal tracking without judgment. Stored locally in this browser.">
        <div className="grid gap-3">
          <FormField label="Drink type" value={drinkType} onChange={setDrinkType} placeholder="Margarita, wine, beer..." />
          <FormField label="Number of drinks" type="number" value={drinks} onChange={setDrinks} />
          <FormField label="Date" type="date" value={date} onChange={setDate} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Mood before" value={moodBefore} onChange={setMoodBefore} />
            <FormField label="Mood after" value={moodAfter} onChange={setMoodAfter} />
          </div>
          <TextAreaField label="Notes" value={notes} onChange={setNotes} />
        </div>
        <button
          type="button"
          onClick={addDrink}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Add drink entry
        </button>
      </SectionCard>

      <SectionCard title="Alcohol entries" description="Sample and locally added entries.">
        <div className="grid gap-3">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{entry.drinkType}</h3>
                <span className="rounded-full border border-ice/20 bg-ice/10 px-2.5 py-1 text-xs font-semibold text-ice">
                  {entry.drinks} drink(s)
                </span>
              </div>
              <p className="mt-1 text-xs text-periwinkle/70">{entry.date}</p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">{entry.notes}</p>
              <p className="mt-2 text-xs text-lavender/80">
                Mood before: {entry.moodBefore || "Placeholder"} | Mood after: {entry.moodAfter || "Placeholder"}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function FitnessScreen() {
  const [workouts, setWorkouts] = useLocalStorage<FitnessEntry[]>("ybw.fitness", completedWorkouts);
  const [treadmillMinutes, setTreadmillMinutes] = useState("");
  const [treadmillMiles, setTreadmillMiles] = useState("");
  const [treadmillIncline, setTreadmillIncline] = useState("");
  const [treadmillSpeed, setTreadmillSpeed] = useState("");
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  const addTreadmill = () => {
    setWorkouts([
      {
        id: `fit-${Date.now()}`,
        type: "Treadmill",
        detail: `${treadmillMinutes || "0"} minutes, ${treadmillMiles || "0"} miles, ${treadmillIncline || "0"} incline, ${treadmillSpeed || "0"} speed`,
        duration: `${treadmillMinutes || "0"} min`,
        intensity: "Custom",
        notes
      },
      ...workouts
    ]);
    setTreadmillMinutes("");
    setTreadmillMiles("");
    setTreadmillIncline("");
    setTreadmillSpeed("");
    setNotes("");
  };

  const addStrength = () => {
    if (!exercise.trim()) {
      return;
    }

    setWorkouts([
      {
        id: `fit-${Date.now()}`,
        type: "Strength",
        detail: `${exercise}, ${sets || "0"} sets, ${reps || "0"} reps, ${weight || "bodyweight"} resistance`,
        duration: "Custom",
        intensity: "Custom",
        notes
      },
      ...workouts
    ]);
    setExercise("");
    setSets("");
    setReps("");
    setWeight("");
    setNotes("");
  };

  return (
    <div className="grid gap-4">
      <SectionCard title="What I Want To Do" description="Choose supportive movement ideas for today.">
        <Checklist items={fitnessPlan} checkedFirst={false} />
      </SectionCard>

      <SectionCard title="Cardio options" description="Pick the style of movement that fits the day.">
        <div className="grid grid-cols-2 gap-2">
          {["Treadmill", "Walk", "Bike", "Elliptical", "Dance", "Recovery walk"].map((option) => (
            <button key={option} type="button" className="min-h-11 rounded-2xl border border-white/10 bg-midnight/45 px-3 text-sm text-white">
              {option}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Treadmill entry" description="Minutes, miles, incline, and speed.">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Minutes" type="number" value={treadmillMinutes} onChange={setTreadmillMinutes} />
          <FormField label="Miles" type="number" value={treadmillMiles} onChange={setTreadmillMiles} />
          <FormField label="Incline" type="number" value={treadmillIncline} onChange={setTreadmillIncline} />
          <FormField label="Speed" type="number" value={treadmillSpeed} onChange={setTreadmillSpeed} />
        </div>
        <TextAreaField label="Notes" value={notes} onChange={setNotes} className="mt-3" />
        <button
          type="button"
          onClick={addTreadmill}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          Add treadmill workout
        </button>
      </SectionCard>

      <SectionCard title="Strength entry" description="Exercise name, sets, reps, weight/resistance, and notes.">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Exercise name" value={exercise} onChange={setExercise} />
          <FormField label="Sets" type="number" value={sets} onChange={setSets} />
          <FormField label="Reps" type="number" value={reps} onChange={setReps} />
          <FormField label="Weight/resistance" value={weight} onChange={setWeight} />
        </div>
        <TextAreaField label="Notes" value={notes} onChange={setNotes} className="mt-3" />
        <button
          type="button"
          onClick={addStrength}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
        >
          Add strength workout
        </button>
      </SectionCard>

      <SectionCard title="What I Did Today" description="Completed workout list stored locally.">
        <div className="grid gap-3">
          {workouts.map((workout) => (
            <article key={workout.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <h3 className="text-sm font-semibold text-white">{workout.type}</h3>
              <p className="mt-1 text-sm leading-6 text-periwinkle/85">{workout.detail}</p>
              <p className="mt-2 text-xs text-lavender/80">
                Duration: {workout.duration} | Intensity: {workout.intensity}
              </p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/80">{workout.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
