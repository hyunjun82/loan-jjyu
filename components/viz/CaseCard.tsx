import { Scale, ExternalLink } from "lucide-react";

export interface CaseItem {
  caseNumber: string;
  court: string;
  date: string;
  summary: string;
  result: string;
  resultType?: "win" | "lose" | "partial" | "neutral";
  url?: string;
}

const RESULT_STYLES: Record<string, { bg: string; text: string }> = {
  win: { bg: "bg-green-100", text: "text-green-700" },
  lose: { bg: "bg-red-100", text: "text-red-700" },
  partial: { bg: "bg-amber-100", text: "text-amber-700" },
  neutral: { bg: "bg-gray-100", text: "text-gray-700" },
};

export function CaseCard({ cases }: { cases: CaseItem[] }) {
  return (
    <div className="my-6 space-y-3">
      {cases.map((c, i) => {
        const style = RESULT_STYLES[c.resultType || "neutral"];
        return (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-sm transition-shadow"
          >
            {/* 상단 */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-fin-600" />
                <span className="text-xs font-medium text-gray-500">{c.court}</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-400">{c.date}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                {c.result}
              </span>
            </div>
            {/* 본문 */}
            <div className="px-5 py-4">
              <p className="text-xs font-medium text-gray-400 mb-1">{c.caseNumber}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{c.summary}</p>
              {c.url && (
                <a
                  href={c.url}
                  rel="noopener"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-fin-600 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  판례 원문 보기
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
