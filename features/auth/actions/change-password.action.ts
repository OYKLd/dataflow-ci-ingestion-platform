"use server";

import { changePassword } from "@/features/auth/services/password.service";

export async function changePasswordAction(formData: FormData) {
  const userId = formData.get("userId") as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!userId || !currentPassword || !newPassword) {
    return { error: "Missing fields" };
  }

  try {
    await changePassword(userId, currentPassword, newPassword);
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to change password" };
  }
}
