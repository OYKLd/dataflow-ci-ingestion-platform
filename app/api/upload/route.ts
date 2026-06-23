import { NextResponse } from "next/server";
import { createUpload } from "@/features/file-upload/services/upload.service";
import { processUpload } from "@/features/file-upload/services/process-upload.service";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type");
    console.log("/api/upload content-type", contentType);

    const formData = await request.formData();
    const sourceId = formData.get("sourceId");
    const fileEntry = formData.get("file");

    if (!sourceId || typeof sourceId !== "string") {
      return NextResponse.json(
        { error: "sourceId required" },
        { status: 400 }
      );
    }

    if (!fileEntry || typeof fileEntry === "string") {
      return NextResponse.json(
        { error: "file required" },
        { status: 400 }
      );
    }

    const file = fileEntry as File | Blob;
    const fileName = typeof (file as any).name === "string" && (file as any).name
      ? (file as any).name
      : `upload-${Date.now()}.csv`;

    console.log("/api/upload file metadata", {
      type: typeof file,
      name: (file as any).name,
      size: (file as any).size,
      keys: Object.keys(file as any),
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(
      uploadDir,
      `${Date.now()}-${fileName}`
    );
    await fs.writeFile(filePath, buffer);

    const upload = await createUpload(
      sourceId,
      fileName,
      filePath
    );

    setTimeout(() => {
      processUpload(upload.id).catch(console.error);
    }, 0);

    return NextResponse.json({
      uploadId: upload.id,
    });
  } catch (error) {
    console.error("/api/upload error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
