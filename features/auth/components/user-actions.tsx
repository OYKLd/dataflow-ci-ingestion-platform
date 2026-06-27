"use client";

import { toggleUserActiveAction, deleteUserAction } from "@/features/auth/actions/user-actions.action";

type Props = {
  userId: string;
  active: boolean;
};

export function UserActions({ userId, active }: Props) {
  const handleToggleActive = async () => {
    if (confirm(`Are you sure you want to ${active ? "deactivate" : "activate"} this user?`)) {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("active", (!active).toString());

      try {
        const result = await toggleUserActiveAction(formData);
        if (result.success) {
          window.location.reload();
        } else {
          alert(result.error || "Failed to toggle user status");
        }
      } catch (error) {
        alert("Failed to toggle user status");
      }
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      const formData = new FormData();
      formData.append("userId", userId);

      try {
        const result = await deleteUserAction(formData);
        if (result.success) {
          window.location.reload();
        } else {
          alert(result.error || "Failed to delete user");
        }
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleToggleActive}
        className={`px-2 py-1 rounded text-sm ${
          active
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            : "bg-green-100 text-green-800 hover:bg-green-200"
        }`}
      >
        {active ? "Deactivate" : "Activate"}
      </button>
      <button
        onClick={handleDelete}
        className="px-2 py-1 rounded text-sm bg-red-100 text-red-800 hover:bg-red-200"
      >
        Delete
      </button>
    </div>
  );
}
