import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUpload, getUploadById, updateUploadStats, createValidationErrors } from './upload.service';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    fileUpload: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    validationError: {
      createMany: vi.fn(),
    },
  },
}));

// Mock audit service
vi.mock('@/features/audit/services/audit.service', () => ({
  createAuditLog: vi.fn(),
}));

import { prisma } from '@/lib/prisma';

describe('Upload Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUpload', () => {
    it('should create an upload with PENDING status', async () => {
      const mockUpload = {
        id: 'upload-123',
        sourceId: 'source-456',
        fileName: 'test.csv',
        filePath: '/uploads/test.csv',
        status: 'PENDING',
      };

      (prisma.fileUpload.create as any).mockResolvedValue(mockUpload);

      const result = await createUpload('source-456', 'test.csv', '/uploads/test.csv');

      expect(prisma.fileUpload.create).toHaveBeenCalledWith({
        data: {
          sourceId: 'source-456',
          fileName: 'test.csv',
          filePath: '/uploads/test.csv',
          status: 'PENDING',
        },
      });
      expect(result).toEqual(mockUpload);
    });
  });

  describe('getUploadById', () => {
    it('should return upload by id with selected fields', async () => {
      const mockUpload = {
        id: 'upload-123',
        sourceId: 'source-456',
        fileName: 'test.csv',
        status: 'SUCCESS',
        totalRows: 100,
        validRows: 95,
        invalidRows: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        filePath: '/uploads/test.csv',
      };

      (prisma.fileUpload.findUnique as any).mockResolvedValue(mockUpload);

      const result = await getUploadById('upload-123');

      expect(prisma.fileUpload.findUnique).toHaveBeenCalledWith({
        where: { id: 'upload-123' },
        select: {
          id: true,
          sourceId: true,
          fileName: true,
          status: true,
          totalRows: true,
          validRows: true,
          invalidRows: true,
          createdAt: true,
          updatedAt: true,
          filePath: true,
        },
      });
      expect(result).toEqual(mockUpload);
    });

    it('should return null if upload not found', async () => {
      (prisma.fileUpload.findUnique as any).mockResolvedValue(null);

      const result = await getUploadById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('updateUploadStats', () => {
    it('should update upload statistics', async () => {
      const mockUpdatedUpload = {
        id: 'upload-123',
        status: 'SUCCESS',
        totalRows: 100,
        validRows: 100,
        invalidRows: 0,
        qualityScore: 100,
      };

      (prisma.fileUpload.update as any).mockResolvedValue(mockUpdatedUpload);

      const result = await updateUploadStats('upload-123', {
        status: 'SUCCESS',
        totalRows: 100,
        validRows: 100,
        invalidRows: 0,
        qualityScore: 100,
      });

      expect(prisma.fileUpload.update).toHaveBeenCalledWith({
        where: { id: 'upload-123' },
        data: {
          status: 'SUCCESS',
          totalRows: 100,
          validRows: 100,
          invalidRows: 0,
          qualityScore: 100,
        },
      });
      expect(result).toEqual(mockUpdatedUpload);
    });

    it('should handle PARTIAL status', async () => {
      const mockUpdatedUpload = {
        id: 'upload-123',
        status: 'PARTIAL',
        totalRows: 100,
        validRows: 80,
        invalidRows: 20,
        qualityScore: 80,
      };

      (prisma.fileUpload.update as any).mockResolvedValue(mockUpdatedUpload);

      await updateUploadStats('upload-123', {
        status: 'PARTIAL',
        totalRows: 100,
        validRows: 80,
        invalidRows: 20,
        qualityScore: 80,
      });

      expect(prisma.fileUpload.update).toHaveBeenCalledWith({
        where: { id: 'upload-123' },
        data: {
          status: 'PARTIAL',
          totalRows: 100,
          validRows: 80,
          invalidRows: 20,
          qualityScore: 80,
        },
      });
    });

    it('should handle FAILED status', async () => {
      const mockUpdatedUpload = {
        id: 'upload-123',
        status: 'FAILED',
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        qualityScore: 0,
      };

      (prisma.fileUpload.update as any).mockResolvedValue(mockUpdatedUpload);

      await updateUploadStats('upload-123', {
        status: 'FAILED',
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        qualityScore: 0,
      });

      expect(prisma.fileUpload.update).toHaveBeenCalledWith({
        where: { id: 'upload-123' },
        data: {
          status: 'FAILED',
          totalRows: 0,
          validRows: 0,
          invalidRows: 0,
          qualityScore: 0,
        },
      });
    });
  });

  describe('createValidationErrors', () => {
    it('should create validation errors', async () => {
      const errors = [
        {
          rowNumber: 1,
          columnName: 'date',
          message: 'Invalid date',
        },
        {
          rowNumber: 2,
          columnName: 'montant',
          message: 'Must be an integer',
        },
      ];

      (prisma.validationError.createMany as any).mockResolvedValue({ count: 2 });

      await createValidationErrors('upload-123', errors);

      expect(prisma.validationError.createMany).toHaveBeenCalledWith({
        data: [
          {
            uploadId: 'upload-123',
            rowNumber: 1,
            columnName: 'date',
            message: 'Invalid date',
          },
          {
            uploadId: 'upload-123',
            rowNumber: 2,
            columnName: 'montant',
            message: 'Must be an integer',
          },
        ],
      });
    });

    it('should not call createMany if errors array is empty', async () => {
      await createValidationErrors('upload-123', []);

      expect(prisma.validationError.createMany).not.toHaveBeenCalled();
    });

    it('should handle single error', async () => {
      const errors = [
        {
          rowNumber: 5,
          columnName: 'region',
          message: 'Value must be one of the allowed options',
        },
      ];

      (prisma.validationError.createMany as any).mockResolvedValue({ count: 1 });

      await createValidationErrors('upload-123', errors);

      expect(prisma.validationError.createMany).toHaveBeenCalledWith({
        data: [
          {
            uploadId: 'upload-123',
            rowNumber: 5,
            columnName: 'region',
            message: 'Value must be one of the allowed options',
          },
        ],
      });
    });
  });
});
