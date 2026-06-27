import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/features/audit/services/audit.service";

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

export async function getSourceById(id: string) {
  return prisma.source.findUnique({
    where: {
      id,
    },
    include: {
      schemas: true,
      uploads: true,
    },
  });
}

export async function updateSource(
  id: string,
  name: string,
  description?: string
) {
  const source = await prisma.source.update({
    where: {
      id,
    },
    data: {
      name,
      description,
    },
  });

  await createAuditLog({
    action: "CREATE_SOURCE",
    entityId: source.id,
    entityType: "Source",
    metadata: {
      name,
      description,
    },
  });

  return source;
}

export async function deleteSource(id: string) {
  const source = await prisma.source.delete({
    where: {
      id,
    },
  });

  await createAuditLog({
    action: "CREATE_SOURCE",
    entityId: source.id,
    entityType: "Source",
    metadata: {
      deleted: true,
    },
  });

  return source;
}