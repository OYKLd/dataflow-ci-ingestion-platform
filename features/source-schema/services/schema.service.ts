import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SourceSchema } from "@/features/source-management/types/schema";

export async function createSchemaVersion(
  sourceId: string,
  schema: SourceSchema
) {
  const latestVersion =
    await prisma.schemaVersion.findFirst({
      where: {
        sourceId,
      },
      orderBy: {
        version: "desc",
      },
    });

  const nextVersion =
    latestVersion?.version
      ? latestVersion.version + 1
      : 1;

  return prisma.schemaVersion.create({
    data: {
      sourceId,
      version: nextVersion,
      schema: schema as unknown as Prisma.InputJsonValue,
    },
  });
}

export async function getLatestSchemaVersion(
  sourceId: string
) {
  return prisma.schemaVersion.findFirst({
    where: {
      sourceId,
    },
    orderBy: {
      version: "desc",
    },
  });
}