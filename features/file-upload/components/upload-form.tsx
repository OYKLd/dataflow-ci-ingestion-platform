"use client";

import { useState } from "react";
import { useUploadStatus } from "@/hooks/use-upload-status";

export function UploadForm({
  sourceId,
}: {
  sourceId: string;
}) {
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { status: uploadStatus, isLoading: isStatusLoading } = useUploadStatus(uploadId, !!uploadId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fileInput = event.currentTarget.querySelector<HTMLInputElement>(
      'input[name="file"]'
    );

    const file = fileInput?.files?.[0];
    if (!file) {
      setUploadError("Please select a file before uploading.");
      return;
    }

    console.log("UploadForm submitting file", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    setIsUploading(true);
    setUploadError(null);
    setUploadId(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let result;
      try {
        result = await response.json();
      } catch {
        setUploadError(`Error: ${response.status} ${response.statusText}`);
        setIsUploading(false);
        return;
      }
      setUploadError(`Error: ${result.error || response.statusText}`);
      setIsUploading(false);
      return;
    }

    const result = await response.json();
    setUploadId(result.uploadId);
    setIsUploading(false);
  }

  const getStatusMessage = () => {
    if (uploadError) return uploadError;
    if (isUploading) return "Uploading file...";
    if (!uploadId) return null;
    
    if (uploadStatus) {
      switch (uploadStatus.status) {
        case 'PENDING':
          return "File uploaded, waiting to be processed...";
        case 'PROCESSING':
          return "Processing file...";
        case 'SUCCESS':
          return `✅ File processed successfully! ${uploadStatus.validRows}/${uploadStatus.totalRows} rows valid (${uploadStatus.qualityScore}% quality)`;
        case 'PARTIAL':
          return `⚠️ File partially processed. ${uploadStatus.validRows}/${uploadStatus.totalRows} rows valid (${uploadStatus.invalidRows} errors)`;
        case 'FAILED':
          return "❌ File processing failed";
        default:
          return uploadStatus.status;
      }
    }
    
    return isStatusLoading ? "Checking status..." : null;
  };

  const isComplete = uploadStatus?.status === 'SUCCESS' || uploadStatus?.status === 'PARTIAL' || uploadStatus?.status === 'FAILED';

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded p-4 mt-8"
    >
      <input
        type="hidden"
        name="sourceId"
        value={sourceId}
      />
      <input
        type="file"
        name="file"
        accept=".csv,.xlsx"
        required
        disabled={isUploading || !!uploadId}
      />

      <button
        type="submit"
        className="border px-4 py-2 ml-4"
        disabled={isUploading || !!uploadId}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {getStatusMessage() && (
        <p className={`mt-4 text-sm ${
          uploadError ? 'text-red-600' : 
          uploadStatus?.status === 'SUCCESS' ? 'text-green-600' :
          uploadStatus?.status === 'FAILED' ? 'text-red-600' :
          uploadStatus?.status === 'PARTIAL' ? 'text-orange-600' :
          'text-gray-700'
        }`}>
          {getStatusMessage()}
        </p>
      )}

      {uploadId && uploadStatus && !isComplete && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '50%' }}></div>
          </div>
        </div>
      )}

      {isComplete && uploadId && (
        <a
          href={`/uploads/${uploadId}`}
          className="mt-4 inline-block text-blue-600 underline text-sm"
        >
          View detailed report
        </a>
      )}
    </form>
  );
}