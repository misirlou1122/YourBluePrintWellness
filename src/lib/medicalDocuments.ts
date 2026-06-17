import { supabase } from "./supabase";

export const MEDICAL_DOCUMENTS_BUCKET = "medical-documents";
export const MAX_MEDICAL_DOCUMENT_BYTES = 20 * 1024 * 1024;

export const ALLOWED_MEDICAL_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
]);

export interface MedicalDocumentRecord {
  id?: string;
  title: string;
  category: string;
  file_name: string;
  file_path: string;
  content_type: string;
  file_size: number;
  extraction_status: "not_started" | "text_extracted" | "needs_ocr" | "reviewed";
}

export function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function validatePdfUpload(file: File) {
  if (!isPdfFile(file)) {
    return "Please choose a PDF file for automatic reading.";
  }

  if (file.size > MAX_MEDICAL_DOCUMENT_BYTES) {
    return "This PDF is too large. Please choose a file under 20 MB.";
  }

  return "";
}

export function validateMedicalUpload(file: File) {
  const contentType = contentTypeForFile(file);

  if (!ALLOWED_MEDICAL_DOCUMENT_TYPES.has(contentType)) {
    return "Please choose a PDF, JPG, PNG, WEBP, HEIC, or HEIF file.";
  }

  if (file.size <= 0) {
    return "This file appears empty. Please choose another file.";
  }

  if (file.size > MAX_MEDICAL_DOCUMENT_BYTES) {
    return "This file is too large. Please choose a file under 20 MB.";
  }

  return "";
}

function categoryFolder(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "documents";
}

function contentTypeForFile(file: File) {
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".pdf")) return "application/pdf";

  if (file.type) {
    const browserType = file.type.toLowerCase();
    if (browserType === "image/jpg") return "image/jpeg";
    if (ALLOWED_MEDICAL_DOCUMENT_TYPES.has(browserType)) return browserType;
  }

  if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) return "image/jpeg";
  if (lowerName.endsWith(".png")) return "image/png";
  if (lowerName.endsWith(".webp")) return "image/webp";
  if (lowerName.endsWith(".heic")) return "image/heic";
  if (lowerName.endsWith(".heif")) return "image/heif";
  return "application/octet-stream";
}

function extensionForContentType(contentType: string) {
  if (contentType === "application/pdf") return ".pdf";
  if (contentType === "image/jpeg") return ".jpg";
  if (contentType === "image/png") return ".png";
  if (contentType === "image/webp") return ".webp";
  if (contentType === "image/heic") return ".heic";
  if (contentType === "image/heif") return ".heif";
  return "";
}

function generatedFileName(contentType: string) {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  return `${id}${extensionForContentType(contentType)}`;
}

export async function uploadMedicalDocument(file: File, category: string, title: string): Promise<MedicalDocumentRecord> {
  if (!supabase) {
    throw new Error("Secure file storage is not configured yet.");
  }

  const validationMessage = validateMedicalUpload(file);
  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Please sign in before uploading files.");
  }

  const contentType = contentTypeForFile(file);
  const fileName = generatedFileName(contentType);
  const filePath = `${userData.user.id}/${categoryFolder(category)}/${fileName}`;
  const { error: uploadError } = await supabase.storage
    .from(MEDICAL_DOCUMENTS_BUCKET)
    .upload(filePath, file, {
      contentType,
      upsert: false
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const record: MedicalDocumentRecord = {
    title: title.trim() || file.name,
    category,
    file_name: file.name || fileName,
    file_path: filePath,
    content_type: contentType,
    file_size: file.size,
    extraction_status: "not_started"
  };

  const { data, error } = await supabase
    .from("medical_documents")
    .insert(record)
    .select("id,title,category,file_name,file_path,content_type,file_size,extraction_status")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as MedicalDocumentRecord;
}
