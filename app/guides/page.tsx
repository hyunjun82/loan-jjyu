import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { GUIDES, CATEGORIES } from "@/lib/data"

export const metadata = {
  title: "서민금융 가이드 - 서민금융한눈에",
  description: "서민금융 상품 비교, 신청 방법, 채무조정 등 실용적인 가이드를 제공합니다.",
}

export default function GuidesPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> 홈으로
      </Link>

      <div className="mb-10">
        <h1 className="text-xl font-bold text-gray-900">서민금융 가이드</h1>
        <p className="text-sm text-gray-500 mt-1">서민금융 상품 활용법과 금융 정보를 알기 쉽게 정리했습니다</p>
      </div>

      <div className="space-y-3">
        {GUIDES.map((guide) => {
          const cat = CATEGORIES.find((c) => c.slug === guide.category)
          return (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`}
              className="group bg-white rounded-2xl p-5 md:p-6 shadow-sm shadow-gray-200/50 border border-gray-100 card-hover flex gap-4 items-start"
            >
              <div className={`w-10 h-10 ${cat?.bgColor || "bg-gray-50"} rounded-xl flex items-center justify-center shrink-0`}>
                <BookOpen className={`w-5 h-5 ${cat?.color || "text-gray-500"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-md ${cat?.bgColor} ${cat?.color} mb-1.5`}>
                  {cat?.name}
                </span>
                <h2 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{guide.title}</h2>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{guide.summary}</p>
                <div className="flex gap-1.5 mt-3">
                  {guide.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
