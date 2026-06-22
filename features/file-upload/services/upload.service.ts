import { prisma } from "@/lib/prisma";

export async function createUpload(
  sourceId: string,
  fileName: string,
  filePath: string
) {
  return prisma.fileUpload.create({
    data: {
      sourceId,
      fileName,
      filePath,
      status: "PENDING",
    },
  });
}