import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.1";

type AnalyzeMode = "labs" | "medications";

const bucketName = "medical-documents";
const maxPollAttempts = 18;
const apiVersion = "2024-11-30";
const defaultModelId = "prebuilt-read";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const labMarkers = [
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
  { category: "Other", labName: "White blood cells", patterns: [/white\s+blood\s+cell/i, /\bwbc\b/i, /leukocytes/i] },
  { category: "Other", labName: "Red blood cells", patterns: [/red\s+blood\s+cell/i, /\brbc\b/i, /erythrocytes/i] },
  { category: "Other", labName: "Hemoglobin", patterns: [/\bhemoglobin\b/i, /\bhgb\b/i] },
  { category: "Other", labName: "Hematocrit", patterns: [/\bhematocrit\b/i, /\bhct\b/i] },
  { category: "Other", labName: "Platelets", patterns: [/\bplatelets?\b/i, /\bplt\b/i] },
  { category: "Other", labName: "MCV", patterns: [/\bmcv\b/i] },
  { category: "Other", labName: "MCH", patterns: [/\bmch\b/i] },
  { category: "Other", labName: "MCHC", patterns: [/\bmchc\b/i] },
  { category: "Other", labName: "RDW", patterns: [/\brdw\b/i] },
  { category: "Other", labName: "Neutrophils", patterns: [/\bneutrophils?\b/i, /\bneut\b/i] },
  { category: "Other", labName: "Lymphocytes", patterns: [/\blymphocytes?\b/i, /\blymphs?\b/i] },
  { category: "Other", labName: "Monocytes", patterns: [/\bmonocytes?\b/i, /\bmonos?\b/i] },
  { category: "Other", labName: "Eosinophils", patterns: [/\beosinophils?\b/i, /\beos\b/i] },
  { category: "Other", labName: "Basophils", patterns: [/\bbasophils?\b/i, /\bbasos?\b/i] },
  { category: "Other", labName: "Sodium", patterns: [/\bsodium\b/i, /\bna\b/i] },
  { category: "Other", labName: "Potassium", patterns: [/\bpotassium\b/i, /\bk\b/i] },
  { category: "Other", labName: "Chloride", patterns: [/\bchloride\b/i, /\bcl\b/i] },
  { category: "Other", labName: "Carbon dioxide", patterns: [/carbon\s+dioxide/i, /\bco2\b/i, /bicarbonate/i] },
  { category: "Other", labName: "Calcium", patterns: [/\bcalcium\b/i] },
  { category: "Other", labName: "Protein", patterns: [/total\s+protein/i, /\bprotein\b/i] },
  { category: "Other", labName: "Albumin", patterns: [/\balbumin\b/i] },
  { category: "Other", labName: "Globulin", patterns: [/\bglobulin\b/i] },
  { category: "Other", labName: "A/G ratio", patterns: [/a\/g\s+ratio/i, /albumin\s*\/\s*globulin/i] },
  { category: "Other", labName: "Magnesium", patterns: [/\bmagnesium\b/i] },
  { category: "Other", labName: "Phosphorus", patterns: [/\bphosphorus\b/i, /\bphosphate\b/i] },
  { category: "Other", labName: "Vitamin B12", patterns: [/vitamin\s*b12/i, /\bb12\b/i] },
  { category: "Other", labName: "Folate", patterns: [/\bfolate\b/i] },
  { category: "Other", labName: "Insulin", patterns: [/\binsulin\b/i] },
  { category: "Other", labName: "Urine specific gravity", patterns: [/specific\s+gravity/i] },
  { category: "Other", labName: "Urine pH", patterns: [/\burine\s+ph\b/i, /\bph\b/i] },
  { category: "Other", labName: "Urine ketones", patterns: [/\bketones?\b/i] },
  { category: "Other", labName: "Urine blood", patterns: [/\bblood\b/i] },
  { category: "Other", labName: "Urine nitrite", patterns: [/\bnitrite\b/i] }
];

const labMarkerSplitPattern = /(?=\b(?:hemoglobin\s*a1c|a1c|hba1c|glucose|cholesterol|non[-\s]?hdl|ldl|hdl|vldl|triglycerides|ferritin|iron|tibc|vitamin\s*d|alt|ast|alkaline\s+phosphatase|alk\s*phos|bilirubin|ggt|creatinine|egfr|bun|tsh|free\s*t4|free\s*t3|testosterone|psa|white\s+blood\s+cell|red\s+blood\s+cell|wbc|rbc|hemoglobin|hgb|hematocrit|hct|platelet|plt|mcv|mch|mchc|rdw|neutrophils?|lymphocytes?|monocytes?|eosinophils?|basophils?|sodium|potassium|chloride|carbon\s+dioxide|co2|calcium|total\s+protein|albumin|globulin|magnesium|phosphorus|vitamin\s*b12|folate|insulin|specific\s+gravity|ketones?|nitrite)\b)/i;
const unitPattern = /(%|mg\/dL|mg\/dl|mmol\/L|mmol\/l|ng\/mL|ng\/ml|pg\/mL|pg\/ml|mcg\/dL|mcg\/dl|ug\/dL|ug\/dl|mIU\/L|miu\/l|uIU\/mL|uiu\/ml|IU\/L|iu\/l|U\/L|u\/l|g\/dL|g\/dl|g\/L|g\/l|mEq\/L|meq\/l|fL|fl|pg|x10E3\/uL|x10e3\/ul|x10\^3\/uL|10\*3\/uL|K\/uL|k\/ul|M\/uL|m\/ul|cells\/uL|cells\/ul|mL\/min\/1\.73m2|ml\/min\/1\.73m2)/i;
const medicationDosePattern = /\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|mL|units?|iu|IU|tablet|tablets|capsule|capsules|cap|caps|spray|sprays|drop|drops|patch|puff|puffs)\b/i;
const supplementKeywords = /\b(vitamin|supplement|magnesium|zinc|omega|fish oil|probiotic|fiber|collagen|biotin|iron|calcium|folate|b12|d3|turmeric|melatonin)\b/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return send(405, { message: "This document action is not available." });
  }

  try {
    const body = await parseBody(req);
    const filePath = typeof body.filePath === "string" ? body.filePath : "";
    const mode: AnalyzeMode = body.mode === "medications" ? "medications" : "labs";

    console.log(JSON.stringify({ event: "analysis_start", mode, bucketName, hasFilePath: Boolean(filePath), fileExtension: filePath.split(".").pop() || "" }));

    if (!filePath || !filePath.toLowerCase().endsWith(".pdf")) {
      console.warn(JSON.stringify({ event: "analysis_rejected", reason: "invalid_pdf_path", hasFilePath: Boolean(filePath) }));
      return send(400, { message: "Please upload a PDF before analyzing." });
    }

    const accessToken = authToken(req);
    if (!accessToken) {
      console.warn(JSON.stringify({ event: "analysis_rejected", reason: "missing_auth" }));
      return send(401, { message: "Please sign in again before analyzing this PDF." });
    }

    const supabaseUrl = requiredEnv("SUPABASE_URL");
    const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    const azureEndpoint = requiredEnv("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT").replace(/\/+$/, "");
    const azureKey = requiredEnv("AZURE_DOCUMENT_INTELLIGENCE_KEY");
    const azureModelId = Deno.env.get("AZURE_DOCUMENT_INTELLIGENCE_MODEL_ID") || defaultModelId;

    console.log(JSON.stringify({ event: "analysis_config_loaded", hasSupabaseUrl: Boolean(supabaseUrl), hasServiceRoleKey: Boolean(serviceRoleKey), hasAzureEndpoint: Boolean(azureEndpoint), hasAzureKey: Boolean(azureKey), azureModelId }));

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !userData.user) {
      console.warn(JSON.stringify({ event: "analysis_rejected", reason: "invalid_auth", authError: userError?.message || "no_user" }));
      return send(401, { message: "Please sign in again before analyzing this PDF." });
    }

    if (!filePath.startsWith(`${userData.user.id}/`)) {
      console.warn(JSON.stringify({ event: "analysis_rejected", reason: "file_owner_mismatch", userId: userData.user.id }));
      return send(403, { message: "This document does not belong to the signed-in account." });
    }

    await supabase.from("medical_documents").update({ extraction_status: "needs_ocr" }).eq("file_path", filePath);

    const { data: fileBlob, error: downloadError } = await supabase.storage.from(bucketName).download(filePath);
    if (downloadError || !fileBlob) {
      console.error(JSON.stringify({ event: "analysis_failed", stage: "supabase_download", bucketName, filePath, error: downloadError?.message || "no_blob" }));
      return send(404, { message: "The uploaded PDF could not be opened securely." });
    }

    console.log(JSON.stringify({ event: "analysis_file_loaded", contentType: fileBlob.type, size: fileBlob.size }));

    const pdfBytes = await fileBlob.arrayBuffer();
    const text = await analyzeWithAzure(pdfBytes, azureEndpoint, azureKey, azureModelId);
    const lines = splitReadableLines(text);
    const items = mode === "medications" ? extractMedicationSuggestions(text) : extractLabSuggestions(text);

    await supabase
      .from("medical_documents")
      .update({
        extraction_status: "text_extracted",
        extracted_summary: { mode, item_count: items.length, line_count: lines.length }
      })
      .eq("file_path", filePath);

    console.log(JSON.stringify({ event: "analysis_complete", mode, itemCount: items.length, lineCount: lines.length }));

    return send(200, {
      text,
      lines,
      items,
      suggestions: items,
      message: items.length ? "Analysis complete." : "Analysis complete, but no structured items were found."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The PDF could not be analyzed. Please try again.";
    console.error(JSON.stringify({ event: "analysis_failed", stage: "unexpected", error: message }));
    return send(500, {
      message: cleanError(message)
    });
  }
});

async function parseBody(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

function authToken(req: Request) {
  const header = req.headers.get("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

async function analyzeWithAzure(pdfBytes: ArrayBuffer, endpoint: string, key: string, modelId: string) {
  const encodedModelId = encodeURIComponent(modelId || defaultModelId);
  const response = await fetch(
    `${endpoint}/documentintelligence/documentModels/${encodedModelId}:analyze?api-version=${apiVersion}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/pdf",
        "Ocp-Apim-Subscription-Key": key
      },
      body: pdfBytes
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(JSON.stringify({ event: "analysis_failed", stage: "azure_start", status: response.status, detail: detail.slice(0, 500) }));
    throw new Error("Document analysis could not start.");
  }

  const operationLocation = response.headers.get("operation-location");
  if (!operationLocation) {
    console.error(JSON.stringify({ event: "analysis_failed", stage: "azure_start", reason: "missing_operation_location" }));
    throw new Error("Document analysis did not return a status URL.");
  }

  for (let attempt = 0; attempt < maxPollAttempts; attempt += 1) {
    await delay(1200 + attempt * 250);
    const poll = await fetch(operationLocation, {
      headers: { "Ocp-Apim-Subscription-Key": key }
    });

    if (!poll.ok) {
      const detail = await poll.text().catch(() => "");
      console.error(JSON.stringify({ event: "analysis_failed", stage: "azure_poll", status: poll.status, detail: detail.slice(0, 500) }));
      throw new Error("Document analysis status could not be checked.");
    }

    const result = await poll.json();
    if (result?.status === "succeeded") {
      return extractText(result);
    }

    if (result?.status === "failed") {
      console.error(JSON.stringify({ event: "analysis_failed", stage: "azure_poll", status: "failed", error: result?.error || null }));
      throw new Error("Document analysis could not read this PDF.");
    }
  }

  console.warn(JSON.stringify({ event: "analysis_timeout", maxPollAttempts }));
  throw new Error("The PDF is still analyzing. Please try again in a moment.");
}

function extractText(result: Record<string, any>) {
  if (typeof result?.analyzeResult?.content === "string") {
    return result.analyzeResult.content;
  }

  const pages = Array.isArray(result?.analyzeResult?.pages) ? result.analyzeResult.pages : [];
  return pages
    .map((page) => (Array.isArray(page?.lines) ? page.lines.map((line: { content?: string }) => line?.content || "").join("\n") : ""))
    .join("\n")
    .trim();
}

function splitReadableLines(text: string) {
  return (typeof text === "string" ? text : "")
    .split(/\r?\n| {3,}/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 500);
}

function extractLabSuggestions(text: string) {
  const safeText = typeof text === "string" ? text : "";
  const resultDate = findResultDate(safeText);
  const candidates = splitIntoCandidateLines(safeText);
  const suggestions = new Map<string, Record<string, string>>();

  for (const line of candidates) {
    for (const marker of labMarkers) {
      if (!marker.patterns.some((pattern) => pattern.test(line))) continue;
      const parsed = parseLabLine(line, marker);
      if (!parsed) continue;
      const key = `${parsed.category}-${parsed.labName}`;
      if (!suggestions.has(key)) suggestions.set(key, { ...parsed, date: resultDate });
    }
  }

  return Array.from(suggestions.values());
}

function extractMedicationSuggestions(text: string) {
  const candidates = splitMedicationCandidateLines(typeof text === "string" ? text : "");
  const suggestions = new Map<string, Record<string, string>>();

  for (const line of candidates) {
    const parsed = parseMedicationLine(line);
    if (!parsed) continue;
    const key = `${parsed.name.toLowerCase()}-${parsed.dose.toLowerCase()}`;
    if (!suggestions.has(key)) suggestions.set(key, parsed);
  }

  return Array.from(suggestions.values()).slice(0, 30);
}

function splitIntoCandidateLines(text: string) {
  if (!text) return [];
  const naturalLines = text
    .split(/\n| {3,}/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (naturalLines.length > 8) return naturalLines;

  return text
    .replace(/\s+/g, " ")
    .split(labMarkerSplitPattern)
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitMedicationCandidateLines(text: string) {
  if (!text) return [];
  const naturalLines = text
    .split(/\n| {3,}|\u2022/)
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

function parseMedicationLine(line: string) {
  const doseMatch = line.match(medicationDosePattern);
  if (!doseMatch || doseMatch.index === undefined) return null;
  const beforeDose = line.slice(0, doseMatch.index).replace(/^(medication|supplement|current medications?|active medications?)\s*[:\-]?\s*/i, "").trim();
  const name = beforeDose.replace(/^[^a-zA-Z]+/, "").replace(/\s+(tablet|capsule|oral|by mouth)$/i, "").trim();
  if (!name || name.length < 2 || /\b(date|provider|patient|instructions|directions|allergies)\b/i.test(name)) return null;
  const afterDose = line.slice(doseMatch.index + doseMatch[0].length).trim();

  return {
    name: titleCase(name),
    type: supplementKeywords.test(line) ? "Supplement" : "Medication",
    dose: doseMatch[0],
    timeOfDay: inferMedicationTime(afterDose),
    notes: `Imported from PDF. Please verify against the original document.${afterDose ? ` ${afterDose.slice(0, 90)}` : ""}`
  };
}

function parseLabLine(line: string, marker: { category: string; labName: string; patterns: RegExp[] }) {
  const markerMatch = marker.patterns.map((pattern) => line.match(pattern)).find(Boolean);
  const markerIndex = markerMatch?.index || 0;
  const afterMarker = line.slice(markerIndex + (markerMatch?.[0]?.length || 0));
  const valueMatch = afterMarker.match(/(?:result|value|current)?\s*[:=]?\s*(?:high|low|h|l|abnormal|normal|flag)?\s*[:\-]?\s*([<>]?\d+(?:\.\d+)?)/i);
  if (!valueMatch) return null;
  const value = valueMatch[1];
  const afterValue = afterMarker.slice((valueMatch.index || 0) + valueMatch[0].length);
  const unitMatch = afterValue.match(unitPattern);
  const unit = unitMatch?.[0] || "";
  const afterUnit = unitMatch ? afterValue.slice((unitMatch.index || 0) + unitMatch[0].length) : afterValue;

  return {
    category: marker.category,
    labName: marker.labName,
    value,
    unit,
    referenceRange: cleanReferenceRange(afterUnit),
    date: "",
    notes: "Extracted from PDF. Please verify against the original report."
  };
}

function cleanReferenceRange(value: string) {
  const referenceMatch = value.match(/(?:reference|ref\.?\s*range|range|normal)?\s*[:\-]?\s*([<>]?\d+(?:\.\d+)?\s*(?:-|to|\u2013)\s*[<>]?\d+(?:\.\d+)?|[<>]=?\s*\d+(?:\.\d+)?)/i);
  return referenceMatch?.[1]?.replace(/\s+/g, " ").trim() || "";
}

function findResultDate(text: string) {
  const match = text.match(/(?:collection date|collected|result date|reported|date of service)\s*[:\-]?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i);
  if (!match || typeof match[1] !== "string") return "";
  const parts = match[1].split(/[/-]/);
  if (parts.length !== 3) return "";
  const [month, day, year] = parts;
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear.padStart(4, "20")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function inferMedicationTime(value: string) {
  if (/morning|breakfast|am\b/i.test(value)) return "Morning";
  if (/night|bedtime|evening|pm\b/i.test(value)) return "Evening";
  if (/twice daily|2 times|bid\b/i.test(value)) return "Twice daily";
  if (/daily|once daily|qd\b/i.test(value)) return "Daily";
  if (/weekly/i.test(value)) return "Weekly";
  return "";
}

function titleCase(value: string) {
  return value.toLowerCase().split(/\s+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanError(message: string) {
  if (/AZURE_DOCUMENT_INTELLIGENCE|SUPABASE_SERVICE_ROLE|SUPABASE_/i.test(message)) {
    return "Document analysis is not configured on the server yet.";
  }
  return message || "The PDF could not be analyzed. Please try again.";
}

function send(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
