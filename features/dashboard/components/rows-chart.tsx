"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function RowsChart({
  data,
}: {
  data: {
    name: string;
    rows: number;
  }[];
}) {
  return (
    <div className="border rounded p-4">
      <h2 className="font-semibold mb-4">
        Valid Rows by Source
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="rows" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}