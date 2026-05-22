import { useState } from "react";
import { Download, Plus, UploadCloud } from "lucide-react";
import { labResults, type LabResult } from "../data/sampleData";
import { useLocalStorage } from "../lib/useLocalStorage";
import { EmptyState } from "./EmptyState";
import { FormField, SelectField, TextAreaField } from "./FormField";
import { SectionCard } from "./SectionCard";
import { TrendCard } from "./TrendCard";
import type { TrendDirection } from "../types/wellness";

const markerOptions = ["A1C", "Cholesterol", "Glucose", "LDL", "HDL", "Triglycerides", "Other"];
const trendOptions: TrendDirection[] = ["stable", "up", "down"];

export function LabsScreen() {
  const [entries, setEntries] = useLocalStorage<LabResult[]>("ybw.labs", labResults);
  const [marker, setMarker] = useState(markerOptions[0]);
  const [current, setCurrent] = useState("");
  const [previous, setPrevious] = useState("");
  const [referenceRange, setReferenceRange] = useState("");
  const [date, setDate] = useState("");
  const [trend, setTrend] = useState<TrendDirection>("stable");
  const [notes, setNotes] = useState("");

  const addLabEntry = () => {
    if (!marker.trim() || !current.trim()) {
      return;
    }

    setEntries([
      {
        id: `lab-${Date.now()}`,
        marker,
        current,
        previous: previous || "No previous value",
        referenceRange: referenceRange || "Provider-defined range",
        date: date || new Date().toISOString().slice(0, 10),
        trend,
        notes: notes || "Manual local entry."
      },
      ...entries
    ]);
    setMarker(markerOptions[0]);
    setCurrent("");
    setPrevious("");
    setReferenceRange("");
    setDate("");
    setTrend("stable");
    setNotes("");
  };

  return (
    <div className="grid gap-4">
      <EmptyState
        title="Upload lab PDF placeholder"
        message="Drop-in PDF extraction is not connected yet. Manual lab entries save locally in this browser."
        icon={UploadCloud}
        actionLabel="Choose lab PDF later"
      />

      <div className="grid gap-3">
        {entries.map((result) => (
          <TrendCard
            key={result.id}
            metric={{
              label: result.marker,
              current: result.current,
              previous: result.previous,
              goal: result.referenceRange,
              date: result.date,
              trend: result.trend,
              notes: result.notes
            }}
          />
        ))}
      </div>

      <SectionCard
        eyebrow="Manual entry"
        title="Add lab value"
        description="Manual lab values are saved locally in your browser only."
      >
        <div className="grid gap-3">
          <SelectField label="Lab marker" options={markerOptions} value={marker} onChange={setMarker} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Current value" value={current} onChange={setCurrent} />
            <FormField label="Previous value" value={previous} onChange={setPrevious} />
          </div>
          <FormField label="Goal/reference range" value={referenceRange} onChange={setReferenceRange} />
          <FormField label="Date of result" type="date" value={date} onChange={setDate} />
          <SelectField label="Trend" options={trendOptions} value={trend} onChange={(value) => setTrend(value as TrendDirection)} />
          <TextAreaField
            label="Notes"
            value={notes}
            onChange={setNotes}
            placeholder="Add context or questions for your doctor..."
          />
        </div>
        <button
          type="button"
          onClick={addLabEntry}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Save lab entry
        </button>
      </SectionCard>

      <button
        type="button"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
      >
        <Download size={18} aria-hidden="true" />
        Export lab summary
      </button>
    </div>
  );
}
