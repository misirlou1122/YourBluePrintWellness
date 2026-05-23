import { useEffect } from "react";
import { LineChart, Plus, Scale } from "lucide-react";
import { EntryActions } from "./EntryActions";
import { EmptyState } from "./EmptyState";
import { FormField, SelectField, TextAreaField } from "./FormField";
import { CollapsibleSectionCard } from "./CollapsibleSectionCard";
import { ReferenceRangeCard } from "./ReferenceRangeCard";
import { SectionCard } from "./SectionCard";
import { calculateBmi, parseWeightPounds } from "../lib/bodyMetrics";
import { bmiReferenceRanges, getBmiReferenceLabel } from "../lib/referenceRanges";
import { useLocalCollection, useLocalStorage } from "../lib/useLocalStorage";
import { emptyUserProfile } from "../types/userProfile";

interface WeightEntry {
  id: string;
  date: string;
  weight: string;
  unit: "lb" | "kg";
  notes: string;
  bmi: string;
}

const emptyWeight: Omit<WeightEntry, "id"> = {
  date: "",
  weight: "",
  unit: "lb",
  notes: "",
  bmi: ""
};

function sortedEntries(entries: WeightEntry[]) {
  return [...entries].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

function parseProfileWeight(weight: string) {
  const normalized = weight.trim().toLowerCase();
  if (!normalized) return null;

  const value = Number.parseFloat(normalized);
  if (Number.isNaN(value)) return null;

  return {
    weight: String(value),
    unit: normalized.includes("kg") ? "kg" : "lb"
  } as const;
}

function WeightGraph({ entries }: { entries: WeightEntry[] }) {
  const points = sortedEntries(entries)
    .map((entry) => ({ ...entry, pounds: parseWeightPounds(`${entry.weight} ${entry.unit}`) }))
    .filter((entry): entry is WeightEntry & { pounds: number } => Boolean(entry.pounds));

  if (!points.length) {
    return <EmptyState title="No weight trend yet" message="Add your first weight entry to see a graph." icon={LineChart} />;
  }

  const width = 320;
  const height = 170;
  const padding = 24;
  const min = Math.min(...points.map((point) => point.pounds));
  const max = Math.max(...points.map((point) => point.pounds));
  const range = Math.max(1, max - min);
  const pathPoints = points
    .map((point, index) => {
      const x = padding + (points.length === 1 ? 0.5 : index / (points.length - 1)) * (width - padding * 2);
      const y = height - padding - ((point.pounds - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <SectionCard title="Weight trend" description="A simple visual history based on saved entries.">
      <div className="overflow-hidden rounded-[1.5rem] border border-ice/20 bg-midnight/50 p-3 shadow-ice">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Weight trend graph" className="h-48 w-full">
          <defs>
            <linearGradient id="weightLine" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#55d7ff" />
              <stop offset="55%" stopColor="#7f8cff" />
              <stop offset="100%" stopColor="#d39cff" />
            </linearGradient>
          </defs>
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <polyline points={pathPoints} fill="none" stroke="url(#weightLine)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          {pathPoints.split(" ").map((point, index) => {
            const [x, y] = point.split(",").map(Number);
            return <circle key={`${point}-${index}`} cx={x} cy={y} r="5" fill="#d39cff" stroke="#eaf8ff" strokeWidth="2" />;
          })}
        </svg>
        <div className="grid grid-cols-2 gap-2 text-xs text-periwinkle/78">
          <span>First: {points[0].weight} {points[0].unit}</span>
          <span className="text-right">Latest: {points[points.length - 1].weight} {points[points.length - 1].unit}</span>
        </div>
      </div>
    </SectionCard>
  );
}

export function WeightScreen() {
  const { items, add, update, remove } = useLocalCollection<WeightEntry>("ybw.weightLogs", [], "weight");
  const [draft, setDraft] = useLocalStorage("ybw.weightDraft", emptyWeight);
  const [editingId, setEditingId] = useLocalStorage<string | null>("ybw.weightEditingId", null);
  const [profile, setProfile] = useLocalStorage("ybw.userProfile", emptyUserProfile);

  useEffect(() => {
    if (items.length || !profile.weight) return;

    const parsed = parseProfileWeight(profile.weight);
    if (!parsed) return;

    const bmi = calculateBmi(`${parsed.weight} ${parsed.unit}`, profile.height);
    add({
      date: new Date().toISOString().slice(0, 10),
      weight: parsed.weight,
      unit: parsed.unit,
      notes: "Added from profile setup.",
      bmi: bmi ? String(bmi) : ""
    });
  }, [add, items.length, profile.height, profile.weight]);

  const setField = (field: keyof typeof emptyWeight, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const reset = () => {
    setDraft(emptyWeight);
    setEditingId(null);
  };

  const save = () => {
    if (!draft.weight.trim()) return;

    const weightForBmi = `${draft.weight} ${draft.unit}`;
    const bmi = calculateBmi(weightForBmi, profile.height);
    const entry = {
      ...draft,
      date: draft.date || new Date().toISOString().slice(0, 10),
      bmi: bmi ? String(bmi) : ""
    };

    if (editingId) update(editingId, entry);
    else add(entry);

    setProfile((current) => ({ ...current, weight: weightForBmi }));
    reset();
  };

  const startEdit = (entry: WeightEntry) => {
    const { id: _id, ...rest } = entry;
    setDraft(rest);
    setEditingId(entry.id);
  };

  const latest = sortedEntries(items)[items.length - 1];
  const profileBmi = calculateBmi(profile.weight || (latest ? `${latest.weight} ${latest.unit}` : ""), profile.height);
  const bmiLabel = getBmiReferenceLabel(profileBmi ?? latest?.bmi ?? null);

  return (
    <div className="grid gap-4">
      {latest ? (
        <SectionCard eyebrow="Latest Weight" title={`${latest.weight} ${latest.unit}`} description={latest.date || "Latest saved entry"}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-ice/20 bg-ice/10 p-4">
              <p className="text-xs text-ice/75">Current BMI</p>
              <p className="mt-1 text-2xl font-semibold text-white">{profileBmi ?? (latest.bmi || "Add height")}</p>
              <p className="mt-2 text-xs leading-5 text-periwinkle/75">
                {bmiLabel ? `${bmiLabel}. ` : ""}BMI is a basic calculation from height and weight for personal tracking.
              </p>
            </div>
            <div className="rounded-2xl border border-lavender/20 bg-lavender/10 p-4">
              <p className="text-xs text-lavender/75">Profile height</p>
              <p className="mt-1 text-2xl font-semibold text-white">{profile.height || "Add height"}</p>
              <p className="mt-2 text-xs leading-5 text-periwinkle/75">Update height in Profile and sign-in.</p>
            </div>
          </div>
        </SectionCard>
      ) : (
        <EmptyState title="No weight entries yet" message="Add your first weight entry to start tracking." icon={Scale} />
      )}

      <ReferenceRangeCard
        title="BMI reference guide"
        description="A simple adult reference chart for comparing your calculated BMI. BMI does not describe body composition or personal health by itself."
        items={bmiReferenceRanges}
      />

      <WeightGraph entries={items} />

      <CollapsibleSectionCard storageKey="ybw.weight.formOpen" forceOpen={Boolean(editingId)} eyebrow={editingId ? "Edit weight" : "Add weight"} title={editingId ? "Update weight entry" : "Weight entry"} sectionLabel="Add entry">
        <div className="grid gap-3">
          <FormField label="Date" type="date" value={draft.date} onChange={(value) => setField("date", value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Weight" type="number" value={draft.weight} onChange={(value) => setField("weight", value)} />
            <SelectField label="Unit" value={draft.unit} options={["lb", "kg"]} onChange={(value) => setField("unit", value)} />
          </div>
          <TextAreaField label="Notes" value={draft.notes} onChange={(value) => setField("notes", value)} />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={save} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
            <Plus size={18} aria-hidden="true" />
            {editingId ? "Save changes" : "Add weight"}
          </button>
          {editingId ? <button type="button" onClick={reset} className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85">Cancel edit</button> : null}
        </div>
      </CollapsibleSectionCard>

      {items.length ? (
        <SectionCard title="Weight history">
          <div className="grid gap-3">
            {[...items].sort((a, b) => (b.date || "").localeCompare(a.date || "")).map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{entry.weight} {entry.unit}</h3>
                    <p className="mt-1 text-xs text-lavender/80">{entry.date}{entry.bmi ? ` | BMI ${entry.bmi}` : ""}</p>
                    {entry.notes ? <p className="mt-2 text-sm leading-6 text-periwinkle/85">{entry.notes}</p> : null}
                  </div>
                  <EntryActions onEdit={() => startEdit(entry)} onDelete={() => remove(entry.id)} />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
