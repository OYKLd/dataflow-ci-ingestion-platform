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

export async function getUploadsBySource() {
  const sources = await prisma.source.findMany({
    include: {
      uploads: true,
    },
  });

  return sources.map((source) => ({
    name: source.name,
    uploads: source.uploads.length,
  }));
}

export async function getStatusDistribution() {
  const uploads = await prisma.fileUpload.findMany();

  const success = uploads.filter(
    (u) => u.status === "SUCCESS"
  ).length;

  const partial = uploads.filter(
    (u) => u.status === "PARTIAL"
  ).length;

  const failed = uploads.filter(
    (u) => u.status === "FAILED"
  ).length;

  return [
    {
      name: "SUCCESS",
      value: success,
    },
    {
      name: "PARTIAL",
      value: partial,
    },
    {
      name: "FAILED",
      value: failed,
    },
  ];
}

export async function getRowsBySource() {
  const sources = await prisma.source.findMany({
    include: {
      uploads: true,
    },
  });

  return sources.map((source) => ({
    name: source.name,
    rows: source.uploads.reduce(
      (sum, upload) => sum + upload.validRows,
      0
    ),
  }));
}