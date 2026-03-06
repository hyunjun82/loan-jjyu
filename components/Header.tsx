"use client"

import Link from "next/link"
import { Landmark } from "lucide-react"
import { CATEGORIES } from "@/lib/api"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-gray-900">서민금융한눈에</span>
            <span className="text-xs text-gray-500 ml-1">공공데이터 기반</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
