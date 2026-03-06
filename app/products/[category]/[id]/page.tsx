import Link from "next/link"
import { ArrowLeft, ExternalLink, Phone, CheckCircle } from "lucide-react"
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
    { label: "금리", value: product.rate, highlight: true },
    { label: "한도", value: product.limit },
    { label: "기간", value: product.period },
    { label: "신청방법", value: product.howToApply },
  ]

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <Link
        href={`/products/${category}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {cat?.name} 목록
      </Link>

      {/* Header */}
      <div className="mb-8">
        <span className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-lg ${cat?.bgColor} ${cat?.color} mb-4`}>
          {cat?.name}
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">{product.name}</h1>
        <p className="text-sm text-gray-400">{product.institution}</p>
        <p className="text-gray-600 leading-relaxed mt-4">{product.description}</p>
      </div>

      {/* Key Numbers */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-blue-50 rounded-2xl p-5">
          <p className="text-xs text-blue-500 font-medium mb-1">금리</p>
          <p className="text-lg font-bold text-blue-700">{product.rate}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-5">
          <p className="text-xs text-gray-500 font-medium mb-1">한도</p>
          <p className="text-lg font-bold text-gray-800">{product.limit.split("(")[0].split("/")[0].trim()}</p>
        </div>
      </div>

      {/* Info Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-sm text-gray-900">상품 정보</h2>
        </div>
        {infoRows.map((row) => (
          <div key={row.label} className="flex border-b border-gray-50 last:border-b-0">
            <div className="w-20 md:w-24 shrink-0 px-5 py-4 text-[13px] font-medium text-gray-400">
              {row.label}
            </div>
            <div className="px-5 py-4 text-sm text-gray-800 flex-1 leading-relaxed">{row.value}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-sm text-gray-900 mb-4">주요 특징</h2>
        <div className="space-y-3">
          {product.features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg">
            #{tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8">
        <p className="text-white font-bold mb-1">신청 및 상담</p>
        <p className="text-sm text-slate-400 mb-5">{product.howToApply}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href="tel:1397"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/25"
          >
            <Phone className="w-3.5 h-3.5" /> 1397 전화상담
          </a>
          <a
            href="https://www.kinfa.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors border border-white/10"
          >
            서민금융진흥원 <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
