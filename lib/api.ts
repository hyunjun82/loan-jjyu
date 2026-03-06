const API_BASE = "https://api.odcloud.kr/api/15138932/v1/uddi:3de95ac2-3d49-4c75-9472-ebf01fc1dc3d"
const SERVICE_KEY = "cf7552de3d61cdff45c878062b431dd4578ca18c4487cd44f545477356f2947b"

export interface FinanceProduct {
  "금융회사명"?: string
  "상품명"?: string
  "대출종류"?: string
  "대출대상"?: string
  "대출한도"?: string
  "대출금리"?: string
  "상환방법"?: string
  "대출기간"?: string
  "신청방법"?: string
  "구비서류"?: string
  "비고"?: string
  "취급기관"?: string
  "상품유형"?: string
  "지원대상"?: string
  "지원내용"?: string
  "신청자격"?: string
  [key: string]: string | undefined
}

export interface ApiResponse {
  currentCount: number
  data: FinanceProduct[]
  matchCount: number
  page: number
  perPage: number
  totalCount: number
}

export async function fetchFinanceProducts(
  page: number = 1,
  perPage: number = 100
): Promise<ApiResponse> {
  const url = `${API_BASE}?page=${page}&perPage=${perPage}&serviceKey=${SERVICE_KEY}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) {
    throw new Error(`API 호출 실패: ${res.status}`)
  }
  return res.json()
}

export function categorizeProduct(product: FinanceProduct): string {
  const type = product["상품유형"] || product["대출종류"] || ""
  const name = product["상품명"] || ""
  const combined = type + name

  if (combined.includes("대출") || combined.includes("론")) return "loan"
  if (combined.includes("자산") || combined.includes("저축") || combined.includes("적금")) return "asset"
  if (combined.includes("사회적") || combined.includes("복지")) return "social"
  if (combined.includes("보증") || combined.includes("보험")) return "guarantee"
  if (combined.includes("채무") || combined.includes("신용")) return "credit"
  return "loan"
}

export const CATEGORIES = [
  { name: "대출상품", slug: "loan", icon: "💰", description: "서민금융진흥원 취급 대출상품", count: 0 },
  { name: "자산형성", slug: "asset", icon: "📈", description: "자산형성 지원 상품", count: 0 },
  { name: "사회적금융", slug: "social", icon: "🤝", description: "사회적 금융 지원", count: 0 },
  { name: "보증/보험", slug: "guarantee", icon: "🛡️", description: "보증 및 보험 상품", count: 0 },
  { name: "신용/채무", slug: "credit", icon: "📋", description: "신용회복 및 채무조정", count: 0 },
]
