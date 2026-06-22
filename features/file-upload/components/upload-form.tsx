"use client";

import { useState } from "react";

export function UploadForm({
  sourceId,
}: {
  sourceId: string;
}) {
  const [status, setStatus] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fileInput = event.currentTarget.querySelector<HTMLInputElement>(
      'input[name="file"]'
    );

    const file = fileInput?.files?.[0];
    if (!file || !file.name) {
      setStatus("Please select a file before uploading.");
      return;
    }

    setStatus("Uploading...");

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
        setStatus(`Error: ${response.status} ${response.statusText}`);
        return;
      }
      setStatus(`Error: ${result.error || response.statusText}`);
      return;
    }

    const result = await response.json();
    setStatus(`Uploaded ${result.rowCount} rows`);
  }

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
      />

      <button
        type="submit"
        className="border px-4 py-2 ml-4"
      >
        Upload
      </button>

      {status && (
        <p className="mt-4 text-sm text-gray-700">{status}</p>
      )}
    </form>
  );
}