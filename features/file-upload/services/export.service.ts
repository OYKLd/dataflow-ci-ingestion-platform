export function exportErrorsToCSV(errors: Array<{ rowNumber: number; columnName: string; message: string }>) {
  const headers = ["Row Number", "Column Name", "Error Message"];
  const rows = errors.map((error) => [
    error.rowNumber,
    error.columnName,
    error.message,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `validation_errors_${Date.now()}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
