import { notFound } from "next/navigation";
import {
  getSourceById,
} from "@/features/source-management/services/source.service";
import {
  UploadForm,
} from "@/features/file-upload/components/upload-form";

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
        <p>
          {source.uploads.length} upload(s)
        </p>
      </div>

      <div className="mt-8">
        <UploadForm sourceId={source.id} />
      </div>
    </main>
  );
}
