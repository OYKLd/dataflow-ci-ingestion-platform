"use server";

import { createUser } from "@/features/auth/services/user.service";
import { createAuditLog } from "@/features/audit/services/audit.service";

export async function createUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "ADMIN" | "ANALYST" | "VIEWER";

  if (!email || !password || !role) {
    return { error: "Missing fields" };
  }

  try {
    const user = await createUser(email, password, role);
    
    await createAuditLog({
      action: "CHANGE_ROLE",
      entityId: user.id,
      entityType: "User",
      metadata: {
        email,
        role,
      },
    });

    return { success: true, user };
  } catch (error) {
    return { error: "Failed to create user" };
  }
}
