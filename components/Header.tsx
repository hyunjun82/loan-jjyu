"use client"

import Link from "next/link"
import { useState } from "react"
import { Landmark, Menu, X } from "lucide-react"
import { categories } from "@/data/categories"

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Landmark className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-[15px] leading-tight">서민금융한눈에</span>
            <span className="text-[10px] text-gray-400 leading-tight">공공데이터 기반</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="px-3 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="메뉴"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-5 py-3 space-y-0.5 shadow-lg">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
