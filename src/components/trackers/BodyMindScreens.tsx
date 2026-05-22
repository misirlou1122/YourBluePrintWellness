import { useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import {
  medications as sampleMedications,
  moodEntries,
  periodEntry,
  vitals as sampleVitals,
  type MedicationItem,
  type MoodEntry,
  type PeriodEntry,
  type VitalEntry
} from "../../data/sampleData";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { FormField, SelectField, TextAreaField } from "../FormField";
import { SectionCard } from "../SectionCard";

export function MedicationsScreen() {
  const [items, setItems] = useLocalStorage<MedicationItem[]>("ybw.medications", sampleMedications);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<MedicationItem["kind"]>("Medication");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState("");
  const [takenToday, setTakenToday] = useState(false);
  const [refill, setRefill] = useState("");
  const [notes, setNotes] = useState("");

  const toggleTaken = (id: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, takenToday: !item.takenToday } : item)));
  };

  const addItem = () => {
    if (!name.trim()) {
      return;
    }

    setItems([
      {
        id: `med-${Date.now()}`,
        name: name.trim(),
        kind,
        dose: dose || "Dose to add",
        time: time || "Time to add",
        takenToday,
        refill: refill || "Refill reminder to add",
        notes: notes || "Check with a doctor or pharmacist for interactions."
      },
      ...items
    ]);
    setName("");
    setKind("Medication");
    setDose("");
    setTime("");
    setTakenToday(false);
    setRefill("");
    setNotes("");
  };

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

      <SectionCard title="Current medications and supplements" description="Taken-today checkboxes save locally.">
        <div className="grid gap-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                <span className="rounded-full border border-ice/20 bg-ice/10 px-2.5 py-1 text-xs font-semibold text-ice">
                  {item.kind}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">
                {item.dose} | {item.time}
              </p>
              <label className="mt-3 flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
                <input
                  type="checkbox"
                  checked={item.takenToday}
                  onChange={() => toggleTaken(item.id)}
                  className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
                />
                Taken today
              </label>
              <p className="mt-2 text-xs text-lavender/80">{item.refill}</p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/80">{item.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Add medication or supplement" description="New entries save locally in this browser.">
        <div className="grid gap-3">
          <FormField label="Medication/supplement name" value={name} onChange={setName} />
          <SelectField
            label="Type"
            options={["Medication", "Supplement"]}
            value={kind}
            onChange={(value) => setKind(value as MedicationItem["kind"])}
          />
          <FormField label="Dose" value={dose} onChange={setDose} />
          <FormField label="Time" value={time} onChange={setTime} />
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-midnight/45 px-3 text-sm text-white">
            <input
              type="checkbox"
              checked={takenToday}
              onChange={(event) => setTakenToday(event.target.checked)}
              className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
            />
            Taken today
          </label>
          <TextAreaField label="Side effects notes" value={notes} onChange={setNotes} />
          <FormField label="Refill reminder placeholder" value={refill} onChange={setRefill} />
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Add medication or supplement
        </button>
      </SectionCard>
    </div>
  );
}

export function VitalsScreen() {
  const [entries, setEntries] = useLocalStorage<VitalEntry[]>("ybw.vitals", sampleVitals);
  const [bloodPressure, setBloodPressure] = useState("");
  const [oxygen, setOxygen] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [temperature, setTemperature] = useState("");
  const [notes, setNotes] = useState("");

  const addVitalEntries = () => {
    const date = new Date().toISOString().slice(0, 10);
    const next = [
      ["Blood pressure", bloodPressure],
      ["Oxygen", oxygen],
      ["Heart rate", heartRate],
      ["Weight", weight],
      ["BMI", bmi],
      ["Temperature", temperature]
    ]
      .filter(([, value]) => value.trim())
      .map(([label, value]) => ({ label, value, date, notes: notes || "Local manual entry." }));

    if (!next.length) {
      return;
    }

    setEntries([...next, ...entries]);
    setBloodPressure("");
    setOxygen("");
    setHeartRate("");
    setWeight("");
    setBmi("");
    setTemperature("");
    setNotes("");
  };

  return (
    <div className="grid gap-4">
      <SectionCard title="Vitals snapshot" description="Entries save locally. No interpretation.">
        <div className="grid gap-3 sm:grid-cols-2">
          {entries.map((entry, index) => (
            <article key={`${entry.label}-${entry.date}-${index}`} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <p className="text-xs text-periwinkle/70">{entry.label}</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{entry.value}</h3>
              <p className="mt-1 text-xs text-lavender/75">{entry.date}</p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/80">{entry.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Add vitals" description="Blood pressure, oxygen, heart rate, weight, BMI, and temperature save locally.">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Blood pressure" placeholder="118/76" value={bloodPressure} onChange={setBloodPressure} />
          <FormField label="Oxygen" placeholder="98%" value={oxygen} onChange={setOxygen} />
          <FormField label="Heart rate" placeholder="72 bpm" value={heartRate} onChange={setHeartRate} />
          <FormField label="Weight" value={weight} onChange={setWeight} />
          <FormField label="BMI placeholder" value={bmi} onChange={setBmi} />
          <FormField label="Temperature" value={temperature} onChange={setTemperature} />
        </div>
        <TextAreaField label="Notes" value={notes} onChange={setNotes} className="mt-3" />
        <button
          type="button"
          onClick={addVitalEntries}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Save vitals
        </button>
      </SectionCard>
    </div>
  );
}

const symptomOptions = ["Cramps", "Nausea", "Bloating", "Headache", "Cravings"];

export function PeriodScreen() {
  const [entries, setEntries] = useLocalStorage<PeriodEntry[]>("ybw.period", [periodEntry]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flow, setFlow] = useState("Medium");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState("");
  const [energy, setEnergy] = useState("");
  const [notes, setNotes] = useState("");

  const toggleSymptom = (symptom: string) => {
    setSymptoms((current) => (current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom]));
  };

  const addPeriodEntry = () => {
    if (!startDate && !endDate && !notes.trim()) {
      return;
    }

    setEntries([
      {
        startDate: startDate || "No start date",
        endDate: endDate || "No end date",
        flow,
        symptoms,
        mood,
        energy,
        notes
      },
      ...entries
    ]);
    setStartDate("");
    setEndDate("");
    setFlow("Medium");
    setSymptoms([]);
    setMood("");
    setEnergy("");
    setNotes("");
  };

  return (
    <div className="grid gap-4">
      <SectionCard title="Cycle entries" description="Locally saved cycle notes and symptom tracking.">
        <div className="grid gap-3">
          {entries.map((entry, index) => (
            <article key={`${entry.startDate}-${index}`} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-periwinkle/70">Start date</p>
                  <p className="mt-1 text-lg font-semibold text-white">{entry.startDate}</p>
                </div>
                <div>
                  <p className="text-xs text-periwinkle/70">End date</p>
                  <p className="mt-1 text-lg font-semibold text-white">{entry.endDate}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-white">
                Flow: {entry.flow} | Mood: {entry.mood || "Not noted"} | Energy: {entry.energy || "Not noted"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.symptoms.map((symptom) => (
                  <span key={symptom} className="rounded-full border border-ice/20 bg-ice/10 px-3 py-1 text-xs font-semibold text-ice">
                    {symptom}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-periwinkle/85">{entry.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Add cycle entry" description="Start date, end date, symptoms, mood, energy, and notes save locally.">
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Start date" type="date" value={startDate} onChange={setStartDate} />
            <FormField label="End date" type="date" value={endDate} onChange={setEndDate} />
          </div>
          <SelectField label="Flow level" options={["Light", "Medium", "Heavy", "Spotting", "Not sure"]} value={flow} onChange={setFlow} />
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map((symptom) => (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={`min-h-10 rounded-full border px-3 text-xs font-semibold ${
                  symptoms.includes(symptom)
                    ? "border-ice/70 bg-ice/15 text-ice shadow-ice"
                    : "border-white/10 bg-white/[0.05] text-periwinkle/80"
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Mood" value={mood} onChange={setMood} />
            <FormField label="Energy" value={energy} onChange={setEnergy} />
          </div>
          <TextAreaField label="Notes" value={notes} onChange={setNotes} />
        </div>
        <button
          type="button"
          onClick={addPeriodEntry}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Save cycle entry
        </button>
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

      <SectionCard title="Mood entry" description="Intensity, short note, and date/time save locally.">
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
