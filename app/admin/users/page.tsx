import { getUsers } from "@/features/auth/services/admin-user.service";
import { RoleSelect } from "@/components/role-select";
import { requireAdmin } from "@/lib/auth-server";


export default async function UsersPage() {
  await requireAdmin();
  const users = await getUsers();
    
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
                    <RoleSelect userId={user.id} currentRole={user.role} />
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


