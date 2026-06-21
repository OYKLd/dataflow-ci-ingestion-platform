import { getSources } from "@/features/source-management/services/source.service";

export default async function SourcesPage() {
  const sources = await getSources();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Data Sources
      </h1>

      {sources.length === 0 ? (
        <p>No sources found.</p>
      ) : (
        <ul className="space-y-4">
          {sources.map((source) => (
            <li
              key={source.id}
              className="border rounded-lg p-4"
            >
              <h2 className="font-semibold">
                {source.name}
              </h2>

              <p>{source.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}