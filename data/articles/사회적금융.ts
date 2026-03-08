import { LoanHubArticle, LoanSpokeArticle } from "@/lib/types";

export const hub: LoanHubArticle = {
  categorySlug: "사회적금융",
  datePublished: "2026-03-01",
  dateModified: "2026-03-07",
  title: "사회적금융 대출 가이드 | 사회적기업 협동조합 지원",
  h1: "사회적금융 대출 가이드",
  metaDescription:
    "사회적기업, 협동조합 등 사회적경제 조직을 위한 저금리 대출 및 금융지원 정보를 안내해요.",
  description:
    "협동조합·마을기업 등 사회적경제 조직 대상 금융지원 상품을 안내해요.",
  heroDescription:
    "사회적기업, 사회적협동조합, 마을기업 등 사회적경제 조직의 운영자금과 시설자금을 저금리로 지원하는 프로그램이에요.",
  spokes: [
    {
      slug: "사회적기업대출",
      title: "사회적기업 대출 신청방법 금리 조건 총정리",
      description: "인증 사회적기업을 위한 운영·시설 자금 대출",
    },
  ],
};

export const spokes: Record<string, LoanSpokeArticle> = {};
