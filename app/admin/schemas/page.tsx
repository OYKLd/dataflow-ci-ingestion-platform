"use client";

import { useEffect, useState } from "react";
import { prisma } from "@/lib/prisma";

type SchemaVersion = {
  id: string;
  version: number;
  createdAt: string;
  schema: any;
  source: {
    id: string;
    name: string;
  };
};

export default function SchemaVersionsPage() {
  const [schemas, setSchemas] = useState<SchemaVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      const response = await fetch("/api/admin/schemas");
      if (!response.ok) throw new Error("Failed to fetch schemas");
      const data = await response.json();
      setSchemas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch schemas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  // Group schemas by source
  const groupedSchemas = schemas.reduce((acc, schema) => {
    if (!acc[schema.source.id]) {
      acc[schema.source.id] = {
        sourceName: schema.source.name,
        versions: [],
      };
    }
    acc[schema.source.id].versions.push(schema);
    return acc;
  }, {} as Record<string, { sourceName: string; versions: SchemaVersion[] }>);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Schema Versions Management</h1>

      {Object.entries(groupedSchemas).map(([sourceId, { sourceName, versions }]) => (
        <div key={sourceId} className="mb-8 border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">{sourceName}</h2>
          <div className="space-y-2">
            {versions.sort((a, b) => b.version - a.version).map((schema) => (
              <div
                key={schema.id}
                className="flex items-center justify-between p-3 rounded border bg-gray-50"
              >
                <div>
                  <span className="font-medium">Version {schema.version}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {new Date(schema.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
