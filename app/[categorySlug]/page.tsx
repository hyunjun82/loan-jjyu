import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { notFound } from "next/navigation"
import { getHubByCategory, getSpokesByCategory, ALL_HUBS } from "@/data/articles"

export function generateStaticParams() {
  return ALL_HUBS.map((h) => ({ categorySlug: h.categorySlug }))
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params
  const hub = getHubByCategory(categorySlug)
  if (!hub) return {}
  return {
    title: hub.title,
    description: hub.metaDescription,
  }
}

export default async function HubPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params
  const hub = getHubByCategory(categorySlug)
  if (!hub) notFound()

  const spokes = getSpokesByCategory(categorySlug)

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> 홈으로
      </Link>

      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">{hub.h1}</h1>
        <p className="text-gray-600 leading-relaxed">{hub.heroDescription}</p>
      </div>

      <div className="space-y-2">
        {spokes.map((spoke) => (
          <Link
            key={spoke.slug}
            href={`/${categorySlug}/${spoke.slug}`}
            className="group flex items-center justify-between bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
          >
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-snug">{spoke.title}</h2>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{spoke.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}
