import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/features/audit/services/audit.service";

export async function createUpload(
  sourceId: string,
  fileName: string,
  filePath: string
) {
  const upload = await prisma.fileUpload.create({
    data: {
      sourceId,
      fileName,
      filePath,
      status: "PENDING",
    },
  });

  await createAuditLog({
    action: "UPLOAD_FILE",
    entityId: upload.id,
    entityType: "FileUpload",
    metadata: {
      fileName,
    },
  });

  return upload;
}

export async function getUploadById(uploadId: string) {
  return prisma.fileUpload.findUnique({
    where: {
      id: uploadId,
    },
    select: {
      id: true,
      sourceId: true,
      fileName: true,
      status: true,
      totalRows: true,
      validRows: true,
      invalidRows: true,
      createdAt: true,
      updatedAt: true,
      filePath: true,
    },
  });
}

export async function updateUploadStats(
  uploadId: string,
  data: {
    status: "SUCCESS" | "PARTIAL" | "FAILED";
    totalRows: number;
    validRows: number;
    invalidRows: number;
  }
) {
  return prisma.fileUpload.update({
    where: {
      id: uploadId,
    },
    data,
  });
}

export async function createValidationErrors(
  uploadId: string,
  errors: {
    rowNumber: number;
    columnName: string;
    message: string;
  }[]
) {
  if (!errors.length) {
    return;
  }

  await prisma.validationError.createMany({
    data: errors.map((error) => ({
      uploadId,
      rowNumber: error.rowNumber,
      columnName: error.columnName,
      message: error.message,
    })),
  });
}

export async function getUploadReport(uploadId: string) {
  return prisma.fileUpload.findUnique({
    where: {
      id: uploadId,
    },
    include: {
      errors: true,
      source: true,
    },
  });
}

export async function getUploadsBySource(sourceId: string) {
  return prisma.fileUpload.findMany({
    where: {
      sourceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}