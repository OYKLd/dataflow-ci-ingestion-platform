import { getUsers } from "@/features/auth/services/admin-user.service";
import { RoleSelect } from "@/components/role-select";
import { requireAdmin } from "@/lib/auth-server";
import { CreateUserForm } from "@/features/auth/components/create-user-form";
import { UserActions } from "@/features/auth/components/user-actions";
import { ResetPasswordButton } from "@/features/auth/components/reset-password-button";


export default async function UsersPage() {
  await requireAdmin();
  const users = await getUsers();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        User Management
      </h1>

      <div className="mb-8 border rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <CreateUserForm />
      </div>

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
              Status
            </th>

            <th className="p-2 border">
              Created
            </th>

            <th className="p-2 border">
              Actions
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
                    {user.active ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                </td>

                <td className="p-2 border">
                    {user.createdAt.toLocaleDateString()}
                </td>

                <td className="p-2 border">
                    <div className="flex space-x-2">
                        <UserActions userId={user.id} active={user.active} />
                        <ResetPasswordButton userId={user.id} userEmail={user.email} />
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
      </table>
    </main>
  );
}
