"use server";

import { resetUserPassword } from "@/features/auth/services/password.service";

export async function resetPasswordAction(formData: FormData) {
  const userId = formData.get("userId") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!userId || !newPassword) {
    return { error: "Missing fields" };
  }

  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    await resetUserPassword(userId, newPassword);
    return { success: true };
  } catch (error) {
    return { error: "Failed to reset password" };
  }
}
