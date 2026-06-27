import fs from "fs/promises";
import Papa from "papaparse";
import * as XLSX from "xlsx";
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
  console.log("1 - processUpload démarré")
  const upload = await getUploadById(uploadId);
  console.log("2 - Upload récupéré", upload);

  if (!upload) {
    throw new Error("Upload not found");
  }

  const schemaVersion = await getLatestSchemaVersion(upload.sourceId);
  console.log("3 - Schéma récupéré", schemaVersion);

  if (!schemaVersion) {
    throw new Error("Schema not found");
  }

  const raw = schemaVersion.schema as any;

  const schema = raw?.schema;

  if (!schema || !Array.isArray(schema.columns)) {
    throw new Error("Invalid schema format");
  }

  const fileContent = await fs.readFile(upload.filePath);
  console.log("5 - Fichier lu");

  let rows: Record<string, string>[];

  if (upload.fileName.endsWith('.xlsx') || upload.fileName.endsWith('.xls')) {
    const workbook = XLSX.read(fileContent, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    rows = jsonData as Record<string, string>[];
    console.log("6 - XLSX parsé", rows.length);
  } else {
    const csvContent = fileContent.toString('utf8');
    const result = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });
    console.log("6 - CSV parsé", result.data.length);
    rows = result.data as Record<string, string>[];
  }
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

  console.log("7 - Mise à jour des statistiques");
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
  console.log("8 - Terminé");
}
