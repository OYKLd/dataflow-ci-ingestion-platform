import { notFound } from "next/navigation";
import {
  getSourceById,
} from "@/features/source-management/services/source.service";
import {
  UploadForm,
} from "@/features/file-upload/components/upload-form";
import { getCurrentUser } from "@/lib/auth";
import { canUpload } from "@/lib/permissions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SourceDetailsPage(
  { params }: Props
) {
  const { id } = await params;
  const source = await getSourceById(id);

  if (!source) {
    notFound();
  }
  const user = await getCurrentUser();
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        {source.name}
      </h1>
      <p className="mt-2">
        {source.description}
      </p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">
          Schema Versions
        </h2>
        <p>
          {source.schemas.length} version(s)
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">
          Uploads
        </h2>
        <p className="mb-4">
          {source.uploads.length} upload(s)
        </p>
        <div className="space-y-3">
          {source.uploads.map((upload) => (
            <div
              key={upload.id}
              className="border rounded p-3"
            >
              <p>
                <strong>File:</strong>{" "}
                {upload.fileName}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {upload.status}
              </p>
              <p>
                <strong>Total Rows:</strong>{" "}
                {upload.totalRows}
              </p>
              <a
                href={`/uploads/${upload.id}`}
                className="text-blue-600 underline"
              >
                View Report
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border p-4">
        <UploadForm sourceId={source.id} />
      </div>
    </main>
  );
}
