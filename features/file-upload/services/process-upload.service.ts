import fs from "fs/promises";
import Papa from "papaparse";
import {
  getUploadById,
  updateUploadStats,
  createValidationErrors,
} from "./upload.service";
import { SourceSchema } from "@/features/source-management/types/schema";
import {
  getLatestSchemaVersion,
} from "@/features/source-schema/services/schema.service";
import {
  validateRow,
} from "../validators/csv-validator";

export async function processUpload(
  uploadId: string
) {
  const upload = await getUploadById(uploadId);

  if (!upload) {
    throw new Error("Upload not found");
  }

  const schemaVersion = await getLatestSchemaVersion(upload.sourceId);

  if (!schemaVersion) {
    throw new Error("Schema not found");
  }

  const schema = schemaVersion.schema as SourceSchema;
  if (!schema || !Array.isArray(schema.columns)) {
    throw new Error("Invalid schema format");
  }

  const fileContent = await fs.readFile(upload.filePath, "utf8");

  const result = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = result.data as Record<string, string>[];
  console.log("FIRST ROW");
  console.log(rows[0]);
  let validRows = 0;
  let invalidRows = 0;
  const allErrors: {
    rowNumber: number;
    columnName: string;
    message: string;
  }[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors = validateRow(row, index + 1, schema);

    if (errors.length === 0) {
      validRows++;
    } else {
      invalidRows++;
      allErrors.push(...errors);
    }
  }

  await createValidationErrors(upload.id, allErrors);

  const status =
    invalidRows === 0
      ? "SUCCESS"
      : validRows > 0
      ? "PARTIAL"
      : "FAILED";
const qualityScore =
  rows.length === 0
    ? 0
    : Number(
        (
          (validRows / rows.length) *
          100
        ).toFixed(2)
      );
  await updateUploadStats(upload.id, {
    status,
    totalRows: rows.length,
    validRows,
    invalidRows,
    qualityScore,
  });
}
