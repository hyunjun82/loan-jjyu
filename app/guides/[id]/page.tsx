import Link from "next/link"
import { ArrowLeft, Phone } from "lucide-react"
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

  const lines = guide.content.split("\n")
  const rendered = lines.map((line, i) => {
    const trimmed = line.trim()
    if (trimmed.startsWith("## ")) {
      return <h2 key={i} className="text-lg font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">{trimmed.slice(3)}</h2>
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="text-base font-bold text-gray-800 mt-7 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-500 rounded-full" />
          {trimmed.slice(4)}
        </h3>
      )
    }
    if (trimmed.startsWith("- **")) {
      const match = trimmed.match(/^- \*\*(.+?)\*\*:\s*(.+)$/)
      if (match) {
        return (
          <div key={i} className="flex gap-3 text-sm ml-3 my-1.5">
            <span className="font-semibold text-gray-700 shrink-0 min-w-[3rem]">{match[1]}</span>
            <span className="text-gray-600">{match[2]}</span>
          </div>
        )
      }
      const textMatch = trimmed.match(/^- \*\*(.+?)\*\*\s*(.*)$/)
      if (textMatch) {
        return (
          <div key={i} className="flex items-start gap-2.5 text-sm ml-3 my-1.5">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
            <span><strong className="text-gray-800">{textMatch[1]}</strong> {textMatch[2]}</span>
          </div>
        )
      }
    }
    if (trimmed.startsWith("- ")) {
      return (
        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600 ml-3 my-1.5">
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5 shrink-0" />
          {trimmed.slice(2)}
        </div>
      )
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)\.\s(.+)$/)?.[1]
      const text = trimmed.match(/^(\d+)\.\s(.+)$/)?.[2]
      if (num && text) {
        const parts = text.split(/\*\*(.+?)\*\*/)
        return (
          <div key={i} className="flex items-start gap-3 text-sm text-gray-700 ml-3 my-2">
            <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">{num}</span>
            <span className="mt-0.5">{parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-gray-900">{part}</strong> : part)}</span>
          </div>
        )
      }
    }
    if (trimmed === "") {
      return <div key={i} className="h-3" />
    }
    return <p key={i} className="text-sm text-gray-600 leading-relaxed my-1.5">{trimmed}</p>
  })

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <Link href="/guides" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> 가이드 목록
      </Link>

      <div className="mb-10">
        <span className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-lg ${cat?.bgColor} ${cat?.color} mb-4`}>
          {cat?.name}
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">{guide.title}</h1>
        <p className="text-gray-500 leading-relaxed">{guide.summary}</p>
      </div>

      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        {rendered}
      </article>

      <div className="mt-6 flex flex-wrap gap-2">
        {guide.tags.map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg">
            #{tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-white font-bold mb-1">더 궁금한 점이 있으신가요?</p>
          <p className="text-sm text-slate-400">서민금융진흥원 콜센터에서 무료 상담을 받으세요</p>
        </div>
        <a
          href="tel:1397"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors shrink-0 shadow-lg shadow-blue-600/25"
        >
          <Phone className="w-4 h-4" /> 1397 전화상담
        </a>
      </div>
    </div>
  )
}
