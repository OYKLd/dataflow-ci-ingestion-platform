import { prisma } from "@/lib/prisma";

export async function createSource(
  name: string,
  description?: string
) {
  return prisma.source.create({
    data: {
      name,
      description,
    },
  });
}

export async function getSources() {
  return prisma.source.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}