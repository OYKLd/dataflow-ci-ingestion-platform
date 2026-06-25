import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/features/audit/services/audit.service";

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateUserRole(
  userId: string,
  role: "ADMIN" | "ANALYST" | "VIEWER"
) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });

  await createAuditLog({
    action: "CHANGE_ROLE",
    entityId: user.id,
    entityType: "User",
    metadata: {
      role,
    },
  });

  return user;
}