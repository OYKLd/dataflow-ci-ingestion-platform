import { NextResponse } from "next/server";
import { uploadQueue } from "@/lib/upload-queue";
import { getUploadById } from "@/features/file-upload/services/upload.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { uploadId } = await params;

    // Check queue status first
    const queueStatus = uploadQueue.getStatus(uploadId);

    // Get upload status from database
    const upload = await getUploadById(uploadId);

    if (!upload) {
      return NextResponse.json(
        { error: "Upload not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      uploadId: upload.id,
      status: upload.status,
      totalRows: upload.totalRows,
      validRows: upload.validRows,
      invalidRows: upload.invalidRows,
      qualityScore: upload.qualityScore,
      queueStatus: queueStatus || null,
      createdAt: upload.createdAt,
      updatedAt: upload.updatedAt,
    });
  } catch (error) {
    console.error("/api/upload/[uploadId]/status error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
