"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { type FinanceProduct, type ApiResponse, categorizeProduct, CATEGORIES } from "@/lib/api"
import CategoryCard from "./CategoryCard"
import ProductCard from "./ProductCard"
import SearchBar from "./SearchBar"

export default function HomeClient() {
  const [products, setProducts] = useState<FinanceProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/finance?page=1&perPage=100")
        if (!res.ok) throw new Error("API 호출 실패")
        const data: ApiResponse = await res.json()
        setProducts(data.data || [])
      } catch {
        setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.")
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const categoriesWithCount = CATEGORIES.map((cat) => ({
    ...cat,
    count: products.filter((p) => categorizeProduct(p) === cat.slug).length,
  }))

  const filteredProducts = searchQuery.trim()
    ? products.filter((p) =>
        Object.values(p).some((v) => v && String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : products.slice(0, 6)

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            서민금융상품 한눈에 비교
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            서민금융진흥원에서 취급하는 대출상품, 자산형성상품, 사회적금융 정보를 한곳에서 확인하세요.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="대출상품, 자산형성, 사회적금융 검색..."
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoriesWithCount.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {searchQuery ? `"${searchQuery}" 검색 결과` : "주요 금융상품"}
          </h2>
          {!searchQuery && (
            <span className="text-sm text-gray-500">총 {products.length}개 상품</span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-40" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-xl">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Info Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-blue-900 mb-2">금융상품, 꼼꼼히 비교하세요</h3>
          <p className="text-sm text-blue-700">
            같은 대출상품이라도 금융기관마다 금리와 조건이 다릅니다.
            본 사이트의 정보를 참고하여 나에게 맞는 최적의 금융상품을 찾아보세요.
          </p>
        </div>
      </section>
    </>
  )
}
