import { supabase } from "./supabase";

export const MEDICAL_DOCUMENTS_BUCKET = "medical-documents";

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

export const MAX_MEDICAL_DOCUMENT_BYTES = 20 * 1024 * 1024;

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

function safeFileName(fileName: string) {
  const safeName = fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);

  return safeName || "upload";
}

function categoryFolder(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "documents";
}

function contentTypeForFile(file: File) {
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".pdf")) return "application/pdf";

  if (file.type) {
    return file.type;
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

export async function uploadMedicalDocument(file: File, category: string, title: string): Promise<MedicalDocumentRecord> {
  if (!supabase) {
    throw new Error("Secure file storage is not configured yet.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Please sign in before uploading files.");
  }

  const contentType = contentTypeForFile(file);
  const safeName = safeFileName(file.name);
  const extension = safeName.includes(".") ? "" : extensionForContentType(contentType);
  const fileName = `${safeName}${extension}`;
  const filePath = `${userData.user.id}/${categoryFolder(category)}/${Date.now()}-${fileName}`;
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
