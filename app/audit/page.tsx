import { getAuditLogs } from "@/features/audit/services/audit.service";
import { getCurrentUser } from "@/lib/auth";
import { canViewAudit } from "@/lib/permissions";
import { redirect } from "next/navigation";

type AuditLog = {
  id: string;
  action: string;
  entityType: string | null;
  createdAt: Date;
};

export default async function AuditPage() {
  const user = await getCurrentUser();

  if (!user || !canViewAudit(user)) {
    redirect("/");
  }

  const logs: AuditLog[] = await getAuditLogs();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Audit Logs
      </h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Action</th>
            <th className="border p-2">Entity</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log: AuditLog) => (
            <tr key={log.id}>
              <td className="border p-2">
                {log.action}
              </td>

              <td className="border p-2">
                {log.entityType}
              </td>

              <td className="border p-2">
                {log.createdAt.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
