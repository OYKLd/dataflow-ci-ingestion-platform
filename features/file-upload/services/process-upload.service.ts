import fs from "fs/promises";
import Papa from "papaparse";
import {
  getUploadById,
  updateUploadStats,
  createValidationErrors,
} from "./upload.service";
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

  const fileContent = await fs.readFile(upload.filePath, "utf8");

  const result = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = result.data as Record<string, string>[];

  let validRows = 0;
  let invalidRows = 0;
  const allErrors: {
    rowNumber: number;
    columnName: string;
    message: string;
  }[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors = validateRow(row, index + 1, schemaVersion.schema);

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

  await updateUploadStats(upload.id, {
    status,
    totalRows: rows.length,
    validRows,
    invalidRows,
  });
}
