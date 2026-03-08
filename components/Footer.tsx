import Link from "next/link"
import { Landmark } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 mt-20">
      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                <Landmark className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-sm">서민금융한눈에</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              서민금융진흥원 등 공공기관의 금융상품 정보를 한곳에 모아 비교할 수 있는 서비스입니다.
              정확한 상품 정보는 해당 기관에 직접 문의하시기 바랍니다.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">카테고리</h4>
            <ul className="space-y-2.5">
              <li><Link href="/대출상품" className="text-sm text-gray-500 hover:text-white transition-colors">대출상품</Link></li>
              <li><Link href="/자산형성" className="text-sm text-gray-500 hover:text-white transition-colors">자산형성</Link></li>
              <li><Link href="/신용채무" className="text-sm text-gray-500 hover:text-white transition-colors">신용/채무</Link></li>
              <li><Link href="/햇살론유스" className="text-sm text-gray-500 hover:text-white transition-colors">햇살론유스</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">상담 안내</h4>
            <ul className="space-y-3">
              <li>
                <p className="text-xs text-gray-500">서민금융진흥원</p>
                <p className="text-sm font-semibold text-white">1397</p>
              </li>
              <li>
                <p className="text-xs text-gray-500">신용회복위원회</p>
                <p className="text-sm font-semibold text-white">1600-5500</p>
              </li>
              <li>
                <p className="text-xs text-gray-500">법률구조공단</p>
                <p className="text-sm font-semibold text-white">132</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800">
          <p className="text-[11px] text-gray-600">
            본 사이트는 정보 제공 목적으로 운영되며, 실제 대출 조건은 금융기관에 따라 다를 수 있습니다.
          </p>
        </div>
      </div>
    </footer>
  )
}
