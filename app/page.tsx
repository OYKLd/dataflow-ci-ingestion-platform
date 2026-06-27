import Link from "next/link";
import {
  getDashboardStats,
  getUploadsBySource,
  getStatusDistribution,
  getRowsBySource,
} from "@/features/dashboard/services/dashboard.service";
import { UploadsBySourceChart } from "@/features/dashboard/components/uploads-by-source-chart";
import { StatusChart } from "@/features/dashboard/components/status-chart";
import { RowsChart } from "@/features/dashboard/components/rows-chart";

export default async function Home() {
  const stats = await getDashboardStats();
  const uploadsBySource = await getUploadsBySource();
  const statusDistribution = await getStatusDistribution();
  const rowsBySource = await getRowsBySource();

  const successRate =
    stats.totalUploads === 0
      ? 0
      : Math.round(
          (stats.successfulUploads /
            stats.totalUploads) *
            100
        );

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        DataFlow CI Dashboard
      </h1>
      
      <div className="mb-8 flex gap-4 flex-wrap">
        <Link
          href="/sources"
          className="border rounded px-4 py-2 bg-blue-50 hover:bg-blue-100"
        >
          Sources
        </Link>
        <Link
          href="/dashboard/quality"
          className="border rounded px-4 py-2 bg-green-50 hover:bg-green-100"
        >
          Quality Monitoring
        </Link>
        <Link
          href="/audit"
          className="border rounded px-4 py-2 bg-orange-50 hover:bg-orange-100"
        >
          Audit Logs
        </Link>
        <Link
          href="/admin/users"
          className="border rounded px-4 py-2 bg-purple-50 hover:bg-purple-100"
        >
          User Management
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded p-4">
          <h2 className="font-semibold">
            Total Uploads
          </h2>

          <p className="text-3xl">
            {stats.totalUploads}
          </p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold">
            Success Rate
          </h2>

          <p className="text-3xl">
            {successRate}%
          </p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold">
            Active Sources
          </h2>

          <p className="text-3xl">
            {stats.activeSources}
          </p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold">
            Rows Processed
          </h2>

          <p className="text-3xl">
            {stats.totalRowsProcessed}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <UploadsBySourceChart data={uploadsBySource} />
        <StatusChart data={statusDistribution} />
        <RowsChart data={rowsBySource} />
      </div>

      <div className="border rounded p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Uploads
        </h2>

        <div className="space-y-3">
          {stats.uploads.map((upload) => (
            <div
              key={upload.id}
              className="border rounded p-3"
            >
              <div>
                <strong>
                  {upload.fileName}
                </strong>
              </div>

              <div>
                Status: {upload.status}
              </div>

              <div>
                Source: {upload.source.name}
              </div>

              <Link
                href={`/uploads/${upload.id}`}
                className="text-blue-600 underline"
              >
                View Report
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
