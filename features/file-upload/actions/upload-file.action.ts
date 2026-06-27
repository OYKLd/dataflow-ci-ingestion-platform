"use server";

import { createUpload } from "../services/upload.service";
import { processUpload } from "../services/process-upload.service";
import fs from "fs/promises";
import path from "path";
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
    const uploadDir = path.join(
      process.cwd(),
      "uploads"
    );
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(
      uploadDir,
      `${Date.now()}-${file.name}`
    );
    await fs.writeFile(filePath, buffer);

    const upload = await createUpload(
      sourceId,
      file.name,
      filePath
    );
    await processUpload(upload.id);

    setTimeout(() => {
      processUpload(upload.id).catch(console.error);
    }, 0);
}