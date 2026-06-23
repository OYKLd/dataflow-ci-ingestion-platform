"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface StatusData {
  status: string;
  count: number;
}

interface StatusChartProps {
  data: StatusData[];
}

const COLORS: { [key: string]: string } = {
  SUCCESS: "#10b981",
  FAILED: "#ef4444",
  PROCESSING: "#f59e0b",
  PENDING: "#6b7280",
  PARTIAL: "#f97316",
};

export function StatusChart({ data }: StatusChartProps) {
  return (
    <div className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Uploads by Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.status}`} fill={COLORS[entry.status] || "#8884d8"} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
