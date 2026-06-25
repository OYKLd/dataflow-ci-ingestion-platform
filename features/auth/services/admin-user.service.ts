import { prisma } from "@/lib/prisma";

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
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });
}