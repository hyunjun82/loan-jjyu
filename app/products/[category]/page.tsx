import Link from "next/link"
import { ArrowLeft, Banknote, PiggyBank, Handshake, Shield, CreditCard, ChevronRight, BookOpen } from "lucide-react"
import { CATEGORIES, getProductsByCategory, getGuidesByCategory } from "@/lib/data"

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  loan: <Banknote className="w-6 h-6" />,
  asset: <PiggyBank className="w-6 h-6" />,
  social: <Handshake className="w-6 h-6" />,
  guarantee: <Shield className="w-6 h-6" />,
  credit: <CreditCard className="w-6 h-6" />,
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cat = CATEGORIES.find((c) => c.slug === category)
  return {
    title: `${cat?.name || "금융상품"} - 서민금융한눈에`,
    description: cat?.description || "서민금융 상품 정보",
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cat = CATEGORIES.find((c) => c.slug === category)
  const products = getProductsByCategory(category)
  const guides = getGuidesByCategory(category)

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> 홈으로
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className={`w-12 h-12 ${cat?.iconBg} rounded-2xl flex items-center justify-center ${cat?.color}`}>
          {CATEGORY_ICONS[category]}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{cat?.name || "금융상품"}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{cat?.description} &middot; {products.length}개 상품</p>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${category}/${product.id}`}
            className="group bg-white rounded-2xl p-5 md:p-6 shadow-sm shadow-gray-200/50 border border-gray-100 card-hover block"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <span className="text-xs text-gray-400">{product.institution}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                <div>
                  <p className="text-[11px] text-gray-400">금리</p>
                  <p className="text-sm font-bold text-blue-600">{product.rate}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">한도</p>
                  <p className="text-xs font-medium text-gray-600">{product.limit.split("(")[0].split("/")[0].trim()}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors mt-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400">해당 카테고리의 상품 정보를 준비 중입니다.</p>
        </div>
      )}

      {/* Related Guides */}
      {guides.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-bold text-gray-900 mb-4">관련 가이드</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.id}`}
                className="group bg-white rounded-2xl p-5 shadow-sm shadow-gray-200/50 border border-gray-100 card-hover flex gap-4 items-start"
              >
                <div className={`w-10 h-10 ${cat?.bgColor || "bg-gray-50"} rounded-xl flex items-center justify-center shrink-0`}>
                  <BookOpen className={`w-5 h-5 ${cat?.color || "text-gray-500"}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{guide.title}</h3>
                  <p className="text-[13px] text-gray-500 mt-1 line-clamp-2">{guide.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
