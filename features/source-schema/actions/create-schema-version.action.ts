"use server";

import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/features/audit/services/audit.service";

export async function createSchemaVersionAction(formData: FormData) {
  const sourceId = formData.get("sourceId") as string;
  const schemaJson = formData.get("schema") as string;

  if (!sourceId || !schemaJson) {
    return { error: "Missing fields" };
  }

  try {
    const schema = JSON.parse(schemaJson);
    const latestVersion = await prisma.schemaVersion.findFirst({
      where: {
        sourceId,
      },
      orderBy: {
        version: "desc",
      },
    });

    const nextVersion = (latestVersion?.version || 0) + 1;

    const schemaVersion = await prisma.schemaVersion.create({
      data: {
        sourceId,
        version: nextVersion,
        schema,
      },
    });

    await createAuditLog({
      action: "CREATE_SCHEMA",
      entityId: schemaVersion.id,
      entityType: "SchemaVersion",
      metadata: {
        version: nextVersion,
      },
    });

    return { success: true, schemaVersion };
  } catch (error) {
    return { error: "Failed to create schema" };
  }
}
