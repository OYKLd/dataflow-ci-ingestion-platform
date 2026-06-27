import { CreateSourceForm } from "@/features/source-management/components/create-source-form";
import { requireAdmin } from "@/lib/auth-server";

export default async function NewSourcePage() {
  await requireAdmin();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Source
      </h1>

      <CreateSourceForm />
    </main>
  );
}