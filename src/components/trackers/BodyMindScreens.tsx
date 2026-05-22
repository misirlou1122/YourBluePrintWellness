import { useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { medications, moodEntries, periodEntry, vitals, type MoodEntry } from "../../data/sampleData";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { Checklist } from "../Checklist";
import { FormField, SelectField, TextAreaField } from "../FormField";
import { SectionCard } from "../SectionCard";

export function MedicationsScreen() {
  const [takenToday, setTakenToday] = useState(false);

  return (
    <div className="grid gap-4">
      <SectionCard className="border-champagne/20 bg-champagne/10">
        <div className="flex items-start gap-3 text-champagne">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-6 text-white">
            Check with your doctor or pharmacist for medication, supplement, and alcohol interactions.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Current medications and supplements" description="Sample cards only. No medical advice.">
        <div className="grid gap-3">
          {medications.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                <span className="rounded-full border border-ice/20 bg-ice/10 px-2.5 py-1 text-xs font-semibold text-ice">
                  {item.kind}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">
                {item.dose} | {item.time} | {item.takenToday ? "Taken today" : "Not marked today"}
              </p>
              <p className="mt-2 text-xs text-lavender/80">{item.refill}</p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/80">{item.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Add medication or supplement" description="Manual form placeholder for local first version.">
        <div className="grid gap-3">
          <FormField label="Medication/supplement name" />
          <FormField label="Dose" />
          <FormField label="Time" />
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-midnight/45 px-3 text-sm text-white">
            <input
              type="checkbox"
              checked={takenToday}
              onChange={(event) => setTakenToday(event.target.checked)}
              className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
            />
            Taken today
          </label>
          <TextAreaField label="Side effects notes" />
          <FormField label="Refill reminder placeholder" />
        </div>
      </SectionCard>
    </div>
  );
}

export function VitalsScreen() {
  return (
    <div className="grid gap-4">
      <SectionCard title="Vitals snapshot" description="Sample values only. No interpretation.">
        <div className="grid gap-3 sm:grid-cols-2">
          {vitals.map((entry) => (
            <article key={entry.label} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <p className="text-xs text-periwinkle/70">{entry.label}</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{entry.value}</h3>
              <p className="mt-1 text-xs text-lavender/75">{entry.date}</p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/80">{entry.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Add vitals placeholder" description="Blood pressure, oxygen, heart rate, weight, BMI, and temperature.">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Blood pressure" placeholder="118/76" />
          <FormField label="Oxygen" placeholder="98%" />
          <FormField label="Heart rate" placeholder="72 bpm" />
          <FormField label="Weight" />
          <FormField label="BMI placeholder" />
          <FormField label="Temperature" />
        </div>
      </SectionCard>
    </div>
  );
}

export function PeriodScreen() {
  return (
    <div className="grid gap-4">
      <SectionCard title="Cycle sample" description="Gentle cycle tracking placeholders.">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
            <p className="text-xs text-periwinkle/70">Start date</p>
            <p className="mt-1 text-lg font-semibold text-white">{periodEntry.startDate}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
            <p className="text-xs text-periwinkle/70">End date</p>
            <p className="mt-1 text-lg font-semibold text-white">{periodEntry.endDate}</p>
          </div>
        </div>
        <div className="mt-3 rounded-2xl border border-lavender/20 bg-lavender/10 p-4 text-sm leading-6 text-white">
          Flow: {periodEntry.flow} | Mood: {periodEntry.mood} | Energy: {periodEntry.energy}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {periodEntry.symptoms.map((symptom) => (
            <span key={symptom} className="rounded-full border border-ice/20 bg-ice/10 px-3 py-1 text-xs font-semibold text-ice">
              {symptom}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Add cycle entry" description="Start date, end date, symptoms, mood, energy, and notes.">
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Start date" type="date" />
            <FormField label="End date" type="date" />
          </div>
          <SelectField label="Flow level" options={["Light", "Medium", "Heavy", "Spotting", "Not sure"]} />
          <Checklist items={["Cramps", "Nausea", "Bloating", "Headache", "Cravings"]} checkedFirst={false} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Mood" />
            <FormField label="Energy" />
          </div>
          <TextAreaField label="Notes" />
        </div>
      </SectionCard>
    </div>
  );
}

const moodOptions = ["Calm", "Anxious", "Overwhelmed", "Tired", "Sad", "Hopeful", "Irritable", "Foggy", "Energetic", "Nauseous"];

export function MoodScreen() {
  const [entries, setEntries] = useLocalStorage<MoodEntry[]>("ybw.mood", moodEntries);
  const [mood, setMood] = useState(moodOptions[0]);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");
  const [dateTime, setDateTime] = useState("");

  const addMood = () => {
    setEntries([
      {
        mood,
        intensity,
        dateTime: dateTime || new Date().toLocaleString(),
        note
      },
      ...entries
    ]);
    setNote("");
    setDateTime("");
    setIntensity(3);
  };

  return (
    <div className="grid gap-4">
      <SectionCard title="Quick mood tap" description="Gentle, supportive check-ins.">
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMood(option)}
              className={`min-h-10 rounded-full border px-3 text-xs font-semibold ${
                mood === option
                  ? "border-ice/70 bg-ice/15 text-ice shadow-ice"
                  : "border-white/10 bg-white/[0.05] text-periwinkle/80"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Mood entry" description="Intensity, short note, and date/time.">
        <div className="grid gap-3">
          <label className="grid gap-2 text-sm text-periwinkle/85">
            <span>Intensity: {intensity}</span>
            <input
              type="range"
              min="1"
              max="5"
              value={intensity}
              onChange={(event) => setIntensity(Number(event.target.value))}
              className="accent-lavender"
            />
          </label>
          <TextAreaField label="Short note" value={note} onChange={setNote} />
          <FormField label="Date/time" type="datetime-local" value={dateTime} onChange={setDateTime} />
        </div>
        <button
          type="button"
          onClick={addMood}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Save mood check-in
        </button>
      </SectionCard>

      <SectionCard title="Mood check-ins" description="Sample and locally added entries.">
        <div className="grid gap-3">
          {entries.map((entry, index) => (
            <article key={`${entry.dateTime}-${index}`} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{entry.mood}</h3>
                <span className="rounded-full border border-lavender/20 bg-lavender/10 px-2.5 py-1 text-xs font-semibold text-lavender">
                  {entry.intensity}/5
                </span>
              </div>
              <p className="mt-1 text-xs text-periwinkle/70">{entry.dateTime}</p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">{entry.note}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
