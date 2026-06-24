import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const uploads = await prisma.fileUpload.findMany({
    include: {
      source: true,
    },
  });

  const totalUploads = uploads.length;

  const successfulUploads = uploads.filter(
    (upload) =>
      upload.status === "SUCCESS" ||
      upload.status === "PARTIAL"
  ).length;

  const totalRowsProcessed = uploads.reduce(
    (sum, upload) => sum + upload.totalRows,
    0
  );

  const activeSources = new Set(
    uploads.map((upload) => upload.sourceId)
  ).size;

  return {
    totalUploads,
    successfulUploads,
    totalRowsProcessed,
    activeSources,
    uploads,
  };
}