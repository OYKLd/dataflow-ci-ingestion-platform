interface DashboardCardsProps {
  totalSources: number;
  totalUploads: number;
  totalRows: number | null;
  validRows: number | null;
}

export function DashboardCards({
  totalSources,
  totalUploads,
  totalRows,
  validRows,
}: DashboardCardsProps) {
  const cards = [
    {
      title: "Total Sources",
      value: totalSources,
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Total Uploads",
      value: totalUploads,
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Total Rows",
      value: totalRows || 0,
      color: "bg-purple-50 border-purple-200",
    },
    {
      title: "Valid Rows",
      value: validRows || 0,
      color: "bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} border rounded-lg p-6`}
        >
          <p className="text-sm text-gray-600">{card.title}</p>
          <p className="text-3xl font-bold mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
