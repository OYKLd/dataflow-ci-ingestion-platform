import { useState, useEffect } from 'react';

interface UploadStatus {
  uploadId: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'PARTIAL' | 'FAILED';
  totalRows: number;
  validRows: number;
  invalidRows: number;
  qualityScore: number;
  queueStatus: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    addedAt: string;
    startedAt?: string;
    completedAt?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export function useUploadStatus(uploadId: string | null, enabled = true) {
  const [status, setStatus] = useState<UploadStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadId || !enabled) {
      return;
    }

    let intervalId: NodeJS.Timeout;
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/upload/${uploadId}/status`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch upload status');
        }

        const data = await response.json();
        
        if (isMounted) {
          setStatus(data);
          setError(null);
        }

        // Stop polling if upload is completed (SUCCESS, PARTIAL, or FAILED)
        if (data.status === 'SUCCESS' || data.status === 'PARTIAL' || data.status === 'FAILED') {
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every 2 seconds
    intervalId = setInterval(fetchStatus, 2000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [uploadId, enabled]);

  return { status, isLoading, error };
}
