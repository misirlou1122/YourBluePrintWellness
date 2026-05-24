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
  if (file.type) {
    return file.type;
  }

  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".pdf")) return "application/pdf";
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
  const fileBody = new Blob([await file.arrayBuffer()], { type: contentType });
  const { error: uploadError } = await supabase.storage
    .from(MEDICAL_DOCUMENTS_BUCKET)
    .upload(filePath, fileBody, {
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
