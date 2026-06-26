import { NextResponse } from "next/server";
import { getUploadReport } from "@/features/file-upload/services/upload.service";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      uploadId: string;
    }>;
  }
) {
  const { uploadId } = await params;

  const upload = await getUploadReport(uploadId);

  if (!upload) {
    return NextResponse.json(
      { error: "Upload not found" },
      { status: 404 }
    );
  }

  const csv = [
    "row,column,message",
    ...upload.errors.map(
      (error) =>
        `${error.rowNumber},${error.columnName},"${error.message}"`
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition":
        `attachment; filename=upload-errors-${uploadId}.csv`,
    },
  });
}