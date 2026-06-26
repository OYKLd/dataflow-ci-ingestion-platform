import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function createInvitation(
  email: string,
  role: "ADMIN" | "ANALYST" | "VIEWER"
) {
  const token = randomUUID();

  return prisma.invitation.create({
    data: {
      email,
      role,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    },
  });
}