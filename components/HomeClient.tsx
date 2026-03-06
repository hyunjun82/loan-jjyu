"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search, ArrowRight, Banknote, PiggyBank, Handshake, Shield, CreditCard,
  BookOpen, Phone, ChevronRight, Landmark
} from "lucide-react"
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
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-5 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-blue-100 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-white/10">
            <Landmark className="w-3 h-3" />
            정부지원 서민금융 상품 비교
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            나에게 맞는 서민금융,<br className="md:hidden" />
            <span className="text-blue-200"> 쉽고 빠르게</span>
          </h1>
          <p className="text-blue-200/80 mb-10 text-base max-w-md mx-auto">
            햇살론, 미소금융, 새희망홀씨 등<br />
            13개 금융상품을 한눈에 비교하세요
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="햇살론, 청년, 긴급생계자금..."
              className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl text-sm shadow-xl shadow-blue-900/20 search-glow focus:outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Search Results */}
      {results && (
        <section className="max-w-5xl mx-auto px-5 py-10">
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-medium text-gray-900">&ldquo;{query}&rdquo;</span> 검색 결과 {results.products.length + results.guides.length}건
          </p>
          {results.products.length === 0 && results.guides.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">검색 결과가 없습니다</p>
              <p className="text-gray-400 text-xs mt-1">다른 키워드로 시도해 보세요</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
              {results.guides.map((g) => (
                <GuideCard key={g.id} guide={g} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Main Content */}
      {!results && (
        <>
          {/* Category Grid */}
          <section className="max-w-5xl mx-auto px-5 -mt-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => {
                const count = PRODUCTS.filter((p) => p.category === cat.slug).length
                return (
                  <Link
                    key={cat.slug}
                    href={`/products/${cat.slug}`}
                    className="group bg-white rounded-2xl p-4 shadow-sm shadow-gray-200/50 border border-gray-100 card-hover"
                  >
                    <div className={`w-10 h-10 ${cat.iconBg} rounded-xl flex items-center justify-center ${cat.color} mb-3 group-hover:scale-105 transition-transform`}>
                      {CATEGORY_ICONS[cat.slug]}
                    </div>
                    <p className="font-semibold text-sm text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{count}개 상품</p>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Featured Products */}
          <section className="max-w-5xl mx-auto px-5 mt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">주요 금융상품</h2>
                <p className="text-xs text-gray-400 mt-0.5">서민금융진흥원 등 공공기관 제공 상품</p>
              </div>
              <Link href="/products/loan" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                전체보기 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRODUCTS.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Guides */}
          <section className="max-w-5xl mx-auto px-5 mt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">서민금융 가이드</h2>
                <p className="text-xs text-gray-400 mt-0.5">상품 선택부터 신청까지 단계별 안내</p>
              </div>
              <Link href="/guides" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                전체보기 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GUIDES.slice(0, 4).map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-5xl mx-auto px-5 mt-14 mb-4">
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15)_0%,_transparent_60%)]" />
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-white font-bold text-lg mb-1">어떤 상품이 맞는지 모르겠다면?</p>
                  <p className="text-slate-400 text-sm">
                    서민금융진흥원 통합 콜센터에서 무료 상담을 받으세요
                  </p>
                </div>
                <a
                  href="tel:1397"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors shrink-0 shadow-lg shadow-blue-600/25"
                >
                  <Phone className="w-4 h-4" />
                  1397 전화상담
                </a>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}

function ProductCard({ product }: { product: Product }) {
  const cat = CATEGORIES.find((c) => c.slug === product.category)
  return (
    <Link
      href={`/products/${product.category}/${product.id}`}
      className="group bg-white rounded-2xl p-5 shadow-sm shadow-gray-200/50 border border-gray-100 card-hover block"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${cat?.bgColor} ${cat?.color}`}>
          {cat?.name}
        </span>
        <span className="text-[11px] text-gray-400">{product.institution}</span>
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
      <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-4">{product.description}</p>
      <div className="flex items-end justify-between pt-3 border-t border-gray-100">
        <div>
          <p className="text-[11px] text-gray-400 mb-0.5">금리</p>
          <p className="text-sm font-bold text-blue-600">{product.rate}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-gray-400 mb-0.5">한도</p>
          <p className="text-sm font-semibold text-gray-700">{product.limit.split("(")[0].split("/")[0].trim()}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
      </div>
    </Link>
  )
}

function GuideCard({ guide }: { guide: Guide }) {
  const cat = CATEGORIES.find((c) => c.slug === guide.category)
  return (
    <Link
      href={`/guides/${guide.id}`}
      className="group bg-white rounded-2xl p-5 shadow-sm shadow-gray-200/50 border border-gray-100 card-hover flex gap-4 items-start"
    >
      <div className={`w-10 h-10 ${cat?.bgColor || "bg-gray-50"} rounded-xl flex items-center justify-center shrink-0`}>
        <BookOpen className={`w-5 h-5 ${cat?.color || "text-gray-500"}`} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{guide.title}</h3>
        <p className="text-[13px] text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{guide.summary}</p>
        <div className="flex gap-1.5 mt-3">
          {guide.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
