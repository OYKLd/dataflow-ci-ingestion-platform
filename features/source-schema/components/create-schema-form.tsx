"use client";

import { useState } from "react";
import { createSchemaVersionAction } from "@/features/source-schema/actions/create-schema-version.action";

type Props = {
  sourceId: string;
};

export function CreateSchemaForm({ sourceId }: Props) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    formData.append("sourceId", sourceId);

    const schemaText = formData.get("schemaText") as string;
    const schemaFile = formData.get("schemaFile") as File;

    let schema: any;

    if (schemaFile && schemaFile.size > 0) {
      // Parse uploaded JSON file
      try {
        const text = await schemaFile.text();
        schema = JSON.parse(text);
      } catch (err) {
        setError("Invalid JSON file");
        return;
      }
    } else if (schemaText && schemaText.trim()) {
      // Parse manually entered JSON
      try {
        schema = JSON.parse(schemaText);
      } catch (err) {
        setError("Invalid JSON format");
        return;
      }
    } else {
      setError("Please provide a schema (JSON text or file)");
      return;
    }

    // Validate schema structure - accept both formats:
    // 1. Simple: { "columns": [...] }
    // 2. Complete: { "schema": { "columns": [...] } }
    let schemaColumns = schema.columns;
    if (!schemaColumns && schema.schema && schema.schema.columns) {
      schemaColumns = schema.schema.columns;
    }

    if (!schemaColumns || !Array.isArray(schemaColumns)) {
      setError("Schema must have a 'columns' array (either directly or in schema.columns)");
      return;
    }

    // Use the columns array for the schema version
    const schemaToSave = { columns: schemaColumns };
    formData.append("schema", JSON.stringify(schemaToSave));

    try {
      const result = await createSchemaVersionAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Schema created successfully");
        e.currentTarget?.reset();
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create schema");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {/* JSON MANUEL */}
      <div>
        <label className="block mb-1">
          Schema (écriture manuelle JSON)
        </label>

        <textarea
          name="schemaText"
          rows={12}
          className="border p-2 w-full font-mono"
          placeholder={`{
  "schema": {
    "columns": [
      {
        "name": "column_name",
        "type": "string",
        "required": true
      }
    ]
  }
}`}
        />
      </div>

      {/* FILE UPLOAD */}
      <div>
        <label className="block mb-1">
          Ou importer un fichier JSON
        </label>

        <input
          type="file"
          name="schemaFile"
          accept="application/json,.json"
          className="w-full border p-2"
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
        Create Schema
      </button>
    </form>
  );
}
