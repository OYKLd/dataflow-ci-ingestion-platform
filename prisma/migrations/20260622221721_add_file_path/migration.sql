/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `SchemaVersion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sourceId,version]` on the table `SchemaVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."SchemaVersion" DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "SchemaVersion_sourceId_version_key" ON "public"."SchemaVersion"("sourceId", "version");
