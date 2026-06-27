"use client";

import { exportErrorsToCSV } from "@/features/file-upload/services/export.service";

type Props = {
  errors: Array<{ rowNumber: number; columnName: string; message: string }>;
};

export function ExportErrorsButton({ errors }: Props) {
  const handleExport = () => {
    exportErrorsToCSV(errors);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Export Errors as CSV
    </button>
  );
}
