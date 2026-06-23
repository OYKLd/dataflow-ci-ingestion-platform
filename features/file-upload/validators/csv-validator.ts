import { ValidationIssue } from "../types/validation";
import { SourceSchema } from "@/features/source-management/types/schema";

export function validateRow(
  row: Record<string, string>,
  rowNumber: number,
  schema: SourceSchema
): ValidationIssue[] {
  const errors: ValidationIssue[] = [];

  for (const column of schema.columns) {
    const value = row[column.name];
    const isEmpty =
      value === undefined ||
      value === null ||
      value.trim() === "";

    if (column.required && isEmpty) {
      errors.push({
        rowNumber,
        columnName: column.name,
        message: "Required value missing",
      });

      continue;
    }

    if (!column.required && isEmpty) {
      continue;
    }

    if (column.type === "date" && Number.isNaN(Date.parse(value))) {
      errors.push({
        rowNumber,
        columnName: column.name,
        message: "Invalid date",
      });
      continue;
    }

    if (column.type === "integer" && !Number.isInteger(Number(value))) {
      errors.push({
        rowNumber,
        columnName: column.name,
        message: "Must be an integer",
      });
      continue;
    }

    if (column.type === "enum" && !column.allowed_values?.includes(value)) {
      errors.push({
        rowNumber,
        columnName: column.name,
        message: "Value must be one of the allowed options",
      });
      continue;
    }

    if (column.pattern) {
      try {
        const regex = new RegExp(column.pattern);
        if (!regex.test(value)) {
          errors.push({
            rowNumber,
            columnName: column.name,
            message: "Value does not match required pattern",
          });
          continue;
        }
      } catch {
        errors.push({
          rowNumber,
          columnName: column.name,
          message: "Invalid validation pattern",
        });
        continue;
      }
    }

    if (column.type === "integer") {
      const number = Number(value);
      if (column.min !== undefined && number < column.min) {
        errors.push({
          rowNumber,
          columnName: column.name,
          message: `Value must be at least ${column.min}`,
        });
        continue;
      }
      if (column.max !== undefined && number > column.max) {
        errors.push({
          rowNumber,
          columnName: column.name,
          message: `Value must be at most ${column.max}`,
        });
        continue;
      }
    }
  }

  return errors;
}