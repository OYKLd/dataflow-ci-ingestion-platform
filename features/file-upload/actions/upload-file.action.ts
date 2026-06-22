"use server";

import { createUpload } from "../services/upload.service";

export async function uploadFileAction(
  sourceId: string,
  formData: FormData
) {
  const file =
    formData.get("file") as File;

  if (!file) {
    throw new Error("File required");
  }

  const upload = await createUpload(
    sourceId,
    file.name
  );

  setTimeout(() => {
    console.log(`Processing upload ${upload.id}`);
  }, 0);
}