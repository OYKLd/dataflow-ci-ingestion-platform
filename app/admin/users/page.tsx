import { getUsers } from "@/features/auth/services/admin-user.service";
import { requireAdmin } from "@/lib/auth-server";


export default async function UsersPage() {
  const users = await getUsers();
    await requireAdmin();
    
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        User Management
      </h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="p-2 border">
              Email
            </th>

            <th className="p-2 border">
              Role
            </th>

            <th className="p-2 border">
              Created
            </th>
          </tr>
        </thead>

        <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                <td className="p-2 border">
                    {user.email}
                </td>

                <td className="p-2 border">
                    <select
                    defaultValue={user.role}
                    onChange={async (e) => {
                        await fetch("/api/admin/users", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            role: e.target.value,
                        }),
                        });

                        window.location.reload();
                    }}
                    className="border px-2 py-1"
                    >
                    <option value="ADMIN">ADMIN</option>
                    <option value="ANALYST">ANALYST</option>
                    <option value="VIEWER">VIEWER</option>
                    </select>
                </td>

                <td className="p-2 border">
                    {user.createdAt.toLocaleDateString()}
                </td>
                </tr>
            ))}
            </tbody>
      </table>
    </main>
  );
}