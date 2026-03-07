import type { LoanConditionRow } from "@/lib/types";

const TYPE_BADGE: Record<LoanConditionRow["type"], { label: string; color: string }> = {
  core: { label: "핵심조건", color: "bg-blue-100 text-blue-700" },
  eligibility: { label: "자격요건", color: "bg-emerald-100 text-emerald-700" },
  note: { label: "참고", color: "bg-gray-100 text-gray-600" },
};

interface LoanConditionTableProps {
  conditions: LoanConditionRow[];
  slug: string;
}

export function LoanConditionTable({ conditions, slug }: LoanConditionTableProps) {
  return (
    <section className="py-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{slug} 대출 조건 한눈에 보기</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-500 w-24">구분</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 w-32">항목</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">내용</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {conditions.map((row, i) => {
              const badge = TYPE_BADGE[row.type];
              return (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.label}</td>
                  <td className="px-4 py-3 text-gray-600">{row.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
