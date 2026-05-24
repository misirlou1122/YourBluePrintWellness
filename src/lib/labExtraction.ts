export interface ExtractedLabSuggestion {
  category: string;
  labName: string;
  value: string;
  unit: string;
  referenceRange: string;
  date: string;
  notes: string;
}

export interface ExtractedMedicationSuggestion {
  name: string;
  type: "Medication" | "Supplement";
  dose: string;
  timeOfDay: string;
  notes: string;
}

interface LabMarkerConfig {
  category: string;
  labName: string;
  patterns: RegExp[];
}

const labMarkers: LabMarkerConfig[] = [
  { category: "A1C", labName: "A1C", patterns: [/hemoglobin\s*a1c/i, /\ba1c\b/i, /\bhba1c\b/i] },
  { category: "Glucose", labName: "Glucose", patterns: [/\bglucose\b/i] },
  { category: "Cholesterol", labName: "Total cholesterol", patterns: [/total\s+cholesterol/i, /\bcholesterol,\s*total\b/i, /\bcholesterol\b/i] },
  { category: "LDL", labName: "LDL", patterns: [/\bldl\b/i, /ldl\s+cholesterol/i] },
  { category: "HDL", labName: "HDL", patterns: [/\bhdl\b/i, /hdl\s+cholesterol/i] },
  { category: "Triglycerides", labName: "Triglycerides", patterns: [/\btriglycerides\b/i] },
  { category: "Iron / Ferritin", labName: "Ferritin", patterns: [/\bferritin\b/i] },
  { category: "Iron / Ferritin", labName: "Iron", patterns: [/\biron\b/i] },
  { category: "Vitamin D", labName: "Vitamin D", patterns: [/vitamin\s*d/i, /25[-\s]?hydroxy/i] },
  { category: "Liver", labName: "ALT", patterns: [/\balt\b/i] },
  { category: "Liver", labName: "AST", patterns: [/\bast\b/i] },
  { category: "Liver", labName: "Bilirubin", patterns: [/\bbilirubin\b/i] },
  { category: "Kidney", labName: "Creatinine", patterns: [/\bcreatinine\b/i] },
  { category: "Kidney", labName: "eGFR", patterns: [/\begfr\b/i] },
  { category: "Kidney", labName: "BUN", patterns: [/\bbun\b/i, /urea\s+nitrogen/i] },
  { category: "Thyroid", labName: "TSH", patterns: [/\btsh\b/i] },
  { category: "Thyroid", labName: "Free T4", patterns: [/free\s*t4/i, /\bt4,\s*free\b/i] },
  { category: "Testosterone", labName: "Testosterone", patterns: [/\btestosterone\b/i] },
  { category: "PSA", labName: "PSA", patterns: [/\bpsa\b/i] },
  { category: "Other", labName: "Protein", patterns: [/\bprotein\b/i] },
  { category: "Other", labName: "Albumin", patterns: [/\balbumin\b/i] }
];

const unitPattern = /(%|mg\/dL|mg\/dl|mmol\/L|mmol\/l|ng\/mL|ng\/ml|pg\/mL|pg\/ml|mcg\/dL|mcg\/dl|ug\/dL|ug\/dl|mIU\/L|miu\/l|uIU\/mL|uiu\/ml|IU\/L|iu\/l|U\/L|u\/l|g\/dL|g\/dl|mL\/min\/1\.73m2|ml\/min\/1\.73m2)/i;
const medicationDosePattern = /\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|mL|units?|iu|IU|tablet|tablets|capsule|capsules|cap|caps|spray|sprays|drop|drops|patch|puff|puffs)\b/i;
const supplementKeywords = /\b(vitamin|supplement|magnesium|zinc|omega|fish oil|probiotic|fiber|collagen|biotin|iron|ferritin|calcium|folate|b12|d3|coq10|turmeric|melatonin)\b/i;

export function extractLabSuggestions(text: string): ExtractedLabSuggestion[] {
  const resultDate = findResultDate(text);
  const candidates = splitIntoCandidateLines(text);
  const suggestions = new Map<string, ExtractedLabSuggestion>();

  for (const line of candidates) {
    for (const marker of labMarkers) {
      if (!marker.patterns.some((pattern) => pattern.test(line))) continue;

      const parsed = parseLabLine(line, marker);
      if (!parsed) continue;

      const key = `${parsed.category}-${parsed.labName}`;
      if (!suggestions.has(key)) {
        suggestions.set(key, { ...parsed, date: resultDate });
      }
    }
  }

  return [...suggestions.values()];
}

export function extractMedicationSuggestions(text: string): ExtractedMedicationSuggestion[] {
  const candidates = splitMedicationCandidateLines(text);
  const suggestions = new Map<string, ExtractedMedicationSuggestion>();

  for (const line of candidates) {
    const parsed = parseMedicationLine(line);
    if (!parsed) continue;

    const key = `${parsed.name.toLowerCase()}-${parsed.dose.toLowerCase()}`;
    if (!suggestions.has(key)) {
      suggestions.set(key, parsed);
    }
  }

  return [...suggestions.values()].slice(0, 30);
}

function splitIntoCandidateLines(text: string) {
  const naturalLines = text
    .split(/\n| {3,}/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (naturalLines.length > 8) {
    return naturalLines;
  }

  return text
    .replace(/\s+/g, " ")
    .split(/(?=\b(?:hemoglobin\s*a1c|a1c|glucose|cholesterol|ldl|hdl|triglycerides|ferritin|vitamin\s*d|alt|ast|bilirubin|creatinine|egfr|bun|tsh|testosterone|psa|protein|albumin)\b)/i)
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitMedicationCandidateLines(text: string) {
  const naturalLines = text
    .split(/\n| {3,}|•|\u2022/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 5 && line.length <= 180);

  const lines = naturalLines.length > 4
    ? naturalLines
    : text
        .replace(/\s+/g, " ")
        .split(/(?=\b[A-Z][a-zA-Z-]{2,}\s+\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|mL|units?|iu|IU|tablet|capsule))/)
        .map((line) => line.trim())
        .filter((line) => line.length >= 5 && line.length <= 180);

  return lines.filter((line) => medicationDosePattern.test(line));
}

function parseMedicationLine(line: string): ExtractedMedicationSuggestion | null {
  const doseMatch = line.match(medicationDosePattern);
  if (!doseMatch || doseMatch.index === undefined) return null;

  const beforeDose = line.slice(0, doseMatch.index).replace(/^(medication|supplement|current medications?|active medications?)\s*[:\-]?\s*/i, "").trim();
  const name = beforeDose
    .replace(/^[^a-zA-Z]+/, "")
    .replace(/\s+(tablet|capsule|oral|by mouth)$/i, "")
    .trim();

  if (!name || name.length < 2 || /\b(date|provider|patient|instructions|directions|allergies)\b/i.test(name)) {
    return null;
  }

  const afterDose = line.slice(doseMatch.index + doseMatch[0].length).trim();
  const timeOfDay = inferMedicationTime(afterDose);

  return {
    name: titleCaseMedicationName(name),
    type: supplementKeywords.test(line) ? "Supplement" : "Medication",
    dose: doseMatch[0],
    timeOfDay,
    notes: `Imported from PDF. Please verify against the original document.${afterDose ? ` ${afterDose.slice(0, 90)}` : ""}`
  };
}

function inferMedicationTime(value: string) {
  if (/morning|breakfast|am\b/i.test(value)) return "Morning";
  if (/night|bedtime|evening|pm\b/i.test(value)) return "Evening";
  if (/twice daily|2 times|bid\b/i.test(value)) return "Twice daily";
  if (/daily|once daily|qd\b/i.test(value)) return "Daily";
  if (/weekly/i.test(value)) return "Weekly";
  return "";
}

function titleCaseMedicationName(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseLabLine(line: string, marker: LabMarkerConfig): ExtractedLabSuggestion | null {
  const markerMatch = marker.patterns.map((pattern) => line.match(pattern)).find(Boolean);
  const markerIndex = markerMatch?.index ?? 0;
  const afterMarker = line.slice(markerIndex + (markerMatch?.[0].length ?? 0));
  const valueMatch = afterMarker.match(/(?:result|value)?\s*[:\-]?\s*([<>]?\d+(?:\.\d+)?)/i);

  if (!valueMatch) return null;

  const value = valueMatch[1];
  const afterValue = afterMarker.slice((valueMatch.index ?? 0) + valueMatch[0].length);
  const unitMatch = afterValue.match(unitPattern);
  const unit = unitMatch?.[0] ?? "";
  const afterUnit = unitMatch ? afterValue.slice((unitMatch.index ?? 0) + unitMatch[0].length) : afterValue;
  const referenceRange = cleanReferenceRange(afterUnit);

  return {
    category: marker.category,
    labName: marker.labName,
    value,
    unit,
    referenceRange,
    date: "",
    notes: "Extracted from PDF. Please verify against the original report."
  };
}

function cleanReferenceRange(value: string) {
  const referenceMatch = value.match(/(?:reference|ref\.?\s*range|range|normal)?\s*[:\-]?\s*([<>]?\d+(?:\.\d+)?\s*(?:-|to|–)\s*[<>]?\d+(?:\.\d+)?|[<>]=?\s*\d+(?:\.\d+)?)/i);
  return referenceMatch?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

function findResultDate(text: string) {
  const match = text.match(/(?:collection date|collected|result date|reported|date of service)\s*[:\-]?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i);
  if (!match) return "";

  const [month, day, year] = match[1].split(/[/-]/);
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear.padStart(4, "20")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
