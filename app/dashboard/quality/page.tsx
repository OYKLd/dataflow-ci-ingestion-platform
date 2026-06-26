import { getQualityBySource } from "@/features/dashboard/services/quality.service";

export default async function QualityPage() {
  const sources =
    await getQualityBySource();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Data Quality Monitoring
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">
              Source
            </th>

            <th className="p-2 text-left">
              Uploads
            </th>

            <th className="p-2 text-left">
              Success Rate
            </th>

            <th className="p-2 text-left">
              Error Rate
            </th>
          </tr>
        </thead>

        <tbody>
          {sources.map((source) => (
            <tr
              key={source.sourceName}
              className="border-b"
            >
              <td className="p-2">
                {source.sourceName}
              </td>

              <td className="p-2">
                {source.total}
              </td>

              <td className="p-2">
                {source.successRate}%
              </td>

              <td className="p-2">
                {source.errorRate}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}