import Link from "next/link"
import { ArrowLeft, Banknote, PiggyBank, Handshake, Shield, CreditCard } from "lucide-react"
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> 홈으로
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 ${cat?.iconBg} rounded-lg flex items-center justify-center ${cat?.color}`}>
          {CATEGORY_ICONS[category]}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{cat?.name || "금융상품"}</h1>
          <p className="text-sm text-gray-500">{cat?.description}</p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${category}/${product.id}`}
            className="block p-5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{product.institution}</p>
                <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-blue-600">{product.rate}</div>
                <div className="text-xs text-gray-400 mt-1">한도</div>
                <div className="text-xs text-gray-600">{product.limit.split("(")[0].trim()}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 py-12">해당 카테고리의 상품 정보를 준비 중입니다.</p>
      )}

      {guides.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">관련 가이드</h2>
          <div className="space-y-3">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.id}`}
                className="block p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
              >
                <h3 className="font-semibold text-sm text-gray-900">{guide.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{guide.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
