import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Printer, UploadCloud } from "lucide-react";
import { EntryActions } from "./EntryActions";
import { EmptyState } from "./EmptyState";
import { FormField, SelectField, TextAreaField } from "./FormField";
import { SectionCard } from "./SectionCard";
import type { ExtractedLabSuggestion } from "../lib/labExtraction";
import { analyzeUploadedDocument, asLabSuggestions } from "../lib/documentAnalysis";
import { uploadMedicalDocument, validatePdfUpload, type MedicalDocumentRecord } from "../lib/medicalDocuments";
import { printFocusedReport } from "../lib/printReports";
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
  "CBC",
  "Metabolic",
  "Iron / Ferritin",
  "Vitamin D",
  "Liver",
  "Kidney",
  "Thyroid",
  "Urinalysis",
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<MedicalDocumentRecord | null>(null);
  const [suggestions, setSuggestions] = useState<ExtractedLabSuggestion[]>([]);
  const [selectedSuggestionKeys, setSelectedSuggestionKeys] = useState<string[]>([]);
  const [manualEntryOpen, setManualEntryOpen] = useLocalStorage("ybw.labsManualEntryOpen", false);

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
    setManualEntryOpen(true);
  };

  const suggestionKey = (suggestion: ExtractedLabSuggestion, index: number) =>
    `${index}-${suggestion.category}-${suggestion.labName}-${suggestion.value}-${suggestion.unit}`;

  const saveSuggestion = (suggestion: ExtractedLabSuggestion) => {
    add({
      category: suggestion.category,
      labName: suggestion.labName,
      value: suggestion.value,
      unit: suggestion.unit,
      referenceRange: suggestion.referenceRange,
      date: suggestion.date || new Date().toISOString().slice(0, 10),
      notes: suggestion.notes
    });
  };

  const toggleSuggestion = (key: string) => {
    setSelectedSuggestionKeys((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  const selectAllSuggestions = () => {
    setSelectedSuggestionKeys(suggestions.map((suggestion, index) => suggestionKey(suggestion, index)));
  };

  const clearSelectedSuggestions = () => {
    setSelectedSuggestionKeys([]);
  };

  const saveSelectedSuggestions = () => {
    const selected = suggestions.filter((suggestion, index) => selectedSuggestionKeys.includes(suggestionKey(suggestion, index)));
    selected.forEach(saveSuggestion);
    setSuggestions([]);
    setSelectedSuggestionKeys([]);
  };

  const analyzeUploadedPdf = async () => {
    if (!uploadedDocument?.file_path) {
      setUploadStatus("Upload the PDF first, then analyze it.");
      return;
    }

    setIsWorking(true);
    setUploadStatus("Analyzing with secure document reading...");

    try {
      const extracted = asLabSuggestions(await analyzeUploadedDocument(uploadedDocument.file_path, "labs"));
      setSuggestions(extracted);
      setSelectedSuggestionKeys(extracted.map((suggestion, index) => suggestionKey(suggestion, index)));
      setUploadStatus(
        extracted.length
          ? `Found ${extracted.length} possible lab result${extracted.length === 1 ? "" : "s"}. Please review before saving.`
          : "No lab values were found automatically. You can still enter them manually."
      );
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : "The PDF could not be analyzed. Please try again.");
    } finally {
      setIsWorking(false);
    }
  };

  const saveSelectedFile = async () => {
    if (!selectedFile) {
      setUploadStatus("Choose a file first.");
      return;
    }

    const validationMessage = validatePdfUpload(selectedFile);
    if (validationMessage) {
      setUploadStatus(validationMessage);
      return;
    }

    setIsWorking(true);
    setUploadStatus("Uploading PDF...");

    try {
      const uploaded = await uploadMedicalDocument(selectedFile, "Lab documents", uploadTitle || selectedFile.name);
      setUploadedDocument(uploaded);
      setUploadStatus("Upload complete. You can analyze the PDF now.");
    } catch (error) {
      setUploadStatus(error instanceof Error ? `${error.message} Please try again, or choose the PDF from Files.` : "File storage is not ready yet.");
    } finally {
      setIsWorking(false);
    }
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
      <SectionCard
        title="Lab PDF upload"
        description="Choose a lab PDF, save it privately, and review any lab values the app can read before adding them to your trends."
      >
        <div className="grid gap-3">
          <FormField label="Document title" value={uploadTitle} onChange={setUploadTitle} placeholder="April blood test" />
          <label className="grid gap-1 text-sm text-periwinkle/85">
            <span>Lab PDF</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setSelectedFile(file);
                setUploadedDocument(null);
                setSuggestions([]);
                setSelectedSuggestionKeys([]);
                setUploadStatus("");
              }}
              className="min-h-12 rounded-2xl border border-white/10 bg-midnight/55 px-4 py-3 text-sm text-white file:mr-3 file:rounded-xl file:border-0 file:bg-lavender/20 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-lavender"
            />
          </label>
          {selectedFile ? <p className="text-sm text-ice">{selectedFile.name}</p> : null}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={saveSelectedFile}
            disabled={isWorking}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice disabled:opacity-60"
          >
            <UploadCloud size={18} aria-hidden="true" />
            Save file
          </button>
          <button
            type="button"
            onClick={analyzeUploadedPdf}
            disabled={isWorking || !uploadedDocument?.file_path}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
          >
            <Plus size={18} aria-hidden="true" />
            Analyze lab values
          </button>
        </div>
        {uploadStatus ? <p className="mt-4 rounded-2xl border border-white/10 bg-midnight/45 p-3 text-sm leading-6 text-white">{uploadStatus}</p> : null}
        <p className="mt-3 text-xs leading-5 text-periwinkle/70">
          Automatic reading works best on typed PDFs. If a PDF is a scan or photo, save the file and enter the values manually for now.
        </p>
      </SectionCard>

      {suggestions.length ? (
        <SectionCard title="Review imported labs" description="Keep checked values only. Uncheck anything that does not match the original report.">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={selectAllSuggestions}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={clearSelectedSuggestions}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85"
            >
              Clear all
            </button>
          </div>
          <div className="grid gap-3">
            {suggestions.map((suggestion, index) => (
              <label
                key={`${suggestion.labName}-${suggestion.value}-${index}`}
                className="flex gap-3 rounded-2xl border border-lavender/20 bg-lavender/10 p-4"
              >
                <input
                  type="checkbox"
                  checked={selectedSuggestionKeys.includes(suggestionKey(suggestion, index))}
                  onChange={() => toggleSuggestion(suggestionKey(suggestion, index))}
                  className="mt-1 size-5 shrink-0 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
                />
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender/75">{suggestion.category}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{suggestion.labName}</h3>
                    <p className="mt-1 text-sm text-ice">
                      {suggestion.value} {suggestion.unit}
                      {suggestion.referenceRange ? ` | Range: ${suggestion.referenceRange}` : ""}
                    </p>
                </div>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={saveSelectedSuggestions}
            disabled={!selectedSuggestionKeys.length}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
          >
            Save {selectedSuggestionKeys.length} checked lab value{selectedSuggestionKeys.length === 1 ? "" : "s"}
          </button>
        </SectionCard>
      ) : null}

      <SectionCard
        eyebrow={editingId ? "Edit lab result" : "Add lab result"}
        title={editingId ? "Update lab entry" : "Manual lab entry"}
        description="Saved lab results stay with your wellness account when cloud sync is set up."
      >
        <button
          type="button"
          onClick={() => setManualEntryOpen((current) => !current)}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
          aria-expanded={manualEntryOpen}
        >
          {manualEntryOpen ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
          {manualEntryOpen ? "Hide manual entry" : "Show manual entry"}
        </button>

        {manualEntryOpen ? (
          <>
            <div className="mt-4 grid gap-3">
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
          </>
        ) : null}
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
        onClick={() => printFocusedReport("labs")}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
      >
        <Printer size={18} aria-hidden="true" />
        Print Lab Summary
      </button>
    </div>
  );
}
