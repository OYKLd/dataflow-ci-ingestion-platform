import { getSources } from "@/features/source-management/services/source.service";
import Link from "next/link";

export default async function SourcesPage() {
  const sources = await getSources();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Data Sources
      </h1>
        <div className="mb-6">
  <Link
    href="/sources/new"
    className="border rounded px-4 py-2"
  >
    New Source
  </Link> 
</div>
      {sources.length === 0 ? (
        <p>No sources found.</p>
      ) : (
        <div className="space-y-4">
          {sources.map((source) => (
            <Link
              key={source.id}
              href={`/sources/${source.id}`}
              className="block border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            >
              <h2 className="font-semibold">
                {source.name}
              </h2>

              <p>{source.description}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}