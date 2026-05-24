import { supabase } from "./supabase";
import type { ExtractedLabSuggestion, ExtractedMedicationSuggestion } from "./labExtraction";

type AnalyzeMode = "labs" | "medications";

interface AnalyzeResponse {
  suggestions?: unknown;
  message?: string;
}

export async function analyzeUploadedDocument(filePath: string, mode: AnalyzeMode) {
  if (!supabase) {
    throw new Error("Secure sign-in is not ready yet.");
  }

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) {
    throw new Error("Please sign in again before analyzing this PDF.");
  }

  const response = await fetch("/api/analyzeDocument", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.session.access_token}`
    },
    body: JSON.stringify({ filePath, mode })
  });

  let body: AnalyzeResponse = {};
  try {
    body = (await response.json()) as AnalyzeResponse;
  } catch {
    body = {};
  }

  if (!response.ok) {
    throw new Error(body.message || "The PDF could not be analyzed. Please try again.");
  }

  if (!Array.isArray(body.suggestions)) {
    return [];
  }

  return body.suggestions;
}

export function asLabSuggestions(value: unknown): ExtractedLabSuggestion[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      category: typeof item.category === "string" ? item.category : "Other",
      labName: typeof item.labName === "string" ? item.labName : "",
      value: typeof item.value === "string" ? item.value : "",
      unit: typeof item.unit === "string" ? item.unit : "",
      referenceRange: typeof item.referenceRange === "string" ? item.referenceRange : "",
      date: typeof item.date === "string" ? item.date : "",
      notes: typeof item.notes === "string" ? item.notes : "Extracted from PDF. Please verify against the original report."
    }))
    .filter((item) => item.labName && item.value);
}

export function asMedicationSuggestions(value: unknown): ExtractedMedicationSuggestion[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      name: typeof item.name === "string" ? item.name : "",
      type: (item.type === "Supplement" ? "Supplement" : "Medication") as "Supplement" | "Medication",
      dose: typeof item.dose === "string" ? item.dose : "",
      timeOfDay: typeof item.timeOfDay === "string" ? item.timeOfDay : "",
      notes: typeof item.notes === "string" ? item.notes : "Extracted from PDF. Please verify against the original document."
    }))
    .filter((item) => item.name);
}
