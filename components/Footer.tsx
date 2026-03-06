import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-white mb-3">서민금융한눈에</h3>
            <p className="text-sm leading-relaxed">
              서민금융진흥원 등 공공기관의 금융상품 정보를 한곳에 모아 비교할 수 있는 서비스입니다.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-300 mb-3">카테고리</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products/loan" className="hover:text-white transition-colors">대출상품</Link></li>
              <li><Link href="/products/asset" className="hover:text-white transition-colors">자산형성</Link></li>
              <li><Link href="/products/credit" className="hover:text-white transition-colors">신용/채무</Link></li>
              <li><Link href="/guides" className="hover:text-white transition-colors">가이드</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-300 mb-3">상담 안내</h4>
            <ul className="space-y-2 text-sm">
              <li>서민금융진흥원: <span className="text-white">1397</span></li>
              <li>신용회복위원회: <span className="text-white">1600-5500</span></li>
              <li>법률구조공단: <span className="text-white">132</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500 leading-relaxed">
            본 사이트는 정보 제공 목적으로 운영되며, 실제 대출 조건은 금융기관에 따라 다를 수 있습니다.
            정확한 상품 정보는 해당 기관에 직접 문의하시기 바랍니다.
          </p>
        </div>
      </div>
    </footer>
  )
}
