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
import { createId, useLocalCollection, useLocalStorage } from "../lib/useLocalStorage";
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

interface CommonLabField {
  id: string;
  group: string;
  category: string;
  labName: string;
  unit: string;
  placeholder?: string;
}

interface CommonLabDraftValue {
  value: string;
  unit: string;
  referenceRange: string;
  notes: string;
}

interface CommonLabDraft {
  date: string;
  labs: Record<string, CommonLabDraftValue>;
}

const commonLabFields: CommonLabField[] = [
  { id: "a1c", group: "Blood sugar + lipids", category: "A1C", labName: "A1C", unit: "%", placeholder: "5.4" },
  { id: "glucose", group: "Blood sugar + lipids", category: "Glucose", labName: "Glucose", unit: "mg/dL", placeholder: "92" },
  { id: "total-cholesterol", group: "Blood sugar + lipids", category: "Cholesterol", labName: "Total cholesterol", unit: "mg/dL", placeholder: "180" },
  { id: "ldl", group: "Blood sugar + lipids", category: "LDL", labName: "LDL", unit: "mg/dL", placeholder: "95" },
  { id: "hdl", group: "Blood sugar + lipids", category: "HDL", labName: "HDL", unit: "mg/dL", placeholder: "55" },
  { id: "triglycerides", group: "Blood sugar + lipids", category: "Triglycerides", labName: "Triglycerides", unit: "mg/dL", placeholder: "120" },
  { id: "non-hdl", group: "Blood sugar + lipids", category: "Cholesterol", labName: "Non-HDL cholesterol", unit: "mg/dL" },
  { id: "vldl", group: "Blood sugar + lipids", category: "Cholesterol", labName: "VLDL", unit: "mg/dL" },
  { id: "cholesterol-ratio", group: "Blood sugar + lipids", category: "Cholesterol", labName: "Cholesterol / HDL ratio", unit: "" },
  { id: "ferritin", group: "Iron + vitamins", category: "Iron / Ferritin", labName: "Ferritin", unit: "ng/mL" },
  { id: "iron", group: "Iron + vitamins", category: "Iron / Ferritin", labName: "Iron", unit: "mcg/dL" },
  { id: "tibc", group: "Iron + vitamins", category: "Iron / Ferritin", labName: "TIBC", unit: "mcg/dL" },
  { id: "iron-saturation", group: "Iron + vitamins", category: "Iron / Ferritin", labName: "Iron saturation", unit: "%" },
  { id: "vitamin-d", group: "Iron + vitamins", category: "Vitamin D", labName: "Vitamin D", unit: "ng/mL" },
  { id: "vitamin-b12", group: "Iron + vitamins", category: "Other", labName: "Vitamin B12", unit: "pg/mL" },
  { id: "folate", group: "Iron + vitamins", category: "Other", labName: "Folate", unit: "ng/mL" },
  { id: "tsh", group: "Hormones + thyroid", category: "Thyroid", labName: "TSH", unit: "mIU/L" },
  { id: "free-t4", group: "Hormones + thyroid", category: "Thyroid", labName: "Free T4", unit: "ng/dL" },
  { id: "free-t3", group: "Hormones + thyroid", category: "Thyroid", labName: "Free T3", unit: "pg/mL" },
  { id: "testosterone", group: "Hormones + thyroid", category: "Testosterone", labName: "Testosterone", unit: "ng/dL" },
  { id: "free-testosterone", group: "Hormones + thyroid", category: "Testosterone", labName: "Free testosterone", unit: "pg/mL" },
  { id: "psa", group: "Hormones + thyroid", category: "PSA", labName: "PSA", unit: "ng/mL" },
  { id: "alt", group: "Liver + kidney", category: "Liver", labName: "ALT", unit: "U/L" },
  { id: "ast", group: "Liver + kidney", category: "Liver", labName: "AST", unit: "U/L" },
  { id: "alk-phos", group: "Liver + kidney", category: "Liver", labName: "Alkaline phosphatase", unit: "U/L" },
  { id: "bilirubin", group: "Liver + kidney", category: "Liver", labName: "Bilirubin", unit: "mg/dL" },
  { id: "ggt", group: "Liver + kidney", category: "Liver", labName: "GGT", unit: "U/L" },
  { id: "creatinine", group: "Liver + kidney", category: "Kidney", labName: "Creatinine", unit: "mg/dL" },
  { id: "egfr", group: "Liver + kidney", category: "Kidney", labName: "eGFR", unit: "mL/min/1.73m2" },
  { id: "bun", group: "Liver + kidney", category: "Kidney", labName: "BUN", unit: "mg/dL" },
  { id: "bun-creatinine-ratio", group: "Liver + kidney", category: "Kidney", labName: "BUN / Creatinine ratio", unit: "" },
  { id: "wbc", group: "CBC", category: "CBC", labName: "White blood cells", unit: "K/uL" },
  { id: "rbc", group: "CBC", category: "CBC", labName: "Red blood cells", unit: "M/uL" },
  { id: "hemoglobin", group: "CBC", category: "CBC", labName: "Hemoglobin", unit: "g/dL" },
  { id: "hematocrit", group: "CBC", category: "CBC", labName: "Hematocrit", unit: "%" },
  { id: "platelets", group: "CBC", category: "CBC", labName: "Platelets", unit: "K/uL" },
  { id: "mcv", group: "CBC", category: "CBC", labName: "MCV", unit: "fL" },
  { id: "mch", group: "CBC", category: "CBC", labName: "MCH", unit: "pg" },
  { id: "mchc", group: "CBC", category: "CBC", labName: "MCHC", unit: "g/dL" },
  { id: "rdw", group: "CBC", category: "CBC", labName: "RDW", unit: "%" },
  { id: "sodium", group: "Metabolic", category: "Metabolic", labName: "Sodium", unit: "mEq/L" },
  { id: "potassium", group: "Metabolic", category: "Metabolic", labName: "Potassium", unit: "mEq/L" },
  { id: "chloride", group: "Metabolic", category: "Metabolic", labName: "Chloride", unit: "mEq/L" },
  { id: "co2", group: "Metabolic", category: "Metabolic", labName: "Carbon dioxide", unit: "mEq/L" },
  { id: "calcium", group: "Metabolic", category: "Metabolic", labName: "Calcium", unit: "mg/dL" },
  { id: "protein", group: "Metabolic", category: "Metabolic", labName: "Protein", unit: "g/dL" },
  { id: "albumin", group: "Metabolic", category: "Metabolic", labName: "Albumin", unit: "g/dL" },
  { id: "globulin", group: "Metabolic", category: "Metabolic", labName: "Globulin", unit: "g/dL" },
  { id: "ag-ratio", group: "Metabolic", category: "Metabolic", labName: "A/G ratio", unit: "" }
];

const commonLabGroups = Array.from(new Set(commonLabFields.map((field) => field.group)));

function createCommonLabValue(field: CommonLabField, entry?: LabEntry): CommonLabDraftValue {
  return {
    value: entry?.value ?? "",
    unit: entry?.unit ?? field.unit,
    referenceRange: entry?.referenceRange ?? "",
    notes: entry?.notes ?? ""
  };
}

function createCommonLabDraft(date = ""): CommonLabDraft {
  return {
    date,
    labs: Object.fromEntries(commonLabFields.map((field) => [field.id, createCommonLabValue(field)]))
  };
}

function findCommonLabField(entry: Pick<LabEntry, "category" | "labName">) {
  return commonLabFields.find((field) => field.category === entry.category && field.labName === entry.labName);
}

function upsertLabEntry(entries: LabEntry[], entry: Omit<LabEntry, "id">, preferredId?: string) {
  const existing = preferredId
    ? entries.find((item) => item.id === preferredId)
    : entries.find((item) => item.date === entry.date && item.category === entry.category && item.labName === entry.labName);

  if (existing) {
    return entries.map((item) => (item.id === existing.id ? { ...item, ...entry } : item));
  }

  return [{ ...entry, id: createId("lab") }, ...entries];
}

const emptyDraft: Omit<LabEntry, "id"> = {
  category: "Other",
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
  const { items, setItems, add, remove } = useLocalCollection<LabEntry>("ybw.labs", [], "lab");
  const [draft, setDraft] = useLocalStorage("ybw.labsDraft", emptyDraft);
  const [commonLabDraft, setCommonLabDraft] = useLocalStorage("ybw.labsCommonDraft", createCommonLabDraft());
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

  const manualDate = commonLabDraft.date || draft.date;

  const getCommonLabValue = (field: CommonLabField) => commonLabDraft.labs?.[field.id] ?? createCommonLabValue(field);

  const setCommonLabField = (fieldId: string, valueField: keyof CommonLabDraftValue, value: string) => {
    const field = commonLabFields.find((item) => item.id === fieldId);
    if (!field) return;

    setCommonLabDraft((current) => ({
      ...current,
      labs: {
        ...current.labs,
        [fieldId]: {
          ...(current.labs?.[fieldId] ?? createCommonLabValue(field)),
          [valueField]: value
        }
      }
    }));
  };

  const setManualDate = (value: string) => {
    setCommonLabDraft((current) => ({ ...current, date: value }));
    setDraft((current) => ({ ...current, date: value }));
  };

  const resetDraft = (date = "") => {
    setDraft({ ...emptyDraft, date });
    setEditingId(null);
  };

  const resetManualSection = () => {
    setCommonLabDraft(createCommonLabDraft());
    resetDraft();
  };

  const buildCommonLabEntries = (date: string) =>
    commonLabFields.flatMap((field) => {
      const current = getCommonLabValue(field);
      const value = current.value.trim();

      if (!value) {
        return [];
      }

      return [
        {
          category: field.category,
          labName: field.labName,
          value,
          unit: current.unit.trim(),
          referenceRange: current.referenceRange.trim(),
          date,
          notes: current.notes.trim()
        }
      ];
    });

  const saveManualSection = () => {
    const date = manualDate || new Date().toISOString().slice(0, 10);
    const commonEntries = buildCommonLabEntries(date);
    const customEntry =
      draft.labName.trim() && draft.value.trim()
        ? {
            ...draft,
            labName: draft.labName.trim(),
            value: draft.value.trim(),
            unit: draft.unit.trim(),
            referenceRange: draft.referenceRange.trim(),
            date,
            notes: draft.notes.trim()
          }
        : null;

    if (!commonEntries.length && !customEntry) {
      return;
    }

    setItems((current) => {
      let next = current;

      commonEntries.forEach((entry) => {
        next = upsertLabEntry(next, entry);
      });

      if (customEntry) {
        next = upsertLabEntry(next, customEntry, editingId ?? undefined);
      }

      return next;
    });

    resetManualSection();
  };

  const loadDateIntoManualSection = (date: string, focusedEntry?: LabEntry) => {
    const entriesForDate = items.filter((item) => item.date === date);
    const hydratedDraft = createCommonLabDraft(date);

    entriesForDate.forEach((entry) => {
      const field = findCommonLabField(entry);
      if (field) {
        hydratedDraft.labs[field.id] = createCommonLabValue(field, entry);
      }
    });

    const focusedCustomEntry = focusedEntry && !findCommonLabField(focusedEntry) ? focusedEntry : null;
    const firstCustomEntry = entriesForDate.find((item) => !findCommonLabField(item));
    const customEntry = focusedCustomEntry ?? firstCustomEntry;

    setCommonLabDraft(hydratedDraft);

    if (customEntry) {
      const { id: _id, ...rest } = customEntry;
      setDraft(rest);
      setEditingId(customEntry.id);
    } else {
      resetDraft(date);
    }

    setManualEntryOpen(true);
  };

  const startEdit = (entry: LabEntry) => {
    loadDateIntoManualSection(entry.date, entry);
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
        eyebrow={editingId ? "Edit bloodwork" : "Add bloodwork"}
        title="Bloodwork values"
        description="Enter the labs from one result date together. Filled rows are saved as individual trendable lab results."
      >
        <button
          type="button"
          onClick={() => setManualEntryOpen((current) => !current)}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
          aria-expanded={manualEntryOpen}
        >
          {manualEntryOpen ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
          {manualEntryOpen ? "Hide bloodwork values" : "Show bloodwork values"}
        </button>

        {manualEntryOpen ? (
          <>
            <div className="mt-4 grid gap-4">
              <FormField label="Lab date" type="date" value={manualDate} onChange={setManualDate} />

              {commonLabGroups.map((group) => {
                const groupFields = commonLabFields.filter((field) => field.group === group);
                const completedCount = groupFields.filter((field) => getCommonLabValue(field).value.trim()).length;

                return (
                  <div key={group} className="rounded-2xl border border-white/10 bg-midnight/35 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-white">{group}</h3>
                      <span className="rounded-full border border-lavender/20 bg-lavender/10 px-3 py-1 text-xs font-semibold text-lavender">
                        {completedCount}/{groupFields.length}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-3">
                      {groupFields.map((field) => {
                        const labValue = getCommonLabValue(field);

                        return (
                          <div key={field.id} className="grid gap-3 rounded-2xl border border-white/10 bg-midnight/45 p-3 lg:grid-cols-[minmax(8rem,1fr)_repeat(4,minmax(0,0.85fr))]">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white">{field.labName}</p>
                              <p className="mt-1 text-xs text-periwinkle/65">{field.category}</p>
                            </div>
                            <FormField
                              label="Value"
                              value={labValue.value}
                              onChange={(value) => setCommonLabField(field.id, "value", value)}
                              placeholder={field.placeholder ?? "Result"}
                            />
                            <FormField
                              label="Unit"
                              value={labValue.unit}
                              onChange={(value) => setCommonLabField(field.id, "unit", value)}
                              placeholder={field.unit || "Unit"}
                            />
                            <FormField
                              label="Reference/goal"
                              value={labValue.referenceRange}
                              onChange={(value) => setCommonLabField(field.id, "referenceRange", value)}
                              placeholder="Optional"
                            />
                            <FormField
                              label="Note"
                              value={labValue.notes}
                              onChange={(value) => setCommonLabField(field.id, "notes", value)}
                              placeholder="Optional"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="rounded-2xl border border-white/10 bg-midnight/35 p-3">
                <h3 className="text-sm font-semibold text-white">Other lab</h3>
                <div className="mt-3 grid gap-3">
                  <SelectField label="Category" options={labCategories} value={draft.category} onChange={(value) => setField("category", value)} />
                  <FormField label="Lab name" value={draft.labName} onChange={(value) => setField("labName", value)} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Value" value={draft.value} onChange={(value) => setField("value", value)} />
                    <FormField label="Unit" value={draft.unit} onChange={(value) => setField("unit", value)} />
                  </div>
                  <FormField label="Reference/goal range" value={draft.referenceRange} onChange={(value) => setField("referenceRange", value)} />
                  <TextAreaField label="Notes" value={draft.notes} onChange={(value) => setField("notes", value)} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveManualSection}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
              >
                <Plus size={18} aria-hidden="true" />
                {editingId ? "Save bloodwork changes" : "Save bloodwork values"}
              </button>
              <button
                type="button"
                onClick={resetManualSection}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85"
              >
                Clear section
              </button>
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
