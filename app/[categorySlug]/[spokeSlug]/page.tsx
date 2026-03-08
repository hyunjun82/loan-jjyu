import Link from "next/link"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { notFound } from "next/navigation"
import { getSpokeBySlug, getHubByCategory, getSpokesByCategory, ALL_SPOKES } from "@/data/articles"

export function generateStaticParams() {
  return ALL_SPOKES.map((s) => ({
    categorySlug: s.categorySlug,
    spokeSlug: s.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string; spokeSlug: string }> }) {
  const { spokeSlug } = await params
  const spoke = getSpokeBySlug(spokeSlug)
  if (!spoke) return {}
  return {
    title: spoke.title,
    description: spoke.metaDescription,
  }
}

export default async function SpokePage({ params }: { params: Promise<{ categorySlug: string; spokeSlug: string }> }) {
  const { categorySlug, spokeSlug } = await params
  const spoke = getSpokeBySlug(spokeSlug)
  if (!spoke) notFound()

  const hub = getHubByCategory(categorySlug)
  const otherSpokes = getSpokesByCategory(categorySlug).filter(s => s.slug !== spokeSlug).slice(0, 5)

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <Link
        href={`/${categorySlug}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {hub?.title || "목록으로"}
      </Link>

      {/* Article header */}
      <div className="mb-10">
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mb-3 leading-tight">{spoke.h1}</h1>
        <p className="text-gray-500 text-sm leading-relaxed">{spoke.heroDescription}</p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {spoke.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{section.title}</h2>
            <div
              className="prose-custom text-sm text-gray-700 leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </section>
        ))}
      </div>

      {/* FAQ */}
      {spoke.faq.length > 0 && (
        <div className="mt-12">
          <h2 className="text-base font-bold text-gray-900 mb-4">자주 묻는 질문</h2>
          <div className="space-y-3">
            {spoke.faq.map((item, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none font-semibold text-sm text-gray-900">
                  <span>Q. {item.question}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Related spokes */}
      {otherSpokes.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">관련 글</h2>
          <div className="space-y-2">
            {otherSpokes.map((s) => (
              <Link
                key={s.slug}
                href={`/${categorySlug}/${s.slug}`}
                className="group flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{s.title}</span>
                <ArrowLeft className="w-3.5 h-3.5 text-gray-300 rotate-180 shrink-0 group-hover:text-blue-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
