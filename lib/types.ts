export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleSection {
  title: string;
  content: string;
}

export interface LoanSpokeArticle {
  slug: string;
  categorySlug: string;
  title: string;
  h1: string;
  metaDescription: string;
  description: string;
  heroDescription: string;
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
