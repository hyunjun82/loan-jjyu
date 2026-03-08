import { ChevronRight, Landmark } from "lucide-react";
import type { LoanProductInfo } from "@/lib/types";

interface ProductInfoCardProps {
  info: LoanProductInfo;
}

export function ProductInfoCard({ info }: ProductInfoCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Landmark className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 mb-1.5">
            {info.category}
          </span>
          <h3 className="text-lg font-bold text-gray-900">{info.name}</h3>
          <p className="mt-0.5 text-sm text-gray-500 leading-relaxed">
            {info.description}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
          <p className="text-[11px] text-gray-400 mb-0.5">금리</p>
          <p className="text-sm font-bold text-blue-600">{info.interestRate}</p>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
          <p className="text-[11px] text-gray-400 mb-0.5">한도</p>
          <p className="text-sm font-bold text-gray-900">{info.limit}</p>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
          <p className="text-[11px] text-gray-400 mb-0.5">기간</p>
          <p className="text-sm font-bold text-gray-900">{info.period}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>{info.provider}</span>
        <span>{info.updatedAt} 기준</span>
      </div>

      <a
        href={info.ctaUrl}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
      >
        {info.ctaLabel}
        <ChevronRight className="h-4 w-4" />
      </a>
    </div>
  );
}
