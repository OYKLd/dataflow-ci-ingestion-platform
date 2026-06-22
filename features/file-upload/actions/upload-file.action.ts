"use server";

import { createUpload } from "../services/upload.service";
import { processUpload } from "../services/process-upload.service";
import fs from "fs/promises";
import path from "path";

export async function uploadFileAction(
  formData: FormData
) {
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

    const rows = await processUpload(
      filePath
    );
    console.log(rows);

  setTimeout(() => {
    console.log(`Processing upload ${upload.id}`);
  }, 0);
}