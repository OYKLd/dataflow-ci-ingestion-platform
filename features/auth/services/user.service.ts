import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function createUser(
  email: string,
  password: string,
  role:
    | "ADMIN"
    | "ANALYST"
    | "VIEWER" = "VIEWER"
) {
  const hashedPassword =
    await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });
}

export async function getUserByEmail(
  email: string
) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}