import { LoanHubArticle, LoanSpokeArticle } from "@/lib/types";
import { hub as 대출상품Hub, spokes as 대출상품Spokes } from "./대출상품";
import { hub as 자산형성Hub, spokes as 자산형성Spokes } from "./자산형성";
import { hub as 사회적금융Hub, spokes as 사회적금융Spokes } from "./사회적금융";
import { hub as 보증보험Hub, spokes as 보증보험Spokes } from "./보증보험";
import { hub as 신용채무Hub, spokes as 신용채무Spokes } from "./신용채무";
import { hub as haesallonYouthHub, spokes as haesallonYouthSpokesArr } from "./haesallon-youth-spokes-1";
import { hub as haesallon15Hub, spokes as haesallon15SpokesArr } from "./haesallon15-test";
import { spokes as haesallon15Spokes1Arr } from "./haesallon15-spokes-1";
import { spokes as haesallonBankSpokesArr } from "./haesallon-bank-spokes-1";
import { spokes as misoSpokesArr } from "./miso-spokes-1";
import { spokes as saehopeSpokesArr } from "./saehope-spokes-1";
import { spokes as emergencySpokesArr } from "./emergency-spokes-1";
import {
  haesallonBankHub,
  misoHub,
  saehopeHub,
  emergencyHub,
} from "./service-hubs";

const haesallonYouthSpokes: Record<string, LoanSpokeArticle> =
  Object.fromEntries(haesallonYouthSpokesArr.map((s) => [s.slug, s as LoanSpokeArticle]));

const haesallon15Spokes: Record<string, LoanSpokeArticle> =
  Object.fromEntries([...haesallon15SpokesArr, ...haesallon15Spokes1Arr].map((s) => [s.slug, s as LoanSpokeArticle]));

const haesallonBankSpokes: Record<string, LoanSpokeArticle> =
  Object.fromEntries(haesallonBankSpokesArr.map((s) => [s.slug, s as LoanSpokeArticle]));

const misoSpokes: Record<string, LoanSpokeArticle> =
  Object.fromEntries(misoSpokesArr.map((s) => [s.slug, s as LoanSpokeArticle]));

const saehopeSpokes: Record<string, LoanSpokeArticle> =
  Object.fromEntries(saehopeSpokesArr.map((s) => [s.slug, s as LoanSpokeArticle]));

const emergencySpokes: Record<string, LoanSpokeArticle> =
  Object.fromEntries(emergencySpokesArr.map((s) => [s.slug, s as LoanSpokeArticle]));

export const hubArticles: Record<string, LoanHubArticle> = {
  대출상품: 대출상품Hub,
  자산형성: 자산형성Hub,
  사회적금융: 사회적금융Hub,
  보증보험: 보증보험Hub,
  신용채무: 신용채무Hub,
  "햇살론유스": haesallonYouthHub,
  "햇살론15": haesallon15Hub,
  "햇살론뱅크": haesallonBankHub,
  "미소금융": misoHub,
  "새희망홀씨": saehopeHub,
  "긴급생계자금": emergencyHub,
};

export const spokeArticles: Record<string, Record<string, LoanSpokeArticle>> = {
  대출상품: 대출상품Spokes,
  자산형성: 자산형성Spokes,
  사회적금융: 사회적금융Spokes,
  보증보험: 보증보험Spokes,
  신용채무: 신용채무Spokes,
  "햇살론유스": haesallonYouthSpokes,
  "햇살론15": haesallon15Spokes,
  "햇살론뱅크": haesallonBankSpokes,
  "미소금융": misoSpokes,
  "새희망홀씨": saehopeSpokes,
  "긴급생계자금": emergencySpokes,
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
