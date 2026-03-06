import { CATEGORIES } from "@/lib/api"
import CategoryPageClient from "./CategoryPageClient"

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }))
}

export function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  return params.then(({ category }) => {
    const cat = CATEGORIES.find((c) => c.slug === category)
    const name = cat?.name || "금융상품"
    return {
      title: `${name} - 서민금융한눈에`,
      description: `서민금융진흥원 ${name} 정보를 확인하세요.`,
    }
  })
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cat = CATEGORIES.find((c) => c.slug === category)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{cat?.icon || "📋"}</span>
          <h1 className="text-2xl font-bold text-gray-900">{cat?.name || "금융상품"}</h1>
        </div>
        <p className="text-gray-500">{cat?.description || "서민금융진흥원 금융상품 정보"}</p>
      </div>
      <CategoryPageClient category={category} />
    </div>
  )
}
