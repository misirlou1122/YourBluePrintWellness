import { AlertTriangle, Plus, Printer } from "lucide-react";
import { EntryActions } from "../EntryActions";
import { EmptyState } from "../EmptyState";
import { FormField, SelectField, TextAreaField } from "../FormField";
import { CollapsibleSectionCard } from "../CollapsibleSectionCard";
import { ReferenceRangeCard } from "../ReferenceRangeCard";
import { SectionCard } from "../SectionCard";
import { useLocalCollection, useLocalStorage } from "../../lib/useLocalStorage";
import { mergeDailyTracker, todayKey, type DailyTrackerMap } from "../../lib/dailyTracking";
import { getBloodPressureReferenceLabel, vitalsReferenceRanges } from "../../lib/referenceRanges";
import { printFocusedReport } from "../../lib/printReports";

interface MedicationEntry {
  id: string;
  name: string;
  type: "Medication" | "Supplement";
  dose: string;
  timeOfDay: string;
  takenToday: boolean;
  takenDates: Record<string, boolean>;
  sideEffects: string;
  refillReminderDate: string;
}

interface VitalEntry {
  id: string;
  bloodPressure: string;
  oxygen: string;
  heartRate: string;
  weight: string;
  bmi: string;
  temperature: string;
  date: string;
}

interface PeriodEntry {
  id: string;
  startDate: string;
  endDate: string;
  flow: string;
  cramps: string;
  nausea: string;
  bloating: string;
  headache: string;
  cravings: string;
  mood: string;
  energy: string;
  notes: string;
}

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  dateTime: string;
}

const emptyMedication: Omit<MedicationEntry, "id"> = {
  name: "",
  type: "Medication",
  dose: "",
  timeOfDay: "",
  takenToday: false,
  takenDates: {},
  sideEffects: "",
  refillReminderDate: ""
};

const emptyVitals: Omit<VitalEntry, "id"> = {
  bloodPressure: "",
  oxygen: "",
  heartRate: "",
  weight: "",
  bmi: "",
  temperature: "",
  date: ""
};

const emptyPeriod: Omit<PeriodEntry, "id"> = {
  startDate: "",
  endDate: "",
  flow: "Medium",
  cramps: "",
  nausea: "",
  bloating: "",
  headache: "",
  cravings: "",
  mood: "",
  energy: "",
  notes: ""
};

const moodOptions = ["Calm", "Anxious", "Overwhelmed", "Tired", "Sad", "Hopeful", "Irritable", "Foggy", "Energetic", "Nauseous"];

const emptyMood: Omit<MoodEntry, "id"> = {
  mood: moodOptions[0],
  intensity: 3,
  note: "",
  dateTime: ""
};

function useEditableCollection<T extends { id: string }, D extends Omit<T, "id">>(key: string, draftKey: string, emptyDraft: D, prefix: string) {
  const collection = useLocalCollection<T>(key, [], prefix);
  const [draft, setDraft] = useLocalStorage<D>(draftKey, emptyDraft);
  const [editingId, setEditingId] = useLocalStorage<string | null>(`${draftKey}.editingId`, null);
  const reset = () => {
    setDraft(emptyDraft);
    setEditingId(null);
  };
  const save = (isValid: (draft: D) => boolean, normalize?: (draft: D) => D) => {
    if (!isValid(draft)) return;
    const next = normalize ? normalize(draft) : draft;
    if (editingId) collection.update(editingId, next as unknown as Partial<T>);
    else collection.add(next as Omit<T, "id">);
    reset();
  };
  const startEdit = (entry: T) => {
    const { id: _id, ...rest } = entry;
    setDraft(rest as D);
    setEditingId(entry.id);
  };
  return { ...collection, draft, setDraft, editingId, setEditingId, reset, save, startEdit };
}

export function MedicationsScreen() {
  const store = useEditableCollection<MedicationEntry, Omit<MedicationEntry, "id">>("ybw.medications", "ybw.medicationDraft", emptyMedication, "med");
  const [, setDailyTrackers] = useLocalStorage<DailyTrackerMap>("ybw.dailyTrackers", {});
  const today = todayKey();
  const setField = (field: keyof typeof emptyMedication, value: string | boolean) => store.setDraft((current) => ({ ...current, [field]: value }));
  const markMedicationStatus = (items: MedicationEntry[], changedId?: string, changedValue?: boolean) => {
    const anyTaken = Boolean(!changedId && changedValue) || items.some((item) => (item.id === changedId ? changedValue : item.takenDates?.[today]) === true);
    setDailyTrackers((current) => mergeDailyTracker(current, today, { medicationStatus: anyTaken ? "taken" : "not taken" }));
  };
  const saveMedication = () => {
    if (!store.draft.name.trim()) return;
    const existing = store.items.find((item) => item.id === store.editingId);
    const nextDraft = {
      ...store.draft,
      takenDates: {
        ...(existing?.takenDates ?? store.draft.takenDates ?? {}),
        [today]: Boolean(store.draft.takenToday)
      }
    };

    store.save(() => true, () => nextDraft);
    markMedicationStatus(store.items, store.editingId ?? undefined, Boolean(store.draft.takenToday));
  };
  const toggleTakenToday = (entry: MedicationEntry) => {
    const nextTaken = !entry.takenDates?.[today];
    store.update(entry.id, {
      takenToday: nextTaken,
      takenDates: { ...(entry.takenDates ?? {}), [today]: nextTaken }
    });
    markMedicationStatus(store.items, entry.id, nextTaken);
  };

  return (
    <div className="grid gap-4">
      <SectionCard className="border-champagne/20 bg-champagne/10">
        <div className="flex items-start gap-3 text-champagne">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-6 text-white">Check with your doctor or pharmacist for medication, supplement, and alcohol interactions.</p>
        </div>
      </SectionCard>
      <CollapsibleSectionCard storageKey="ybw.medications.formOpen" forceOpen={Boolean(store.editingId)} eyebrow={store.editingId ? "Edit" : "Add"} title="Medication or supplement" sectionLabel="Current medications">
        <div className="grid gap-3">
          <FormField label="Name" value={store.draft.name} onChange={(value) => setField("name", value)} />
          <SelectField label="Type" options={["Medication", "Supplement"]} value={store.draft.type} onChange={(value) => setField("type", value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Dose" value={store.draft.dose} onChange={(value) => setField("dose", value)} />
            <FormField label="Time of day" value={store.draft.timeOfDay} onChange={(value) => setField("timeOfDay", value)} />
          </div>
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-midnight/45 px-3 text-sm text-white">
            <input type="checkbox" checked={store.draft.takenToday} onChange={(event) => setField("takenToday", event.target.checked)} className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40" />
            Taken today
          </label>
          <TextAreaField label="Side effects notes" value={store.draft.sideEffects} onChange={(value) => setField("sideEffects", value)} />
          <FormField label="Refill reminder date" type="date" value={store.draft.refillReminderDate} onChange={(value) => setField("refillReminderDate", value)} />
        </div>
        <button type="button" onClick={saveMedication} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {store.editingId ? "Save changes" : "Add item"}
        </button>
      </CollapsibleSectionCard>
      {store.items.length ? (
        <SectionCard title="Medications and supplements">
          <div className="grid gap-3">
            {store.items.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <label className="flex flex-1 items-start gap-3 text-sm text-white">
                    <input type="checkbox" checked={Boolean(entry.takenDates?.[today])} onChange={() => toggleTakenToday(entry)} className="mt-1 size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40" />
                    <span>
                      <span className="block font-semibold">{entry.name}</span>
                  <span className="mt-1 block text-periwinkle/85">{entry.type} | {entry.dose} | {entry.timeOfDay}</span>
                    </span>
                  </label>
                  <EntryActions onEdit={() => store.startEdit(entry)} onDelete={() => store.remove(entry.id)} />
                </div>
                {entry.sideEffects ? <p className="mt-3 text-sm leading-6 text-periwinkle/85">{entry.sideEffects}</p> : null}
              </article>
            ))}
          </div>
        </SectionCard>
      ) : <EmptyState title="No medications yet" message="Add your first medication or supplement." />}
      <button
        type="button"
        onClick={() => printFocusedReport("medications")}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
      >
        <Printer size={18} aria-hidden="true" />
        Print Medication List
      </button>
    </div>
  );
}

export function VitalsScreen() {
  const store = useEditableCollection<VitalEntry, Omit<VitalEntry, "id">>("ybw.vitals", "ybw.vitalsDraft", emptyVitals, "vitals");
  const setField = (field: keyof typeof emptyVitals, value: string) => store.setDraft((current) => ({ ...current, [field]: value }));
  return (
    <div className="grid gap-4">
      <ReferenceRangeCard
        title="Vitals reference guide"
        description="Quick common adult ranges for comparing saved entries without making medical decisions in the app."
        items={vitalsReferenceRanges}
      />
      <CollapsibleSectionCard storageKey="ybw.vitals.formOpen" forceOpen={Boolean(store.editingId)} title="Vitals entry" sectionLabel="Blood pressure">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Date" type="date" value={store.draft.date} onChange={(value) => setField("date", value)} />
          <FormField label="Blood pressure" value={store.draft.bloodPressure} onChange={(value) => setField("bloodPressure", value)} />
          <FormField label="Oxygen" value={store.draft.oxygen} onChange={(value) => setField("oxygen", value)} />
          <FormField label="Heart rate" value={store.draft.heartRate} onChange={(value) => setField("heartRate", value)} />
          <FormField label="Weight" value={store.draft.weight} onChange={(value) => setField("weight", value)} />
          <FormField label="BMI" value={store.draft.bmi} onChange={(value) => setField("bmi", value)} />
          <FormField label="Temperature" value={store.draft.temperature} onChange={(value) => setField("temperature", value)} />
        </div>
        <button type="button" onClick={() => store.save((draft) => Object.values(draft).some(Boolean), (draft) => ({ ...draft, date: draft.date || new Date().toISOString().slice(0, 10) }))} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {store.editingId ? "Save changes" : "Add vitals"}
        </button>
      </CollapsibleSectionCard>
      {store.items.length ? (
        <SectionCard title="Vitals history">
          <div className="grid gap-3">
            {store.items.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{entry.date}</h3>
                    <p className="mt-2 text-sm leading-6 text-periwinkle/85">{[entry.bloodPressure && `BP ${entry.bloodPressure}`, entry.oxygen && `O2 ${entry.oxygen}`, entry.heartRate && `HR ${entry.heartRate}`, entry.weight && `Weight ${entry.weight}`, entry.bmi && `BMI ${entry.bmi}`, entry.temperature && `Temp ${entry.temperature}`].filter(Boolean).join(" | ")}</p>
                    {entry.bloodPressure ? (
                      <p className="mt-2 inline-flex rounded-full border border-lavender/20 bg-lavender/10 px-3 py-1 text-xs font-semibold text-lavender">
                        BP reference: {getBloodPressureReferenceLabel(entry.bloodPressure)}
                      </p>
                    ) : null}
                  </div>
                  <EntryActions onEdit={() => store.startEdit(entry)} onDelete={() => store.remove(entry.id)} />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      ) : <EmptyState title="No vitals yet" message="Add your first vitals entry." />}
    </div>
  );
}

export function PeriodScreen() {
  const store = useEditableCollection<PeriodEntry, Omit<PeriodEntry, "id">>("ybw.period", "ybw.periodDraft", emptyPeriod, "period");
  const setField = (field: keyof typeof emptyPeriod, value: string) => store.setDraft((current) => ({ ...current, [field]: value }));
  return (
    <div className="grid gap-4">
      <CollapsibleSectionCard storageKey="ybw.period.formOpen" forceOpen={Boolean(store.editingId)} title="Period tracker entry" sectionLabel="Start date">
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Start date" type="date" value={store.draft.startDate} onChange={(value) => setField("startDate", value)} />
            <FormField label="End date" type="date" value={store.draft.endDate} onChange={(value) => setField("endDate", value)} />
          </div>
          <SelectField label="Flow" options={["Light", "Medium", "Heavy", "Spotting", "Not sure"]} value={store.draft.flow} onChange={(value) => setField("flow", value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            {(["cramps", "nausea", "bloating", "headache", "cravings", "mood", "energy"] as const).map((field) => (
              <FormField key={field} label={field[0].toUpperCase() + field.slice(1)} value={store.draft[field]} onChange={(value) => setField(field, value)} />
            ))}
          </div>
          <TextAreaField label="Notes" value={store.draft.notes} onChange={(value) => setField("notes", value)} />
        </div>
        <button type="button" onClick={() => store.save((draft) => Object.values(draft).some(Boolean))} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {store.editingId ? "Save changes" : "Add period entry"}
        </button>
      </CollapsibleSectionCard>
      {store.items.length ? (
        <SectionCard title="Period history">
          <div className="grid gap-3">
            {store.items.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{entry.startDate || "Cycle entry"} {entry.endDate ? `to ${entry.endDate}` : ""}</h3>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">{[entry.flow, entry.cramps, entry.nausea, entry.bloating, entry.headache, entry.cravings, entry.mood, entry.energy].filter(Boolean).join(" | ")}</p>
                    {entry.notes ? <p className="mt-2 text-sm leading-6 text-periwinkle/85">{entry.notes}</p> : null}
                  </div>
                  <EntryActions onEdit={() => store.startEdit(entry)} onDelete={() => store.remove(entry.id)} />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      ) : <EmptyState title="No period entries yet" message="Add your first cycle entry." />}
    </div>
  );
}

export function MoodScreen() {
  const store = useEditableCollection<MoodEntry, Omit<MoodEntry, "id">>("ybw.mood", "ybw.moodDraft", emptyMood, "mood");
  const [, setDailyTrackers] = useLocalStorage<DailyTrackerMap>("ybw.dailyTrackers", {});
  const setField = (field: keyof typeof emptyMood, value: string | number) => store.setDraft((current) => ({ ...current, [field]: value }));
  const saveMood = () => {
    if (!store.draft.mood && !store.draft.note) return;
    const dateKey = store.draft.dateTime ? store.draft.dateTime.slice(0, 10) : todayKey();
    const nextDraft = { ...store.draft, dateTime: store.draft.dateTime || new Date().toLocaleString() };
    store.save(() => true, () => nextDraft);
    setDailyTrackers((current) => mergeDailyTracker(current, dateKey, { mood: nextDraft.mood }));
  };
  return (
    <div className="grid gap-4">
      <CollapsibleSectionCard storageKey="ybw.mood.formOpen" forceOpen={Boolean(store.editingId)} title="Mood check-in" sectionLabel="Quick tap mood">
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((option) => (
            <button key={option} type="button" onClick={() => setField("mood", option)} className={`min-h-10 rounded-full border px-3 text-xs font-semibold ${store.draft.mood === option ? "border-ice/70 bg-ice/15 text-ice shadow-ice" : "border-white/10 bg-white/[0.05] text-periwinkle/80"}`}>
              {option}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3">
          <label className="grid gap-2 text-sm text-periwinkle/85">
            <span>Intensity: {store.draft.intensity}</span>
            <input type="range" min="1" max="5" value={store.draft.intensity} onChange={(event) => setField("intensity", Number(event.target.value))} className="accent-lavender" />
          </label>
          <TextAreaField label="Short note" value={store.draft.note} onChange={(value) => setField("note", value)} />
          <FormField label="Date/time" type="datetime-local" value={store.draft.dateTime} onChange={(value) => setField("dateTime", value)} />
        </div>
        <button type="button" onClick={saveMood} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {store.editingId ? "Save changes" : "Save mood check-in"}
        </button>
      </CollapsibleSectionCard>
      {store.items.length ? (
        <SectionCard title="Mood history">
          <div className="grid gap-3">
            {store.items.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                  <h3 className="text-sm font-semibold text-white">{entry.mood} | {entry.intensity}/5</h3>
                    <p className="mt-1 text-xs text-periwinkle/70">{entry.dateTime}</p>
                    {entry.note ? <p className="mt-2 text-sm leading-6 text-periwinkle/85">{entry.note}</p> : null}
                  </div>
                  <EntryActions onEdit={() => store.startEdit(entry)} onDelete={() => store.remove(entry.id)} />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      ) : <EmptyState title="No mood check-ins yet" message="Add your first mood check-in." />}
    </div>
  );
}
