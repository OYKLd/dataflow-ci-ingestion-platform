import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [totalSources, totalUploads, uploadsByStatus, rowsStats] = await Promise.all([
    prisma.source.count(),
    prisma.fileUpload.count(),
    prisma.fileUpload.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.fileUpload.aggregate({
      _sum: {
        totalRows: true,
        validRows: true,
        invalidRows: true,
      },
    }),
  ]);

  return {
    totalSources,
    totalUploads,
    uploadsByStatus,
    rowsStats,
  };
}

export async function getUploadsBySourceChart() {
  const data = await prisma.source.findMany({
    include: {
      _count: {
        select: { uploads: true },
      },
    },
  });

  return data.map((source) => ({
    name: source.name,
    uploads: source._count.uploads,
  }));
}

export async function getStatusChartData() {
  const data = await prisma.fileUpload.groupBy({
    by: ["status"],
    _count: true,
  });

  return data.map((item) => ({
    status: item.status,
    count: item._count,
  }));
}

export async function getRowsChartData() {
  const data = await prisma.fileUpload.findMany({
    select: {
      fileName: true,
      totalRows: true,
      validRows: true,
      invalidRows: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return data.map((item) => ({
    fileName: item.fileName,
    totalRows: item.totalRows,
    validRows: item.validRows,
    invalidRows: item.invalidRows,
  }));
}
