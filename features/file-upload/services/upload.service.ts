import { prisma } from "@/lib/prisma";

export async function createUpload(
  sourceId: string,
  fileName: string
) {
  return prisma.fileUpload.create({
    data: {
      sourceId,
      fileName,
      status: "PENDING",
    },
  });
}