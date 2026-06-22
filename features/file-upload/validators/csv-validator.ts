import { ValidationIssue } from "../types/validation";

export function validateRow(
  row: Record<string, string>,
  rowNumber: number,
  schema: any
): ValidationIssue[] {
  const errors: ValidationIssue[] = [];

  for (const column of schema.columns) {
    const value = row[column.name];

    if (
      column.required &&
      (!value || value.trim() === "")
    ) {
      errors.push({
        rowNumber,
        columnName: column.name,
        message: "Required value missing",
      });

      continue;
    }

    if (
      column.type === "number" &&
      value &&
      isNaN(Number(value))
    ) {
      errors.push({
        rowNumber,
        columnName: column.name,
        message: "Must be a number",
      });
    }

    if (
      column.type === "date" &&
      value &&
      Number.isNaN(Date.parse(value))
    ) {
      errors.push({
        rowNumber,
        columnName: column.name,
        message: "Invalid date",
      });
    }
  }

  return errors;
}