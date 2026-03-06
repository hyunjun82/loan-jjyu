import Link from "next/link"
import { type FinanceProduct, categorizeProduct } from "@/lib/api"

const CATEGORY_LABELS: Record<string, string> = {
  loan: "대출",
  asset: "자산형성",
  social: "사회적금융",
  guarantee: "보증/보험",
  credit: "신용/채무",
}

const CATEGORY_COLORS: Record<string, string> = {
  loan: "bg-blue-50 text-blue-700",
  asset: "bg-green-50 text-green-700",
  social: "bg-purple-50 text-purple-700",
  guarantee: "bg-amber-50 text-amber-700",
  credit: "bg-rose-50 text-rose-700",
}

export default function ProductCard({ product, index }: { product: FinanceProduct; index: number }) {
  const category = categorizeProduct(product)
  const name = product["상품명"] || "상품명 없음"
  const company = product["금융회사명"] || product["취급기관"] || ""
  const target = product["대출대상"] || product["지원대상"] || product["신청자격"] || ""
  const rate = product["대출금리"] || ""
  const limit = product["대출한도"] || ""

  return (
    <Link
      href={`/products/${category}?item=${index}`}
      className="group block p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-2 ${CATEGORY_COLORS[category] || "bg-gray-50 text-gray-700"}`}>
            {CATEGORY_LABELS[category] || category}
          </span>
          <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          {company && (
            <p className="text-sm text-gray-500 mb-2">{company}</p>
          )}
          {target && (
            <p className="text-sm text-gray-600 line-clamp-2">{target}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          {rate && (
            <div className="text-sm font-semibold text-blue-600">{rate}</div>
          )}
          {limit && (
            <div className="text-xs text-gray-500 mt-1">{limit}</div>
          )}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">서민금융진흥원</span>
        <span className="text-xs text-blue-600 group-hover:underline">상세보기 →</span>
      </div>
    </Link>
  )
}
