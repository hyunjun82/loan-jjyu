import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { CATEGORIES, PRODUCTS, getProductById } from "@/lib/data"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ category: p.category, id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { id } = await params
  const product = getProductById(id)
  return {
    title: product ? `${product.name} - 서민금융한눈에` : "상품 정보",
    description: product?.description,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = await params
  const product = getProductById(id)
  const cat = CATEGORIES.find((c) => c.slug === category)

  if (!product) notFound()

  const infoRows = [
    { label: "대상", value: product.target },
    { label: "금리", value: product.rate },
    { label: "한도", value: product.limit },
    { label: "기간", value: product.period },
    { label: "신청방법", value: product.howToApply },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href={`/products/${category}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> {cat?.name} 목록
      </Link>

      <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${cat?.bgColor} ${cat?.color} mb-3`}>
        {cat?.name}
      </span>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
      <p className="text-sm text-gray-500 mb-4">{product.institution}</p>
      <p className="text-gray-700 leading-relaxed">{product.description}</p>

      {/* Info Table */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg overflow-hidden">
        {infoRows.map((row) => (
          <div key={row.label} className="flex border-b border-gray-100 last:border-b-0">
            <div className="w-24 shrink-0 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
              {row.label}
            </div>
            <div className="px-4 py-3 text-sm text-gray-900 flex-1">{row.value}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mt-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">주요 특징</h2>
        <ul className="space-y-2">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
            #{tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 p-5 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="font-semibold text-blue-900 mb-1">신청 및 상담</p>
        <p className="text-sm text-blue-700 mb-3">{product.howToApply}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href="tel:1397"
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            1397 전화상담
          </a>
          <a
            href="https://www.kinfa.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            서민금융진흥원 <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
