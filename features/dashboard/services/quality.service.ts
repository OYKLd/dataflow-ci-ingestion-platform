import { prisma } from "@/lib/prisma";

export async function getQualityBySource() {
  const uploads =
    await prisma.fileUpload.findMany({
      include: {
        source: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  const grouped = new Map<
    string,
    {
      sourceName: string;
      total: number;
      success: number;
      failed: number;
      rows: number;
      invalidRows: number;
    }
  >();

  for (const upload of uploads) {
    const current =
      grouped.get(upload.sourceId) ?? {
        sourceName: upload.source.name,
        total: 0,
        success: 0,
        failed: 0,
        rows: 0,
        invalidRows: 0,
      };

    current.total++;

    if (upload.status === "SUCCESS") {
      current.success++;
    }

    if (
      upload.status === "FAILED" ||
      upload.status === "PARTIAL"
    ) {
      current.failed++;
    }

    current.rows += upload.totalRows;
    current.invalidRows += upload.invalidRows;

    grouped.set(upload.sourceId, current);
  }

  return Array.from(grouped.values()).map(
    (item) => ({
      ...item,
      successRate:
        item.total === 0
          ? 0
          : Math.round(
              (item.success / item.total) * 100
            ),

      errorRate:
        item.rows === 0
          ? 0
          : Math.round(
              (item.invalidRows / item.rows) * 100
            ),
    })
  );
}