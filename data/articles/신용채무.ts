import { LoanHubArticle, LoanSpokeArticle } from "@/lib/types";

export const hub: LoanHubArticle = {
  categorySlug: "신용채무",
  datePublished: "2026-03-01",
  dateModified: "2026-03-07",
  title: "신용회복 채무조정 가이드 | 개인회생 파산 면책 총정리",
  h1: "신용회복·채무조정 가이드",
  metaDescription:
    "신용회복지원, 개인회생, 개인파산 등 과다채무 해결 방법과 신청 조건을 단계별로 안내해요.",
  description:
    "과다채무로 어려운 분들을 위한 채무조정 및 신용회복 프로그램을 안내해요.",
  heroDescription:
    "빚이 감당이 안 될 때, 국가에서 운영하는 채무조정 제도를 활용할 수 있어요. 신용회복지원, 개인회생, 파산 면책 등 상황에 맞는 방법을 찾아보세요.",
  spokes: [
    {
      slug: "신용회복지원",
      title: "신용회복지원 신청방법 조건 | 채무조정 가이드",
      description: "3개월 이상 연체 채무자를 위한 이자·원금 감면",
    },
    {
      slug: "개인회생",
      title: "개인회생 신청방법 조건 비용 | 법적 채무조정 가이드",
      description: "법원 인가를 통한 채무 조정 및 면제",
    },
  ],
};

export const spokes: Record<string, LoanSpokeArticle> = {};
