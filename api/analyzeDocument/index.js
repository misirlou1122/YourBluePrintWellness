const { createClient } = require("@supabase/supabase-js");

const bucketName = "medical-documents";
const maxPollAttempts = 18;
const apiVersion = "2024-11-30";
const defaultModelId = "prebuilt-read";

const labMarkers = [
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
  { category: "Kidney", labName: "Creatinine", patterns: [/\bcreatinine\b/i] },
  { category: "Kidney", labName: "eGFR", patterns: [/\begfr\b/i] },
  { category: "Kidney", labName: "BUN", patterns: [/\bbun\b/i, /urea\s+nitrogen/i] },
  { category: "Thyroid", labName: "TSH", patterns: [/\btsh\b/i] },
  { category: "Testosterone", labName: "Testosterone", patterns: [/\btestosterone\b/i] },
  { category: "PSA", labName: "PSA", patterns: [/\bpsa\b/i] },
  { category: "Other", labName: "Protein", patterns: [/\bprotein\b/i] },
  { category: "Other", labName: "Albumin", patterns: [/\balbumin\b/i] }
];

const unitPattern = /(%|mg\/dL|mg\/dl|mmol\/L|mmol\/l|ng\/mL|ng\/ml|pg\/mL|pg\/ml|mcg\/dL|mcg\/dl|ug\/dL|ug\/dl|mIU\/L|miu\/l|uIU\/mL|uiu\/ml|IU\/L|iu\/l|U\/L|u\/l|g\/dL|g\/dl|mL\/min\/1\.73m2|ml\/min\/1\.73m2)/i;
const medicationDosePattern = /\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|mL|units?|iu|IU|tablet|tablets|capsule|capsules|cap|caps|spray|sprays|drop|drops|patch|puff|puffs)\b/i;
const supplementKeywords = /\b(vitamin|supplement|magnesium|zinc|omega|fish oil|probiotic|fiber|collagen|biotin|iron|calcium|folate|b12|d3|turmeric|melatonin)\b/i;

module.exports = async function (context, req) {
  try {
    const body = parseBody(req.body);
    const filePath = typeof body.filePath === "string" ? body.filePath : "";
    const mode = body.mode === "medications" ? "medications" : "labs";

    if (!filePath || !filePath.toLowerCase().endsWith(".pdf")) {
      return send(context, 400, { message: "Please upload a PDF before analyzing." });
    }

    const authHeader = req.headers.authorization || req.headers.Authorization || "";
    const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!accessToken) {
      return send(context, 401, { message: "Please sign in again before analyzing this PDF." });
    }

    const supabaseUrl = requiredEnv("SUPABASE_URL");
    const supabaseServiceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    const azureEndpoint = requiredEnv("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT").replace(/\/+$/, "");
    const azureKey = requiredEnv("AZURE_DOCUMENT_INTELLIGENCE_KEY");
    const azureModelId = process.env.AZURE_DOCUMENT_INTELLIGENCE_MODEL_ID || defaultModelId;

    const serviceClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: userData, error: userError } = await serviceClient.auth.getUser(accessToken);
    if (userError || !userData.user) {
      return send(context, 401, { message: "Please sign in again before analyzing this PDF." });
    }

    if (!filePath.startsWith(`${userData.user.id}/`)) {
      return send(context, 403, { message: "This document does not belong to the signed-in account." });
    }

    const { data: signedData, error: signedError } = await serviceClient.storage
      .from(bucketName)
      .createSignedUrl(filePath, 300);

    if (signedError || !signedData.signedUrl) {
      return send(context, 404, { message: "The uploaded PDF could not be opened securely." });
    }

    await serviceClient.from("medical_documents").update({ extraction_status: "needs_ocr" }).eq("file_path", filePath);

    const text = await analyzeWithAzure(signedData.signedUrl, azureEndpoint, azureKey, azureModelId);
    const suggestions = mode === "medications" ? extractMedicationSuggestions(text) : extractLabSuggestions(text);

    await serviceClient
      .from("medical_documents")
      .update({
        extraction_status: "text_extracted",
        extracted_summary: { mode, suggestion_count: suggestions.length }
      })
      .eq("file_path", filePath);

    return send(context, 200, {
      suggestions,
      message: suggestions.length ? "Analysis complete." : "Analysis complete, but no structured values were found."
    });
  } catch (error) {
    context.log.error(error);
    return send(context, 500, {
      message: error instanceof Error ? cleanError(error.message) : "The PDF could not be analyzed. Please try again."
    });
  }
};

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return typeof body === "object" ? body : {};
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

async function analyzeWithAzure(urlSource, endpoint, key, modelId) {
  const encodedModelId = encodeURIComponent(modelId || defaultModelId);
  const response = await fetch(
    `${endpoint}/documentintelligence/documentModels/${encodedModelId}:analyze?api-version=${apiVersion}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": key
      },
      body: JSON.stringify({ urlSource })
    }
  );

  if (!response.ok) {
    throw new Error("Azure Document Intelligence could not start analysis.");
  }

  const operationLocation = response.headers.get("operation-location");
  if (!operationLocation) {
    throw new Error("Azure Document Intelligence did not return an analysis status URL.");
  }

  for (let attempt = 0; attempt < maxPollAttempts; attempt += 1) {
    await delay(1200 + attempt * 250);
    const poll = await fetch(operationLocation, {
      headers: { "Ocp-Apim-Subscription-Key": key }
    });

    if (!poll.ok) {
      throw new Error("Azure Document Intelligence analysis status could not be checked.");
    }

    const result = await poll.json();
    if (result.status === "succeeded") {
      return extractText(result);
    }

    if (result.status === "failed") {
      throw new Error("Azure Document Intelligence could not read this PDF.");
    }
  }

  throw new Error("The PDF is still analyzing. Please try again in a moment.");
}

function extractText(result) {
  if (typeof result?.analyzeResult?.content === "string") {
    return result.analyzeResult.content;
  }

  const pages = Array.isArray(result?.analyzeResult?.pages) ? result.analyzeResult.pages : [];
  return pages
    .map((page) => (Array.isArray(page.lines) ? page.lines.map((line) => line?.content || "").join("\n") : ""))
    .join("\n")
    .trim();
}

function extractLabSuggestions(text) {
  const safeText = typeof text === "string" ? text : "";
  const resultDate = findResultDate(safeText);
  const candidates = splitIntoCandidateLines(safeText);
  const suggestions = new Map();

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

function extractMedicationSuggestions(text) {
  const candidates = splitMedicationCandidateLines(typeof text === "string" ? text : "");
  const suggestions = new Map();

  for (const line of candidates) {
    const parsed = parseMedicationLine(line);
    if (!parsed) continue;
    const key = `${parsed.name.toLowerCase()}-${parsed.dose.toLowerCase()}`;
    if (!suggestions.has(key)) suggestions.set(key, parsed);
  }

  return Array.from(suggestions.values()).slice(0, 30);
}

function splitIntoCandidateLines(text) {
  if (!text) return [];
  const naturalLines = text
    .split(/\n| {3,}/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (naturalLines.length > 8) return naturalLines;

  return text
    .replace(/\s+/g, " ")
    .split(/(?=\b(?:hemoglobin\s*a1c|a1c|glucose|cholesterol|ldl|hdl|triglycerides|ferritin|vitamin\s*d|alt|ast|creatinine|egfr|bun|tsh|testosterone|psa|protein|albumin)\b)/i)
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitMedicationCandidateLines(text) {
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

function parseMedicationLine(line) {
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

function parseLabLine(line, marker) {
  const markerMatch = marker.patterns.map((pattern) => line.match(pattern)).find(Boolean);
  const markerIndex = markerMatch?.index || 0;
  const afterMarker = line.slice(markerIndex + (markerMatch?.[0]?.length || 0));
  const valueMatch = afterMarker.match(/(?:result|value)?\s*[:\-]?\s*([<>]?\d+(?:\.\d+)?)/i);
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

function cleanReferenceRange(value) {
  const referenceMatch = value.match(/(?:reference|ref\.?\s*range|range|normal)?\s*[:\-]?\s*([<>]?\d+(?:\.\d+)?\s*(?:-|to|\u2013)\s*[<>]?\d+(?:\.\d+)?|[<>]=?\s*\d+(?:\.\d+)?)/i);
  return referenceMatch?.[1]?.replace(/\s+/g, " ").trim() || "";
}

function findResultDate(text) {
  const match = text.match(/(?:collection date|collected|result date|reported|date of service)\s*[:\-]?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i);
  if (!match || typeof match[1] !== "string") return "";
  const parts = match[1].split(/[/-]/);
  if (parts.length !== 3) return "";
  const [month, day, year] = parts;
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear.padStart(4, "20")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function inferMedicationTime(value) {
  if (/morning|breakfast|am\b/i.test(value)) return "Morning";
  if (/night|bedtime|evening|pm\b/i.test(value)) return "Evening";
  if (/twice daily|2 times|bid\b/i.test(value)) return "Twice daily";
  if (/daily|once daily|qd\b/i.test(value)) return "Daily";
  if (/weekly/i.test(value)) return "Weekly";
  return "";
}

function titleCase(value) {
  return value.toLowerCase().split(/\s+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanError(message) {
  if (/AZURE_DOCUMENT_INTELLIGENCE|SUPABASE_SERVICE_ROLE|SUPABASE_/i.test(message)) {
    return "Document analysis is not configured on the server yet.";
  }
  return message || "The PDF could not be analyzed. Please try again.";
}

function send(context, status, body) {
  context.res = {
    status,
    headers: { "Content-Type": "application/json" },
    body
  };
}
