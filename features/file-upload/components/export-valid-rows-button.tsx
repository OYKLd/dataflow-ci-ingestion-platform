"use client";

type Props = {
  uploadId: string;
};

export function ExportValidRowsButton({ uploadId }: Props) {
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/upload/${uploadId}/valid-rows`);
      
      if (!response.ok) {
        throw new Error("Failed to export valid rows");
      }

      const csv = await response.text();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `valid-rows-${uploadId}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting valid rows:", error);
      alert("Failed to export valid rows");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Export Valid Rows as CSV
    </button>
  );
}
