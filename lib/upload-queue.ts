import { processUpload } from '@/features/file-upload/services/process-upload.service';

interface QueueItem {
  uploadId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  addedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

class UploadQueue {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private maxConcurrent = 3; // Max 3 uploads en parallèle
  private currentProcessing = 0;

  add(uploadId: string): void {
    this.queue.push({
      uploadId,
      status: 'pending',
      addedAt: new Date(),
    });
    this.process();
  }

  private async process(): Promise<void> {
    if (this.isProcessing || this.currentProcessing >= this.maxConcurrent) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0 && this.currentProcessing < this.maxConcurrent) {
      const item = this.queue.find(i => i.status === 'pending');
      
      if (!item) {
        break;
      }

      item.status = 'processing';
      item.startedAt = new Date();
      this.currentProcessing++;

      // Process in background
      this.processItem(item).catch(error => {
        console.error('Error processing upload:', error);
      });
    }

    this.isProcessing = false;
  }

  private async processItem(item: QueueItem): Promise<void> {
    try {
      await processUpload(item.uploadId);
      item.status = 'completed';
      item.completedAt = new Date();
    } catch (error) {
      item.status = 'failed';
      item.error = error instanceof Error ? error.message : 'Unknown error';
      item.completedAt = new Date();
    } finally {
      this.currentProcessing--;
      
      // Remove completed items from queue after 5 minutes
      setTimeout(() => {
        const index = this.queue.indexOf(item);
        if (index > -1) {
          this.queue.splice(index, 1);
        }
      }, 5 * 60 * 1000);

      // Process next items
      this.process();
    }
  }

  getStatus(uploadId: string): QueueItem | undefined {
    return this.queue.find(item => item.uploadId === uploadId);
  }

  getAllStatuses(): QueueItem[] {
    return [...this.queue];
  }

  getQueueStats(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    total: number;
  } {
    return {
      pending: this.queue.filter(i => i.status === 'pending').length,
      processing: this.queue.filter(i => i.status === 'processing').length,
      completed: this.queue.filter(i => i.status === 'completed').length,
      failed: this.queue.filter(i => i.status === 'failed').length,
      total: this.queue.length,
    };
  }
}

// Singleton instance
export const uploadQueue = new UploadQueue();
