"use server";

import { deleteSource, updateSource } from "@/features/source-management/services/source.service";
import { getCurrentUser } from "@/lib/auth";
import { canUpdateSource } from "@/lib/permissions";

export async function deleteSourceAction(formData: FormData) {
  const sourceId = formData.get("sourceId") as string;

  if (!sourceId) {
    return { error: "Missing sourceId" };
  }

  try {
    await deleteSource(sourceId);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete source" };
  }
}

export async function updateSourceAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || !canUpdateSource(user)) {
    return { error: "Unauthorized" };
  }

  const sourceId = formData.get("sourceId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!sourceId || !name) {
    return { error: "Missing required fields" };
  }

  try {
    await updateSource(sourceId, name, description || undefined);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update source" };
  }
}
