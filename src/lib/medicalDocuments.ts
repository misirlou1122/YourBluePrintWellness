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
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

function categoryFolder(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "documents";
}

export async function uploadMedicalDocument(file: File, category: string, title: string): Promise<MedicalDocumentRecord> {
  if (!supabase) {
    throw new Error("Secure file storage is not configured yet.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Please sign in before uploading files.");
  }

  const filePath = `${userData.user.id}/${categoryFolder(category)}/${Date.now()}-${safeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from(MEDICAL_DOCUMENTS_BUCKET)
    .upload(filePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const record: MedicalDocumentRecord = {
    title: title.trim() || file.name,
    category,
    file_name: file.name,
    file_path: filePath,
    content_type: file.type || "application/octet-stream",
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
