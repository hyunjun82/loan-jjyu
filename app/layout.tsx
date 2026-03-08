import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "서민금융한눈에 - 서민금융상품 비교 가이드",
  description: "서민금융진흥원에서 취급하는 대출상품, 자산형성상품, 사회적금융 정보를 한눈에 비교하세요. 공공데이터 기반 서민금융 정보 플랫폼.",
  keywords: ["서민금융", "대출상품", "자산형성", "사회적금융", "서민금융진흥원", "금융상품비교"],
  verification: {
    google: "kPe6sAN7cMBDG2OVVWHcI8hH-BxkT5Zv6U8TVWTxuwI",
    other: {
      "naver-site-verification": "def813d2a54ecb59fd8538f8ec980682b3cb1da3",
      "DaumWebMasterTool": "af25622f4fb4d346903d990e9bc503955240b1c1870ae148e51aa8d0bb60eb88:lAzAexguCYOxPKpBY/1wPA==",
    },
  },
  openGraph: {
    title: "서민금융한눈에 - 서민금융상품 비교 가이드",
    description: "서민금융진흥원에서 취급하는 대출상품, 자산형성상품, 사회적금융 정보를 한눈에 비교하세요.",
    type: "website",
    locale: "ko_KR",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased bg-[#f8fafc]">
        <Header />
        <main className="min-h-screen bg-[#f8fafc]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
