import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PasswordChangeForm } from "@/features/auth/components/password-change-form";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="border rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Created:</strong> {user.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-8 border rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <PasswordChangeForm userId={user.id} />
      </div>
    </main>
  );
}
