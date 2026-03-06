"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ArrowRight, Banknote, PiggyBank, Handshake, Shield, CreditCard, BookOpen } from "lucide-react"
import { CATEGORIES, PRODUCTS, GUIDES, searchAll, type Product, type Guide } from "@/lib/data"

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  loan: <Banknote className="w-5 h-5" />,
  asset: <PiggyBank className="w-5 h-5" />,
  social: <Handshake className="w-5 h-5" />,
  guarantee: <Shield className="w-5 h-5" />,
  credit: <CreditCard className="w-5 h-5" />,
}

export default function HomeClient() {
  const [query, setQuery] = useState("")
  const results = query.trim() ? searchAll(query) : null

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            서민금융상품, 한눈에 비교하세요
          </h1>
          <p className="text-blue-100 mb-8">
            햇살론, 미소금융, 새희망홀씨 등 정부지원 서민금융 상품을 쉽게 찾아보세요.
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="상품명, 대출 조건, 대상 등을 검색하세요"
              className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </section>

      {/* Search Results */}
      {results && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            &ldquo;{query}&rdquo; 검색 결과
          </h2>
          {results.products.length === 0 && results.guides.length === 0 ? (
            <p className="text-gray-500 text-center py-8">검색 결과가 없습니다. 다른 키워드로 시도해 보세요.</p>
          ) : (
            <div className="space-y-3">
              {results.products.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
              {results.guides.map((g) => (
                <GuideRow key={g.id} guide={g} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Categories */}
      {!results && (
        <>
          <section className="max-w-6xl mx-auto px-4 -mt-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => {
                const count = PRODUCTS.filter((p) => p.category === cat.slug).length
                return (
                  <Link
                    key={cat.slug}
                    href={`/products/${cat.slug}`}
                    className="flex flex-col items-start p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className={`w-9 h-9 ${cat.iconBg} rounded-lg flex items-center justify-center ${cat.color} mb-3`}>
                      {CATEGORY_ICONS[cat.slug]}
                    </div>
                    <span className="font-semibold text-sm text-gray-900">{cat.name}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{count}개 상품</span>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Featured Products */}
          <section className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">주요 금융상품</h2>
              <Link href="/products/loan" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                전체보기 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCTS.slice(0, 6).map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Guides */}
          <section className="max-w-6xl mx-auto px-4 pb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">서민금융 가이드</h2>
              <Link href="/guides" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                전체보기 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GUIDES.slice(0, 4).map((guide) => (
                <GuideRow key={guide.id} guide={guide} />
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-6xl mx-auto px-4 pb-12">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
              <p className="font-semibold text-blue-900 mb-1">어떤 상품이 맞는지 모르겠다면?</p>
              <p className="text-sm text-blue-700 mb-4">
                서민금융진흥원 통합 콜센터에서 무료 상담을 받으세요.
              </p>
              <span className="inline-block bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-lg">
                1397 (평일 9:00~18:00)
              </span>
            </div>
          </section>
        </>
      )}
    </>
  )
}

function ProductRow({ product }: { product: Product }) {
  const cat = CATEGORIES.find((c) => c.slug === product.category)
  return (
    <Link
      href={`/products/${product.category}/${product.id}`}
      className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-1.5 ${cat?.bgColor} ${cat?.color}`}>
            {cat?.name}
          </span>
          <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{product.institution}</p>
          <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{product.description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-semibold text-blue-600">{product.rate}</div>
          <div className="text-xs text-gray-400 mt-0.5">한도 {product.limit.split("(")[0].trim()}</div>
        </div>
      </div>
    </Link>
  )
}

function GuideRow({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.id}`}
      className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <BookOpen className="w-4 h-4 text-gray-500" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-sm text-gray-900">{guide.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{guide.summary}</p>
      </div>
    </Link>
  )
}
