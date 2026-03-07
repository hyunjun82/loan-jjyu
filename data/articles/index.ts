import { LoanHubArticle, LoanSpokeArticle } from "@/lib/types";
import { hub as 대출상품Hub, spokes as 대출상품Spokes } from "./대출상품";
import { hub as 자산형성Hub, spokes as 자산형성Spokes } from "./자산형성";
import { hub as 사회적금융Hub, spokes as 사회적금융Spokes } from "./사회적금융";
import { hub as 보증보험Hub, spokes as 보증보험Spokes } from "./보증보험";
import { hub as 신용채무Hub, spokes as 신용채무Spokes } from "./신용채무";

export const hubArticles: Record<string, LoanHubArticle> = {
  대출상품: 대출상품Hub,
  자산형성: 자산형성Hub,
  사회적금융: 사회적금융Hub,
  보증보험: 보증보험Hub,
  신용채무: 신용채무Hub,
};

export const spokeArticles: Record<string, Record<string, LoanSpokeArticle>> = {
  대출상품: 대출상품Spokes,
  자산형성: 자산형성Spokes,
  사회적금융: 사회적금융Spokes,
  보증보험: 보증보험Spokes,
  신용채무: 신용채무Spokes,
};

export function getHubArticle(categorySlug: string): LoanHubArticle | undefined {
  return hubArticles[categorySlug];
}

export function getSpokeArticle(
  categorySlug: string,
  spokeSlug: string
): LoanSpokeArticle | undefined {
  return spokeArticles[categorySlug]?.[spokeSlug];
}
