"use client";

import { useState } from "react";
import { createSchemaVersionAction } from "@/features/source-schema/actions/create-schema-version.action";

type Column = {
  name: string;
  type: string;
  required: boolean;
};

type Props = {
  sourceId: string;
};

export function CreateSchemaForm({ sourceId }: Props) {
  const [columns, setColumns] = useState<Column[]>([
    { name: "", type: "string", required: false },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addColumn = () => {
    setColumns([...columns, { name: "", type: "string", required: false }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: keyof Column, value: any) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validColumns = columns.filter((col) => col.name.trim());

    if (validColumns.length === 0) {
      setError("At least one column is required");
      return;
    }

    const formData = new FormData();
    formData.append("sourceId", sourceId);
    formData.append("schema", JSON.stringify({ columns: validColumns }));

    try {
      const result = await createSchemaVersionAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Schema created successfully");
        setColumns([{ name: "", type: "string", required: false }]);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create schema");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        {columns.map((column, index) => (
          <div key={index} className="flex gap-2 items-center border p-3 rounded">
            <input
              type="text"
              placeholder="Column name"
              value={column.name}
              onChange={(e) => updateColumn(index, "name", e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              required
            />
            <select
              value={column.type}
              onChange={(e) => updateColumn(index, "type", e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="boolean">Boolean</option>
              <option value="email">Email</option>
            </select>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={column.required}
                onChange={(e) => updateColumn(index, "required", e.target.checked)}
              />
              Required
            </label>
            {columns.length > 1 && (
              <button
                type="button"
                onClick={() => removeColumn(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addColumn}
        className="text-blue-600 hover:text-blue-800"
      >
        + Add Column
      </button>

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
        Create Schema
      </button>
    </form>
  );
}
