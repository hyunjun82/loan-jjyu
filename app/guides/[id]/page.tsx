import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { GUIDES, CATEGORIES, getGuideById } from "@/lib/data"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return GUIDES.map((g) => ({ id: g.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const guide = getGuideById(id)
  return {
    title: guide ? `${guide.title} - 서민금융한눈에` : "가이드",
    description: guide?.summary,
  }
}

export default async function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const guide = getGuideById(id)

  if (!guide) notFound()

  const cat = CATEGORIES.find((c) => c.slug === guide.category)

  // Simple markdown-like rendering
  const lines = guide.content.split("\n")
  const rendered = lines.map((line, i) => {
    const trimmed = line.trim()
    if (trimmed.startsWith("## ")) {
      return <h2 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3">{trimmed.slice(3)}</h2>
    }
    if (trimmed.startsWith("### ")) {
      return <h3 key={i} className="text-base font-semibold text-gray-800 mt-6 mb-2">{trimmed.slice(4)}</h3>
    }
    if (trimmed.startsWith("- **")) {
      const match = trimmed.match(/^- \*\*(.+?)\*\*:\s*(.+)$/)
      if (match) {
        return (
          <div key={i} className="flex gap-2 text-sm ml-4 my-1">
            <span className="font-semibold text-gray-700 shrink-0">{match[1]}:</span>
            <span className="text-gray-600">{match[2]}</span>
          </div>
        )
      }
      const textMatch = trimmed.match(/^- \*\*(.+?)\*\*\s*(.*)$/)
      if (textMatch) {
        return (
          <div key={i} className="flex gap-2 text-sm ml-4 my-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
            <span><strong className="text-gray-800">{textMatch[1]}</strong> {textMatch[2]}</span>
          </div>
        )
      }
    }
    if (trimmed.startsWith("- ")) {
      return (
        <div key={i} className="flex items-start gap-2 text-sm text-gray-700 ml-4 my-1">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0" />
          {trimmed.slice(2)}
        </div>
      )
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)\.\s(.+)$/)?.[1]
      const text = trimmed.match(/^(\d+)\.\s(.+)$/)?.[2]
      if (num && text) {
        // Handle **bold** within numbered items
        const parts = text.split(/\*\*(.+?)\*\*/)
        return (
          <div key={i} className="flex items-start gap-2 text-sm text-gray-700 ml-4 my-1.5">
            <span className="text-blue-600 font-semibold shrink-0 w-4">{num}.</span>
            <span>{parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-gray-900">{part}</strong> : part)}</span>
          </div>
        )
      }
    }
    if (trimmed === "") {
      return <div key={i} className="h-2" />
    }
    return <p key={i} className="text-sm text-gray-700 leading-relaxed my-1">{trimmed}</p>
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/guides" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> 가이드 목록
      </Link>

      <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${cat?.bgColor} ${cat?.color} mb-3`}>
        {cat?.name}
      </span>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{guide.title}</h1>
      <p className="text-gray-500 mb-8">{guide.summary}</p>

      <article className="prose-custom">
        {rendered}
      </article>

      <div className="mt-10 flex flex-wrap gap-2">
        {guide.tags.map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
            #{tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 p-5 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="font-semibold text-blue-900 mb-1">더 궁금한 점이 있으신가요?</p>
        <p className="text-sm text-blue-700">
          서민금융진흥원 콜센터 <strong>1397</strong>에서 무료 상담을 받으실 수 있습니다.
        </p>
      </div>
    </div>
  )
}
