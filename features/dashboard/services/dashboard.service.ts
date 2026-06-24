import { prisma } from "@/lib/prisma";

const emptyDashboardStats = {
  totalUploads: 0,
  successfulUploads: 0,
  totalRowsProcessed: 0,
  activeSources: 0,
  uploads: [],
};

function logDashboardError(error: unknown) {
  console.error("Dashboard service failed to load data:", error);
}

export async function getDashboardStats() {
  try {
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
  } catch (error) {
    logDashboardError(error);
    return emptyDashboardStats;
  }
}

export async function getUploadsBySource() {
  try {
    const sources = await prisma.source.findMany({
      include: {
        uploads: true,
      },
    });

    return sources.map((source) => ({
      name: source.name,
      uploads: source.uploads.length,
    }));
  } catch (error) {
    logDashboardError(error);
    return [];
  }
}

export async function getStatusDistribution() {
  try {
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
  } catch (error) {
    logDashboardError(error);
    return [
      { name: "SUCCESS", value: 0 },
      { name: "PARTIAL", value: 0 },
      { name: "FAILED", value: 0 },
    ];
  }
}

export async function getRowsBySource() {
  try {
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
  } catch (error) {
    logDashboardError(error);
    return [];
  }
}