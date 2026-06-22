import { CreateSourceForm } from "@/features/source-management/components/create-source-form";

export default function NewSourcePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Source
      </h1>

      <CreateSourceForm />
    </main>
  );
}