-- Migration: add_file_path
-- Adds `filePath` to FileUpload safely for existing rows.
-- Steps: add nullable column, backfill existing rows, set NOT NULL.

BEGIN;

ALTER TABLE "FileUpload" ADD COLUMN "filePath" TEXT;

-- Backfill existing rows with an empty string (adjust value if you prefer)
UPDATE "FileUpload" SET "filePath" = '' WHERE "filePath" IS NULL;

ALTER TABLE "FileUpload" ALTER COLUMN "filePath" SET NOT NULL;

COMMIT;
