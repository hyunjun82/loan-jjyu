"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronRight, Phone, Landmark } from "lucide-react"
import { categories } from "@/data/categories"
import { hubArticles, spokeArticles } from "@/data/articles"

export default function HomeClient() {
  const [query, setQuery] = useState("")

  // 검색: spoke 타이틀에서 쿼리 매칭
  const searchResults = query.trim()
    ? Object.entries(spokeArticles).flatMap(([catSlug, spokes]) =>
        Object.values(spokes)
          .filter(
            (s) =>
              s.title.includes(query) ||
              s.description?.includes(query) ||
              catSlug.includes(query)
          )
          .map((s) => ({ catSlug, spoke: s }))
      )
    : null

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
            서민금융 상품을 한눈에 비교하세요
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="햇살론유스, 신청조건, 금리..."
              className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl text-sm shadow-xl shadow-blue-900/20 focus:outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchResults && (
        <section className="max-w-5xl mx-auto px-5 py-10">
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-medium text-gray-900">&ldquo;{query}&rdquo;</span> 검색 결과 {searchResults.length}건
          </p>
          {searchResults.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">검색 결과가 없습니다</p>
              <p className="text-gray-400 text-xs mt-1">다른 키워드로 시도해 보세요</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map(({ catSlug, spoke }) => (
                <Link
                  key={`${catSlug}-${spoke.slug}`}
                  href={`/${catSlug}/${spoke.slug}`}
                  className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-blue-600 mb-0.5">{catSlug}</p>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{spoke.title}</h3>
                    <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-1">{spoke.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Main Content */}
      {!searchResults && (
        <>
          {/* Category Grid */}
          <section className="max-w-5xl mx-auto px-5 -mt-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((cat) => {
                const hub = hubArticles[cat.slug]
                return (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="group bg-white rounded-2xl p-4 shadow-sm shadow-gray-200/50 border border-gray-100 card-hover"
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <p className="font-semibold text-sm text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{cat.count}개 가이드</p>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* 주요 가이드 — 햇살론유스 spokes */}
          {spokeArticles["햇살론유스"] && (
            <section className="max-w-5xl mx-auto px-5 mt-14">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">햇살론유스 가이드</h2>
                  <p className="text-xs text-gray-400 mt-0.5">청년 서민금융 대출 완벽 안내</p>
                </div>
                <Link href="/햇살론유스" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                  전체보기 <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(spokeArticles["햇살론유스"]).slice(0, 6).map((spoke) => (
                  <Link
                    key={spoke.slug}
                    href={`/햇살론유스/${spoke.slug}`}
                    className="group bg-white rounded-2xl p-5 shadow-sm shadow-gray-200/50 border border-gray-100 card-hover"
                  >
                    <p className="text-[11px] font-medium text-blue-600 mb-1">햇살론유스</p>
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
                      {spoke.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed">{spoke.description}</p>
                    <div className="flex justify-end mt-3">
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 전체 카테고리 허브 */}
          <section className="max-w-5xl mx-auto px-5 mt-14">
            <h2 className="text-lg font-bold text-gray-900 mb-6">전체 카테고리</h2>
            <div className="space-y-4">
              {categories.map((cat) => {
                const hub = hubArticles[cat.slug]
                if (!hub) return null
                return (
                  <div key={cat.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <Link
                      href={`/${cat.slug}`}
                      className="flex items-center gap-4 p-5 hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{cat.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{hub.description}</p>
                      </div>
                      <span className="text-xs text-gray-400">{cat.count}개</span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </Link>
                    {hub.spokes.length > 0 && (
                      <div className="border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-gray-100">
                        {hub.spokes.slice(0, 4).map((spoke) => (
                          <Link
                            key={spoke.slug}
                            href={`/${cat.slug}/${spoke.slug}`}
                            className="p-3 text-[13px] text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors line-clamp-1"
                          >
                            {spoke.title.split("|")[0].trim()}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
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
