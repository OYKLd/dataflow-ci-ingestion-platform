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
    const file = formData.get("file") as File | null;

    if (!sourceId || typeof sourceId !== "string") {
      return NextResponse.json(
        { error: "sourceId required" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "file required" },
        { status: 400 }
      );
    }

    const fileName = typeof file.name === "string" && file.name
      ? file.name
      : `upload-${Date.now()}.csv`;

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

    const rows = await processUpload(filePath);
    console.log("/api/upload rows", rows.length);

    return NextResponse.json({
      uploadId: upload.id,
      rowCount: rows.length,
    });
  } catch (error) {
    console.error("/api/upload error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
