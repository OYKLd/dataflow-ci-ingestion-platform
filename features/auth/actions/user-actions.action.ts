"use server";

import { toggleUserActive, deleteUser } from "@/features/auth/services/admin-user.service";

export async function toggleUserActiveAction(formData: FormData) {
  const userId = formData.get("userId") as string;
  const active = formData.get("active") === "true";

  if (!userId) {
    return { error: "Missing userId" };
  }

  try {
    await toggleUserActive(userId, active);
    return { success: true };
  } catch (error) {
    return { error: "Failed to toggle user status" };
  }
}

export async function deleteUserAction(formData: FormData) {
  const userId = formData.get("userId") as string;

  if (!userId) {
    return { error: "Missing userId" };
  }

  try {
    await deleteUser(userId);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete user" };
  }
}
