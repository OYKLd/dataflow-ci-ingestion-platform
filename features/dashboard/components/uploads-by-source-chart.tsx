"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface UploadsData {
  name: string;
  uploads: number;
}

interface UploadsChartProps {
  data: UploadsData[];
}

export function UploadsBySourceChart({ data }: UploadsChartProps) {
  return (
    <div className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Uploads by Source</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="uploads" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
