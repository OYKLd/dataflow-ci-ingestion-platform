import { getSources } from "@/features/source-management/services/source.service";
import Link from "next/link";
import { SourceActions } from "@/features/source-management/components/source-actions";
import { getCurrentUser } from "@/lib/auth";
import { canCreateSource } from "@/lib/permissions";

export const dynamic = 'force-dynamic';

export default async function SourcesPage() {
  const sources = await getSources();
  const user = await getCurrentUser();
  const canCreate = user && canCreateSource(user);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Data Sources
      </h1>
        {canCreate && (
        <div className="mb-6">
  <Link
    href="/sources/new"
    className="border rounded px-4 py-2"
  >
    New Source
  </Link> 
</div>
        )}
      {sources.length === 0 ? (
        <p>No sources found.</p>
      ) : (
        <div className="space-y-4">
          {sources.map((source) => (
            <div
              key={source.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <Link
                  href={`/sources/${source.id}`}
                  className="flex-1"
                >
                  <h2 className="font-semibold">
                    {source.name}
                  </h2>

                  <p>{source.description}</p>
                </Link>
                <SourceActions sourceId={source.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}