import { notFound } from "next/navigation";
import { getUploadReport } from "@/features/file-upload/services/upload.service";
import Link from "next/link";
import { ExportErrorsButton } from "@/features/file-upload/components/export-errors-button";
import { ExportValidRowsButton } from "@/features/file-upload/components/export-valid-rows-button";

type Props = {
  params: Promise<{
    uploadId: string;
  }>;
};

export default async function UploadReportPage({ params }: Props) {
  const { uploadId } = await params;
  const upload = await getUploadReport(uploadId);

  if (!upload) {
    notFound();
  }

  const errorRate = upload.totalRows > 0 
    ? Math.round((upload.invalidRows / upload.totalRows) * 100) 
    : 0;

  return (
    <main className="p-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-600 underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">
        Upload Report: {upload.fileName}
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded p-4">
          <h2 className="font-semibold">Status</h2>
          <p className="text-2xl">{upload.status}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold">Total Rows</h2>
          <p className="text-2xl">{upload.totalRows}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold">Valid Rows</h2>
          <p className="text-2xl text-green-600">{upload.validRows}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold">Invalid Rows</h2>
          <p className="text-2xl text-red-600">{upload.invalidRows}</p>
        </div>
      </div>

      <div className="mb-8 border rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Upload Details</h2>
        <div className="space-y-2">
          <p><strong>Source:</strong> {upload.source.name}</p>
          <p><strong>Uploaded:</strong> {upload.createdAt.toLocaleString()}</p>
          <p><strong>Error Rate:</strong> {errorRate}%</p>
        </div>
      </div>

      {upload.validRows > 0 && (
        <div className="mb-8 border rounded p-4 bg-blue-50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-blue-700">
              Valid Rows ({upload.validRows})
            </h2>
            <ExportValidRowsButton uploadId={uploadId} />
          </div>
        </div>
      )}

      {upload.errors.length > 0 ? (
        <div className="border rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Validation Errors ({upload.errors.length})
            </h2>
            <ExportErrorsButton errors={upload.errors} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left border">Row #</th>
                  <th className="p-3 text-left border">Column</th>
                  <th className="p-3 text-left border">Error</th>
                </tr>
              </thead>

              <tbody>
                {upload.errors.map((error) => (
                  <tr key={error.id} className="border-b">
                    <td className="p-3 border">{error.rowNumber}</td>
                    <td className="p-3 border">{error.columnName}</td>
                    <td className="p-3 border text-red-600">{error.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="border rounded p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            No Validation Errors
          </h2>
          <p className="text-green-600">
            All rows were successfully validated.
          </p>
        </div>
      )}
    </main>
  );
}
