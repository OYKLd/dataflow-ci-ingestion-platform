"use client";

import { deleteSourceAction } from "@/features/source-management/actions/source-actions.action";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

type Props = {
  sourceId: string;
};

export function SourceActions({ sourceId }: Props) {
  const { data: session } = useSession();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this source? This will also delete all associated uploads and schemas. This action cannot be undone.")) {
      const formData = new FormData();
      formData.append("sourceId", sourceId);

      try {
        const result = await deleteSourceAction(formData);
        if (result.success) {
          window.location.href = "/sources";
        } else {
          alert(result.error || "Failed to delete source");
        }
      } catch (error) {
        alert("Failed to delete source");
      }
    }
  };

  if (session?.user?.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <button
      onClick={handleDelete}
      className="px-2 py-1 rounded text-sm bg-red-100 text-red-800 hover:bg-red-200"
    >
      Delete
    </button>
  );
}
