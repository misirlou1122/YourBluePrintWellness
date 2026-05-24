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
  { category: "Cholesterol", labName: "Non-HDL cholesterol", patterns: [/non[-\s]?hdl/i] },
  { category: "Cholesterol", labName: "VLDL", patterns: [/\bvldl\b/i] },
  { category: "Cholesterol", labName: "Cholesterol / HDL ratio", patterns: [/chol(?:esterol)?\s*\/\s*hdl\s*ratio/i, /cholesterol\s+ratio/i] },
  { category: "Triglycerides", labName: "Triglycerides", patterns: [/\btriglycerides\b/i] },
  { category: "Iron / Ferritin", labName: "Ferritin", patterns: [/\bferritin\b/i] },
  { category: "Iron / Ferritin", labName: "Iron", patterns: [/\biron\b/i] },
  { category: "Iron / Ferritin", labName: "TIBC", patterns: [/\btibc\b/i, /total\s+iron\s+binding/i] },
  { category: "Iron / Ferritin", labName: "Iron saturation", patterns: [/iron\s+saturation/i, /transferrin\s+saturation/i] },
  { category: "Vitamin D", labName: "Vitamin D", patterns: [/vitamin\s*d/i, /25[-\s]?hydroxy/i] },
  { category: "Liver", labName: "ALT", patterns: [/\balt\b/i] },
  { category: "Liver", labName: "AST", patterns: [/\bast\b/i] },
  { category: "Liver", labName: "Alkaline phosphatase", patterns: [/alkaline\s+phosphatase/i, /\balk\s*phos\b/i] },
  { category: "Liver", labName: "Bilirubin", patterns: [/\bbilirubin\b/i] },
  { category: "Liver", labName: "GGT", patterns: [/\bggt\b/i, /gamma[-\s]?glutamyl/i] },
  { category: "Kidney", labName: "Creatinine", patterns: [/\bcreatinine\b/i] },
  { category: "Kidney", labName: "eGFR", patterns: [/\begfr\b/i] },
  { category: "Kidney", labName: "BUN", patterns: [/\bbun\b/i, /urea\s+nitrogen/i] },
  { category: "Kidney", labName: "BUN / Creatinine ratio", patterns: [/bun\s*\/\s*creatinine/i] },
  { category: "Thyroid", labName: "TSH", patterns: [/\btsh\b/i] },
  { category: "Thyroid", labName: "Free T4", patterns: [/free\s*t4/i, /\bt4,\s*free\b/i] },
  { category: "Thyroid", labName: "Free T3", patterns: [/free\s*t3/i, /\bt3,\s*free\b/i] },
  { category: "Testosterone", labName: "Testosterone", patterns: [/\btestosterone\b/i] },
  { category: "Testosterone", labName: "Free testosterone", patterns: [/free\s+testosterone/i] },
  { category: "PSA", labName: "PSA", patterns: [/\bpsa\b/i] },
  { category: "CBC", labName: "White blood cells", patterns: [/white\s+blood\s+cell/i, /\bwbc\b/i, /leukocytes/i] },
  { category: "CBC", labName: "Red blood cells", patterns: [/red\s+blood\s+cell/i, /\brbc\b/i, /erythrocytes/i] },
  { category: "CBC", labName: "Hemoglobin", patterns: [/\bhemoglobin\b(?!\s*a1c)/i, /\bhgb\b/i] },
  { category: "CBC", labName: "Hematocrit", patterns: [/\bhematocrit\b/i, /\bhct\b/i] },
  { category: "CBC", labName: "Platelets", patterns: [/\bplatelets?\b/i, /\bplt\b/i] },
  { category: "CBC", labName: "Absolute neutrophils", patterns: [/absolute\s+neutrophils?/i, /neutrophils?\s+absolute/i] },
  { category: "CBC", labName: "Absolute lymphocytes", patterns: [/absolute\s+lymphocytes?/i, /lymphocytes?\s+absolute/i] },
  { category: "CBC", labName: "Absolute monocytes", patterns: [/absolute\s+monocytes?/i, /monocytes?\s+absolute/i] },
  { category: "CBC", labName: "Absolute eosinophils", patterns: [/absolute\s+eosinophils?/i, /eosinophils?\s+absolute/i] },
  { category: "CBC", labName: "Absolute basophils", patterns: [/absolute\s+basophils?/i, /basophils?\s+absolute/i] },
  { category: "CBC", labName: "MCV", patterns: [/\bmcv\b/i] },
  { category: "CBC", labName: "MCH", patterns: [/\bmch\b/i] },
  { category: "CBC", labName: "MCHC", patterns: [/\bmchc\b/i] },
  { category: "CBC", labName: "RDW", patterns: [/\brdw\b/i] },
  { category: "CBC", labName: "Neutrophils", patterns: [/\bneutrophils?\b/i, /\bneut\b/i] },
  { category: "CBC", labName: "Lymphocytes", patterns: [/\blymphocytes?\b/i, /\blymphs?\b/i] },
  { category: "CBC", labName: "Monocytes", patterns: [/\bmonocytes?\b/i, /\bmonos?\b/i] },
  { category: "CBC", labName: "Eosinophils", patterns: [/\beosinophils?\b/i, /\beos\b/i] },
  { category: "CBC", labName: "Basophils", patterns: [/\bbasophils?\b/i, /\bbasos?\b/i] },
  { category: "Metabolic", labName: "Sodium", patterns: [/\bsodium\b/i, /\bna\b/i] },
  { category: "Metabolic", labName: "Potassium", patterns: [/\bpotassium\b/i, /\bk\b/i] },
  { category: "Metabolic", labName: "Chloride", patterns: [/\bchloride\b/i, /\bcl\b/i] },
  { category: "Metabolic", labName: "Carbon dioxide", patterns: [/carbon\s+dioxide/i, /\bco2\b/i, /bicarbonate/i] },
  { category: "Metabolic", labName: "Calcium", patterns: [/\bcalcium\b/i] },
  { category: "Metabolic", labName: "Protein", patterns: [/protein,\s*total/i, /total\s+protein/i] },
  { category: "Metabolic", labName: "Albumin", patterns: [/\balbumin\b/i] },
  { category: "Metabolic", labName: "Globulin", patterns: [/\bglobulin\b/i] },
  { category: "Metabolic", labName: "A/G ratio", patterns: [/a\/g\s+ratio/i, /albumin\s*\/\s*globulin/i] },
  { category: "Other", labName: "Magnesium", patterns: [/\bmagnesium\b/i] },
  { category: "Other", labName: "Phosphorus", patterns: [/\bphosphorus\b/i, /\bphosphate\b/i] },
  { category: "Other", labName: "Vitamin B12", patterns: [/vitamin\s*b12/i, /\bb12\b/i] },
  { category: "Other", labName: "Folate", patterns: [/\bfolate\b/i] },
  { category: "Other", labName: "Insulin", patterns: [/\binsulin\b/i] },
  { category: "Other", labName: "Lipoprotein(a)", patterns: [/lipoprotein\s*\(a\)/i, /\blp\s*\(a\)/i] },
  { category: "Urinalysis", labName: "Urine color", patterns: [/\bcolor\b/i] },
  { category: "Urinalysis", labName: "Urine appearance", patterns: [/\bappearance\b/i] },
  { category: "Urinalysis", labName: "Urine specific gravity", patterns: [/specific\s+gravity/i] },
  { category: "Urinalysis", labName: "Urine pH", patterns: [/\burine\s+ph\b/i, /\bph\b/i] },
  { category: "Urinalysis", labName: "Urine glucose", patterns: [/\burine\s+glucose\b/i, /\bglucose\b/i] },
  { category: "Urinalysis", labName: "Urine bilirubin", patterns: [/\bbilirubin\b/i] },
  { category: "Urinalysis", labName: "Urine ketones", patterns: [/\bketones?\b/i] },
  { category: "Urinalysis", labName: "Urine blood", patterns: [/occult\s+blood/i, /\bblood\b/i] },
  { category: "Urinalysis", labName: "Urine protein", patterns: [/\burine\s+protein\b/i, /\bprotein\b/i] },
  { category: "Urinalysis", labName: "Urine nitrite", patterns: [/\bnitrite\b/i] },
  { category: "Urinalysis", labName: "Leukocyte esterase", patterns: [/leukocyte\s+esterase/i] },
  { category: "Urinalysis", labName: "Hyaline cast", patterns: [/hyaline\s+cast/i] },
  { category: "Urinalysis", labName: "Urine culture", patterns: [/urine\s+culture/i, /culture,\s*urine/i] }
];

const labMarkerSplitPattern = /(?=\b(?:hemoglobin\s*a1c|a1c|hba1c|glucose|cholesterol|non[-\s]?hdl|ldl|hdl|vldl|triglycerides|ferritin|iron|tibc|vitamin\s*d|alt|ast|alkaline\s+phosphatase|alk\s*phos|bilirubin|ggt|creatinine|egfr|bun|tsh|free\s*t4|free\s*t3|testosterone|psa|white\s+blood\s+cell|red\s+blood\s+cell|wbc|rbc|hemoglobin|hgb|hematocrit|hct|platelet|plt|mcv|mch|mchc|rdw|neutrophils?|lymphocytes?|monocytes?|eosinophils?|basophils?|sodium|potassium|chloride|carbon\s+dioxide|co2|calcium|total\s+protein|albumin|globulin|magnesium|phosphorus|vitamin\s*b12|folate|insulin|lipoprotein|specific\s+gravity|ketones?|nitrite|leukocyte\s+esterase|hyaline\s+cast|urine\s+culture)\b)/i;
const unitPattern = /(%|mg\/dL|mg\/dl|mmol\/L|mmol\/l|ng\/mL|ng\/ml|nmol\/L|nmol\/l|pg\/mL|pg\/ml|mcg\/dL|mcg\/dl|ug\/dL|ug\/dl|mIU\/L|miu\/l|uIU\/mL|uiu\/ml|IU\/L|iu\/l|U\/L|u\/l|g\/dL|g\/dl|g\/L|g\/l|mEq\/L|meq\/l|fL|fl|pg|Thousand\/uL|thousand\/ul|Million\/uL|million\/ul|x10E3\/uL|x10e3\/ul|x10\^3\/uL|10\*3\/uL|K\/uL|k\/ul|M\/uL|m\/ul|cells\/uL|cells\/ul|mL\/min\/1\.73m2|ml\/min\/1\.73m2|\/HPF|\/hpf|\/LPF|\/lpf)/i;
const labValuePattern = /(?:result|value|current)?\s*[:=]?\s*(?:high|low|h|l|abnormal|normal|flag)?\s*[:\-]?\s*([<>]?\d+(?:\.\d+)?(?:\s*(?:-|to|–)\s*[<>]?\d+(?:\.\d+)?)?|\d+\+|negative|trace|none\s+seen|not\s+detected|detected|normal|abnormal|clear|cloudy|yellow|straw|amber|see\s+note|culture\s+indicated)/i;
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
  const windowedLines = buildLabCandidateWindows(naturalLines);

  if (naturalLines.length > 8) {
    return [...naturalLines, ...windowedLines];
  }

  const fallbackLines = text
    .replace(/\s+/g, " ")
    .split(labMarkerSplitPattern)
    .map((line) => line.trim())
    .filter(Boolean);

  return [...fallbackLines, ...windowedLines];
}

function buildLabCandidateWindows(lines: string[]) {
  return lines
    .map((line, index) => (isLabMarkerLine(line) ? lines.slice(index, index + 10).join(" ") : ""))
    .filter(Boolean);
}

function isLabMarkerLine(line: string) {
  return labMarkers.some((marker) => marker.patterns.some((pattern) => pattern.test(line)));
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
  const valueMatch = afterMarker.match(labValuePattern);

  if (!valueMatch) return null;

  const value = valueMatch[1];
  const afterValue = afterMarker.slice((valueMatch.index ?? 0) + valueMatch[0].length);
  const unitMatch = afterValue.match(unitPattern);
  const unit = unitMatch?.[0] ?? "";
  const referenceRange = cleanReferenceRangeV2(afterValue);

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

function cleanReferenceRangeV2(value: string) {
  const rangeValue = "([<>]=?\\s*(?:or\\s*=\\s*)?\\d+(?:\\.\\d+)?|\\d+(?:\\.\\d+)?\\s*(?:-|to|\\u2013)\\s*\\d+(?:\\.\\d+)?|negative|none\\s+seen|not\\s+detected|clear|yellow|straw)";
  const labeledMatch = value.match(new RegExp(`(?:reference|ref\\.?\\s*range|range|normal)\\s*:?\\s*${rangeValue}`, "i"));
  const genericMatch = value.match(new RegExp(rangeValue, "i"));
  const range = labeledMatch?.[1] ?? genericMatch?.[1] ?? "";
  return range.replace(/\s+/g, " ").replace(/or\s*=\s*/i, "OR = ").trim();
}

function findResultDate(text: string) {
  const match = text.match(/(?:collection date|collected|result date|reported|date of service)\s*[:\-]?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i);
  if (!match) return "";

  const [month, day, year] = match[1].split(/[/-]/);
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear.padStart(4, "20")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
