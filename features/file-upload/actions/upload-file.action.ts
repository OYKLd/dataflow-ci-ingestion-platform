"use server";

import { createUpload } from "../services/upload.service";
import { processUpload } from "../services/process-upload.service";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";
import { canUpload } from "@/lib/permissions";

export async function uploadFileAction(
  formData: FormData
) {
  const user = await getCurrentUser();

  if (!user || !canUpload(user)) {
    throw new Error("Unauthorized");
  }

  const sourceId =
    formData.get("sourceId");
  const file =
    formData.get("file") as File;

  if (!sourceId || typeof sourceId !== "string") {
    throw new Error("sourceId required");
  }

  if (!file) {
    throw new Error("File required");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const { url } = await put(`${Date.now()}-${file.name}`, buffer, {
    access: 'private',
  });

    const upload = await createUpload(
      sourceId,
      file.name,
      url
    );
    
    processUpload(upload.id).catch(console.error);
}