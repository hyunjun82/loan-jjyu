export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleSection {
  title: string;
  content: string;
}

export interface LoanProductInfo {
  name: string;
  category: string;
  description: string;
  interestRate: string;
  limit: string;
  period: string;
  provider: string;
  ctaLabel: string;
  ctaUrl: string;
  updatedAt: string;
}

export interface LoanConditionRow {
  label: string;
  value: string;
  type: "core" | "eligibility" | "note";
}

export interface LoanSpokeArticle {
  slug: string;
  categorySlug: string;
  title: string;
  h1: string;
  metaDescription: string;
  description: string;
  heroDescription: string;
  productInfo?: LoanProductInfo;
  conditions?: LoanConditionRow[];
  faq: FAQItem[];
  sections: ArticleSection[];
  datePublished?: string;
  dateModified?: string;
}

export interface LoanHubArticle {
  categorySlug: string;
  title: string;
  h1: string;
  metaDescription: string;
  description: string;
  heroDescription: string;
  spokes: { slug: string; title: string; description: string }[];
  datePublished?: string;
  dateModified?: string;
}

export interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
  count: number;
}
