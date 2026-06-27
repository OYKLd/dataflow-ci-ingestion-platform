"use client";

import { useState } from "react";
import { updateSourceAction } from "@/features/source-management/actions/source-actions.action";

type Props = {
  sourceId: string;
  name: string;
  description: string;
};

export function EditSourceForm({ sourceId, name, description }: Props) {
  const [formData, setFormData] = useState({
    name,
    description,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    const form = new FormData();
    form.append("sourceId", sourceId);
    form.append("name", formData.name);
    form.append("description", formData.description);

    try {
      const result = await updateSourceAction(form);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Source updated successfully");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update source");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded">
          {success}
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update Source
      </button>
    </form>
  );
}
