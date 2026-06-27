import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isValidPassword) {
    throw new Error("Invalid current password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
}

export async function resetUserPassword(
  userId: string,
  newPassword: string
) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
}
