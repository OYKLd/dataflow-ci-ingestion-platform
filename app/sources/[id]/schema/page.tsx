import { notFound } from "next/navigation";
import { getSourceById } from "@/features/source-management/services/source.service";
import { CreateSchemaForm } from "@/features/source-schema/components/create-schema-form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CreateSchemaPage({ params }: Props) {
  const { id } = await params;
  const source = await getSourceById(id);

  if (!source) {
    notFound();
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Schema for {source.name}
      </h1>

      <div className="border rounded-lg p-6 max-w-2xl">
        <CreateSchemaForm sourceId={source.id} />
      </div>
    </main>
  );
}
