"use client";

export interface StatItem {
  value: string;
  label: string;
  sub?: string;
}

export function StatCard({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
      {items.map((item, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
          <p className="text-2xl font-extrabold text-blue-700 tracking-tight sm:text-3xl">
            {item.value}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-700">{item.label}</p>
          {item.sub && (
            <p className="mt-0.5 text-xs text-gray-400">{item.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
