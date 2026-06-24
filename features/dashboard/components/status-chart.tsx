"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function StatusChart({
  data,
}: {
  data: {
    name: string;
    value: number;
  }[];
}) {
  return (
    <div className="border rounded p-4">
      <h2 className="font-semibold mb-4">
        Upload Status Distribution
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
          />

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}