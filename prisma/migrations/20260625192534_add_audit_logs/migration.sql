-- CreateEnum
CREATE TYPE "public"."AuditAction" AS ENUM ('CREATE_SOURCE', 'CREATE_SCHEMA', 'UPLOAD_FILE', 'CHANGE_ROLE');

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "action" "public"."AuditAction" NOT NULL,
    "entityId" TEXT,
    "entityType" TEXT,
    "actorEmail" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
