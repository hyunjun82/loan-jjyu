import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h3 className="font-bold text-gray-900">서민금융한눈에</h3>
            <p className="text-sm text-gray-500 mt-1">서민금융진흥원 공공데이터 기반 금융상품 정보</p>
          </div>
          <nav className="flex gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
            <Link href="/products/loan" className="hover:text-blue-600 transition-colors">대출상품</Link>
            <Link href="/products/asset" className="hover:text-blue-600 transition-colors">자산형성</Link>
          </nav>
        </div>
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            본 사이트에서 제공하는 금융상품 정보는 공공데이터포털(서민금융진흥원)의 공식 데이터를 기반으로 하며,
            실제 대출 조건은 금융기관에 따라 다를 수 있습니다. 정확한 상품 정보는 해당 금융기관에 직접 문의하시기 바랍니다.
          </p>
        </div>
        <p className="mt-6 text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} 서민금융한눈에. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
