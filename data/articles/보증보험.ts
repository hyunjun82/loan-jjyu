import { LoanHubArticle, LoanSpokeArticle } from "@/lib/types";

export const hub: LoanHubArticle = {
  categorySlug: "보증보험",
  datePublished: "2026-03-01",
  dateModified: "2026-03-07",
  title: "서민금융 보증/보험 가이드 | 신용보증 미소보험 총정리",
  h1: "서민금융 보증/보험 가이드",
  metaDescription:
    "소상공인 신용보증, 미소보험 등 서민을 위한 보증·보험 상품의 조건과 신청방법을 안내해요.",
  description:
    "담보력 부족한 서민·소상공인을 위한 보증·보험 상품을 안내해요.",
  heroDescription:
    "담보가 없어도 보증서로 대출을 받거나, 보험료 없이 질병·상해에 대비할 수 있는 제도가 있어요.",
  spokes: [
    {
      slug: "서민금융신용보증",
      title: "서민금융 신용보증 신청방법 조건 | 소상공인 보증 가이드",
      description: "담보 없이 보증서로 금융기관 대출 지원",
    },
    {
      slug: "미소보험",
      title: "미소보험 신청자격 보장내용 | 무료보험 가이드",
      description: "저소득층을 위한 보험료 무료 보장 상품",
    },
  ],
};

export const spokes: Record<string, LoanSpokeArticle> = {};
