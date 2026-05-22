import { Download, UploadCloud } from "lucide-react";
import { labResults } from "../data/sampleData";
import { EmptyState } from "./EmptyState";
import { FormField, SelectField, TextAreaField } from "./FormField";
import { SectionCard } from "./SectionCard";
import { TrendCard } from "./TrendCard";

export function LabsScreen() {
  return (
    <div className="grid gap-4">
      <EmptyState
        title="Upload lab PDF placeholder"
        message="Drop-in PDF extraction is not connected yet. This first version keeps uploads as UI-only placeholders."
        icon={UploadCloud}
        actionLabel="Choose lab PDF later"
      />

      <div className="grid gap-3">
        {labResults.map((result) => (
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
        title="Add lab value placeholder"
        description="Use this layout later for reviewed manual entries. Values are not saved to a database yet."
      >
        <div className="grid gap-3">
          <SelectField label="Lab marker" options={["A1C", "Cholesterol", "Glucose", "LDL", "HDL", "Triglycerides", "Other"]} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Current value" />
            <FormField label="Previous value" />
          </div>
          <FormField label="Goal/reference range" />
          <FormField label="Date of result" type="date" />
          <TextAreaField label="Notes" placeholder="Add context or questions for your doctor..." />
        </div>
        <button
          type="button"
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          Save lab placeholder
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
