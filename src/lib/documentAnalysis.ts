import { supabase } from "./supabase";
import type { ExtractedLabSuggestion, ExtractedMedicationSuggestion } from "./labExtraction";

type AnalyzeMode = "labs" | "medications";

interface AnalyzeResponse {
  text?: unknown;
  lines?: unknown;
  items?: unknown;
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

  const { data: body, error: invokeError } = await supabase.functions.invoke<AnalyzeResponse>("analyze-health-document", {
    body: { filePath, mode },
    headers: {
      Authorization: `Bearer ${data.session.access_token}`
    }
  });

  if (invokeError) {
    throw new Error("The PDF could not be analyzed securely. Please try again.");
  }

  const parsedItems = body?.suggestions ?? body?.items;
  if (!Array.isArray(parsedItems)) {
    return [];
  }

  return parsedItems;
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
