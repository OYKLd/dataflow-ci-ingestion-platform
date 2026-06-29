import { NextResponse } from "next/server";
import { getUploadReport } from "@/features/file-upload/services/upload.service";
import Papa from "papaparse";
import * as XLSX from "xlsx";

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

  // Get the row numbers that have errors
  const errorRowNumbers = new Set(upload.errors.map((error) => error.rowNumber));

  try {
    const response = await fetch(upload.filePath, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });
    const fileContent = Buffer.from(await response.arrayBuffer());
    let rows: Record<string, string>[];
    let headers: string[];

    if (upload.fileName.endsWith('.xlsx') || upload.fileName.endsWith('.xls')) {
      const workbook = XLSX.read(fileContent, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      rows = jsonData as Record<string, string>[];
      headers = Object.keys(rows[0] || {});
    } else {
      const csvContent = fileContent.toString('utf8');
      const result = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
      });
      rows = result.data as Record<string, string>[];
      headers = result.meta.fields || [];
    }

    // Filter out rows that have errors (row numbers are 1-indexed in errors)
    const validRows = rows.filter((_, index) => !errorRowNumbers.has(index + 1));

    // Generate CSV
    const csv = [
      headers.join(","),
      ...validRows.map((row) =>
        headers.map((header) => {
          const value = row[header] || "";
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          `attachment; filename=valid-rows-${uploadId}.csv`,
      },
    });
  } catch (error) {
    console.error("Error exporting valid rows:", error);
    return NextResponse.json(
      { error: "Failed to export valid rows" },
      { status: 500 }
    );
  }
}
