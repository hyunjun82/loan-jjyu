import { LoanHubArticle, LoanSpokeArticle } from "@/lib/types";

export const hub: LoanHubArticle = {
  categorySlug: "자산형성",
  datePublished: "2026-03-01",
  dateModified: "2026-03-07",
  title: "자산형성 지원 프로그램 비교 | 청년통장 내일키움 총정리",
  h1: "자산형성 지원 프로그램 비교 가이드",
  metaDescription:
    "희망두배청년통장, 내일키움통장 등 저소득층 자산형성 지원 프로그램의 조건과 혜택을 비교해요.",
  description:
    "정부 매칭 저축 프로그램을 비교 분석해요.",
  heroDescription:
    "매월 저축하면 정부가 같은 금액을 매칭해 주는 자산형성 프로그램이에요. 청년, 자활근로 참여자 등을 위한 제도를 비교해 보세요.",
  spokes: [
    {
      slug: "희망두배청년통장",
      title: "희망두배청년통장 신청자격 조건 | 청년 자산형성 가이드",
      description: "일하는 청년의 저축에 정부가 100% 매칭",
    },
    {
      slug: "내일키움통장",
      title: "내일키움통장(IDA) 신청자격 조건 | 자활 자산형성 가이드",
      description: "자활근로 참여자를 위한 매칭 적립 프로그램",
    },
  ],
};

export const spokes: Record<string, LoanSpokeArticle> = {};
