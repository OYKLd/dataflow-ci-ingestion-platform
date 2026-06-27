import { notFound } from "next/navigation";
import { getSourceById } from "@/features/source-management/services/source.service";
import { EditSourceForm } from "@/features/source-management/components/edit-source-form";
import { getCurrentUser } from "@/lib/auth";
import { canUpdateSource } from "@/lib/permissions";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSourcePage({ params }: Props) {
  const user = await getCurrentUser();

  if (!user || !canUpdateSource(user)) {
    redirect("/sources");
  }

  const { id } = await params;
  const source = await getSourceById(id);

  if (!source) {
    notFound();
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Edit Source: {source.name}
      </h1>

      <EditSourceForm sourceId={source.id} name={source.name} description={source.description || ""} />
    </main>
  );
}
