"use client"

import { useState, useEffect, useMemo } from "react"
import { type FinanceProduct, categorizeProduct } from "@/lib/api"
import ProductCard from "./ProductCard"
import SearchBar from "./SearchBar"

export default function ProductList({
  initialProducts,
  categoryFilter,
}: {
  initialProducts: FinanceProduct[]
  categoryFilter?: string
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    let products = initialProducts

    if (categoryFilter) {
      products = products.filter((p) => categorizeProduct(p) === categoryFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      products = products.filter((p) =>
        Object.values(p).some((v) => v && String(v).toLowerCase().includes(q))
      )
    }

    return products
  }, [initialProducts, categoryFilter, searchQuery])

  return (
    <div>
      <div className="mb-8">
        <SearchBar onSearch={setSearchQuery} />
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
          <p className="text-sm text-gray-400 mt-1">다른 검색어를 입력해 보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} index={index} />
          ))}
        </div>
      )}
      <p className="text-center text-sm text-gray-400 mt-6">
        총 {filteredProducts.length}개 상품
      </p>
    </div>
  )
}
