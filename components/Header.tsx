"use client"

import Link from "next/link"
import { useState } from "react"
import { Landmark, Menu, X } from "lucide-react"
import { CATEGORIES } from "@/lib/data"

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Landmark className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">서민금융한눈에</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/guides"
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
          >
            가이드
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-gray-600"
          aria-label="메뉴"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/guides"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
          >
            가이드
          </Link>
        </nav>
      )}
    </header>
  )
}
