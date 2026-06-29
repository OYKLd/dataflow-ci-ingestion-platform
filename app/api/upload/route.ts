import { NextResponse } from "next/server";
import { createUpload } from "@/features/file-upload/services/upload.service";
import { uploadQueue } from "@/lib/upload-queue";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { canUpload } from "@/lib/permissions";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !canUpload(session.user as any)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    const fileSize = (file as any).size || 0;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds maximum limit of 10MB" },
        { status: 413 }
      );
    }

    console.log("/api/upload file metadata", {
      type: typeof file,
      name: (file as any).name,
      size: fileSize,
      keys: Object.keys(file as any),
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const { url } = await put(`${Date.now()}-${fileName}`, buffer, {
      access: 'private',
    });

    const upload = await createUpload(
      sourceId,
      fileName,
      url
    );

    // Add to queue for async processing
    uploadQueue.add(upload.id);

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
