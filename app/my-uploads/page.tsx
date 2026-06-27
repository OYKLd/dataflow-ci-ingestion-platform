import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUploadsByUser } from "@/features/file-upload/services/upload.service";
import Link from "next/link";

export default async function MyUploadsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const uploads = await getUploadsByUser(user.email);

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
        My Upload History
      </h1>

      {uploads.length === 0 ? (
        <div className="border rounded-lg p-8 bg-gray-50">
          <p className="text-gray-600">
            You haven't uploaded any files yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {uploads.map((upload) => {
            const errorRate = upload.totalRows > 0 
              ? Math.round((upload.invalidRows / upload.totalRows) * 100) 
              : 0;

            return (
              <div
                key={upload.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">
                      {upload.fileName}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Source: {upload.source.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Uploaded: {upload.createdAt.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex space-x-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{upload.totalRows}</p>
                      <p className="text-gray-600">Total</p>
                    </div>
                    <div className="text-center text-green-600">
                      <p className="font-semibold">{upload.validRows}</p>
                      <p className="text-gray-600">Valid</p>
                    </div>
                    <div className="text-center text-red-600">
                      <p className="font-semibold">{upload.invalidRows}</p>
                      <p className="text-gray-600">Invalid</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      upload.status === "SUCCESS"
                        ? "bg-green-100 text-green-800"
                        : upload.status === "FAILED"
                        ? "bg-red-100 text-red-800"
                        : upload.status === "PARTIAL"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {upload.status}
                  </span>

                  <span className="text-sm text-gray-600">
                    Error Rate: {errorRate}%
                  </span>

                  <Link
                    href={`/uploads/${upload.id}`}
                    className="text-blue-600 underline text-sm"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
