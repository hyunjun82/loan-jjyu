"use client";

export interface CostItem {
  name: string;
  value: number;
  color?: string;
}

const DEFAULT_COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#f59e0b", "#f97316", "#a78bfa"];

export function CostBreakdown({
  items,
  total,
  unit = "원",
}: {
  items: CostItem[];
  total?: string;
  unit?: string;
}) {
  const maxVal = Math.max(...items.map((i) => i.value));

  return (
    <div className="my-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b bg-gray-50 px-5 py-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-700">비용 구조</h4>
        {total && <span className="text-sm font-bold text-blue-700">합계 {total}</span>}
      </div>
      <div className="p-5 space-y-3">
        {items.map((item, i) => {
          const color = item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const pct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {item.value.toLocaleString()}{unit}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
