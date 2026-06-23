"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface RowsData {
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

interface RowsChartProps {
  data: RowsData[];
}

export function RowsChart({ data }: RowsChartProps) {
  return (
    <div className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Rows by Upload (Last 10)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fileName" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="validRows" fill="#10b981" />
          <Bar dataKey="invalidRows" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
