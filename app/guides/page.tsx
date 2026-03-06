import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { GUIDES, CATEGORIES } from "@/lib/data"

export const metadata = {
  title: "서민금융 가이드 - 서민금융한눈에",
  description: "서민금융 상품 비교, 신청 방법, 채무조정 등 실용적인 가이드를 제공합니다.",
}

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> 홈으로
      </Link>

      <h1 className="text-xl font-bold text-gray-900 mb-1">서민금융 가이드</h1>
      <p className="text-sm text-gray-500 mb-8">서민금융 상품 활용법과 금융 정보를 알기 쉽게 정리했습니다.</p>

      <div className="space-y-4">
        {GUIDES.map((guide) => {
          const cat = CATEGORIES.find((c) => c.slug === guide.category)
          return (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`}
              className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-gray-500" />
              </div>
              <div className="min-w-0">
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-1.5 ${cat?.bgColor} ${cat?.color}`}>
                  {cat?.name}
                </span>
                <h2 className="font-semibold text-gray-900">{guide.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{guide.summary}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {guide.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
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
