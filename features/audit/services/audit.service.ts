import { prisma } from "@/lib/prisma";

export async function createAuditLog(data: {
  action:
    | "CREATE_SOURCE"
    | "CREATE_SCHEMA"
    | "UPLOAD_FILE"
    | "CHANGE_ROLE";

  actorEmail?: string;

  entityId?: string;

  entityType?: string;

  metadata?: unknown;
}) {
  return prisma.auditLog.create({
    data: {
      action: data.action,
      actorEmail: data.actorEmail,
      entityId: data.entityId,
      entityType: data.entityType,
      metadata: data.metadata as any,
    },
  });
}

export async function getAuditLogs() {
  return prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
}