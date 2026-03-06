"use client"

import { useState, useEffect } from "react"
import { type FinanceProduct, type ApiResponse, getApiUrl } from "@/lib/api"
import ProductList from "@/components/ProductList"

export default function CategoryPageClient({ category }: { category: string }) {
  const [products, setProducts] = useState<FinanceProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(getApiUrl(1, 100))
        if (!res.ok) throw new Error("API 호출 실패")
        const data: ApiResponse = await res.json()
        setProducts(data.data || [])
      } catch {
        setError("데이터를 불러오는 데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-40" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-xl">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return <ProductList initialProducts={products} categoryFilter={category} />
}
