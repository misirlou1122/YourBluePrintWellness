import { useState } from "react";
import { Plus, Printer, UploadCloud } from "lucide-react";
import { EntryActions } from "./EntryActions";
import { EmptyState } from "./EmptyState";
import { FormField, SelectField, TextAreaField } from "./FormField";
import { SectionCard } from "./SectionCard";
import { useLocalCollection, useLocalStorage } from "../lib/useLocalStorage";
import type { TrendDirection } from "../types/wellness";

interface LabEntry {
  id: string;
  category: string;
  labName: string;
  value: string;
  unit: string;
  referenceRange: string;
  date: string;
  notes: string;
}

const labCategories = [
  "A1C",
  "Testosterone",
  "PSA",
  "Cholesterol",
  "Glucose",
  "LDL",
  "HDL",
  "Triglycerides",
  "Iron / Ferritin",
  "Vitamin D",
  "Liver",
  "Kidney",
  "Thyroid",
  "Other"
];

const emptyDraft: Omit<LabEntry, "id"> = {
  category: "A1C",
  labName: "",
  value: "",
  unit: "",
  referenceRange: "",
  date: "",
  notes: ""
};

function compareTrend(latest: string, previous: string): TrendDirection {
  const latestNumber = Number.parseFloat(latest);
  const previousNumber = Number.parseFloat(previous);

  if (Number.isNaN(latestNumber) || Number.isNaN(previousNumber) || latestNumber === previousNumber) {
    return "stable";
  }

  return latestNumber > previousNumber ? "up" : "down";
}

function trendLabel(trend: TrendDirection) {
  if (trend === "up") {
    return "Up";
  }

  if (trend === "down") {
    return "Down";
  }

  return "Stable";
}

export function LabsScreen() {
  const { items, add, update, remove } = useLocalCollection<LabEntry>("ybw.labs", [], "lab");
  const [draft, setDraft] = useLocalStorage("ybw.labsDraft", emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);

  const setField = (field: keyof Omit<LabEntry, "id">, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const resetDraft = () => {
    setDraft(emptyDraft);
    setEditingId(null);
  };

  const saveEntry = () => {
    if (!draft.labName.trim() || !draft.value.trim()) {
      return;
    }

    const entry = {
      ...draft,
      labName: draft.labName.trim(),
      value: draft.value.trim(),
      date: draft.date || new Date().toISOString().slice(0, 10)
    };

    if (editingId) {
      update(editingId, entry);
    } else {
      add(entry);
    }

    resetDraft();
  };

  const startEdit = (entry: LabEntry) => {
    const { id: _id, ...rest } = entry;
    setDraft(rest);
    setEditingId(entry.id);
  };

  const grouped = labCategories
    .map((category) => ({
      category,
      entries: items
        .filter((entry) => entry.category === category)
        .sort((a, b) => b.date.localeCompare(a.date))
    }))
    .filter((group) => group.entries.length > 0);

  return (
    <div className="grid gap-4">
      <EmptyState
        title="Upload lab PDF"
        message="Manual lab tracking works now. Secure PDF upload and extraction can be connected next."
        icon={UploadCloud}
      />

      <SectionCard
        title="Lab reference ranges"
        description="Use the reference range printed on your lab report when entering results. Ranges can vary by lab, test method, age, sex, and health history."
        className="border-ice/15 bg-ice/[0.07]"
      >
        <p className="rounded-2xl border border-champagne/20 bg-champagne/10 p-3 text-sm leading-6 text-white">
          This app can help you compare your own results over time, but your doctor should review what the numbers mean for you.
        </p>
      </SectionCard>

      <SectionCard
        eyebrow={editingId ? "Edit lab result" : "Add lab result"}
        title={editingId ? "Update lab entry" : "Manual lab entry"}
        description="Saved lab results stay in this browser."
      >
        <div className="grid gap-3">
          <SelectField label="Category" options={labCategories} value={draft.category} onChange={(value) => setField("category", value)} />
          <FormField label="Lab name" value={draft.labName} onChange={(value) => setField("labName", value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Value" value={draft.value} onChange={(value) => setField("value", value)} />
            <FormField label="Unit" value={draft.unit} onChange={(value) => setField("unit", value)} />
          </div>
          <FormField label="Reference/goal range" value={draft.referenceRange} onChange={(value) => setField("referenceRange", value)} />
          <FormField label="Date" type="date" value={draft.date} onChange={(value) => setField("date", value)} />
          <TextAreaField label="Notes" value={draft.notes} onChange={(value) => setField("notes", value)} />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={saveEntry}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
          >
            <Plus size={18} aria-hidden="true" />
            {editingId ? "Save changes" : "Add lab result"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </SectionCard>

      {grouped.length ? (
        grouped.map((group) => {
          const [latest, previous] = group.entries;
          const trend = previous ? compareTrend(latest.value, previous.value) : "stable";

          return (
            <SectionCard key={group.category} title={group.category} description={`${group.entries.length} saved result${group.entries.length === 1 ? "" : "s"}`}>
              {latest ? (
                <div className="mb-3 rounded-2xl border border-ice/20 bg-ice/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-ice/80">Latest result</p>
                      <h3 className="mt-1 text-lg font-semibold text-white">
                        {latest.value} {latest.unit}
                      </h3>
                    </div>
                    <span className="rounded-full border border-lavender/20 bg-lavender/10 px-3 py-1 text-xs font-semibold text-lavender">
                      {previous ? trendLabel(trend) : "First result"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-periwinkle/85">
                    {latest.labName} | {latest.date}
                    {previous ? ` | Previous: ${previous.value} ${previous.unit}` : ""}
                  </p>
                </div>
              ) : null}

              <div className="grid gap-3">
                {group.entries.map((entry) => (
                  <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{entry.labName}</h3>
                        <p className="mt-1 text-lg font-semibold text-ice">
                          {entry.value} {entry.unit}
                        </p>
                        <p className="mt-1 text-xs text-periwinkle/75">{entry.date}</p>
                      </div>
                      <EntryActions onEdit={() => startEdit(entry)} onDelete={() => remove(entry.id)} />
                    </div>
                    {entry.referenceRange ? <p className="mt-3 text-sm text-periwinkle/85">Range: {entry.referenceRange}</p> : null}
                    {entry.notes ? <p className="mt-2 text-sm leading-6 text-periwinkle/85">{entry.notes}</p> : null}
                  </article>
                ))}
              </div>
            </SectionCard>
          );
        })
      ) : (
        <EmptyState title="No lab results yet" message="Add your first lab result to start tracking trends." />
      )}

      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
      >
        <Printer size={18} aria-hidden="true" />
        Print Lab Summary
      </button>
    </div>
  );
}
