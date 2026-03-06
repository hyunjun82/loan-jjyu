import { NextRequest, NextResponse } from "next/server"

const API_BASE = "https://api.odcloud.kr/api/15138932/v1/uddi:3de95ac2-3d49-4c75-9472-ebf01fc1dc3d"
const SERVICE_KEY = "cf7552de3d61cdff45c878062b431dd4578ca18c4487cd44f545477356f2947b"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get("page") || "1"
  const perPage = searchParams.get("perPage") || "100"

  try {
    const url = `${API_BASE}?page=${page}&perPage=${perPage}&serviceKey=${SERVICE_KEY}`
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `API 호출 실패: ${res.status}` },
        { status: res.statusText ? res.status : 500 }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "서민금융진흥원 API 연결에 실패했습니다." },
      { status: 500 }
    )
  }
}
