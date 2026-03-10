import { Fragment } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { FAQSection } from "@/components/FAQSection";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ShareButtons } from "@/components/ShareButtons";
import { AuthorBio } from "@/components/AuthorBio";
import { ProductInfoCard } from "@/components/ProductInfoCard";
import { LoanConditionTable } from "@/components/LoanConditionTable";
import { ArticleViz } from "@/components/ArticleViz";
import { RelatedSpokes } from "@/components/RelatedSpokes";
import { getSpokeArticle } from "@/data/articles";
import { spokeArticles } from "@/data/articles";
import { categories } from "@/data/categories";
import {
  ChevronRight,
  ArrowLeft,
  FileText,
  UserCheck,
  Percent,
  ClipboardList,
  FileStack,
  AlertTriangle,
} from "lucide-react";

function formatKoreanDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
}

const SECTION_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  "상품 개요": { icon: FileText, color: "text-blue-500" },
  개요: { icon: FileText, color: "text-blue-500" },
  "신청자격": { icon: UserCheck, color: "text-emerald-500" },
  자격: { icon: UserCheck, color: "text-emerald-500" },
  "금리": { icon: Percent, color: "text-amber-500" },
  한도: { icon: Percent, color: "text-amber-500" },
  "신청방법": { icon: ClipboardList, color: "text-violet-500" },
  신청: { icon: ClipboardList, color: "text-violet-500" },
  "필요서류": { icon: FileStack, color: "text-cyan-500" },
  서류: { icon: FileStack, color: "text-cyan-500" },
  "주의사항": { icon: AlertTriangle, color: "text-red-500" },
  주의: { icon: AlertTriangle, color: "text-red-500" },
};

function getSectionIcon(title: string) {
  for (const [keyword, config] of Object.entries(SECTION_ICONS)) {
    if (title.includes(keyword)) return config;
  }
  return { icon: FileText, color: "text-gray-400" };
}

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const allParams: { category: string; slug: string }[] = [];
  for (const [categorySlug, spokes] of Object.entries(spokeArticles)) {
    for (const spokeSlug of Object.keys(spokes)) {
      allParams.push({ category: categorySlug, slug: spokeSlug });
    }
  }
  return allParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const catSlug = decodeURIComponent(category);
  const spokeSlug = decodeURIComponent(slug);
  const article = getSpokeArticle(catSlug, spokeSlug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.metaDescription,
    authors: [{ name: "서민금융 에디터" }],
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      locale: "ko_KR",
    },
  };
}

export default async function SpokePage({ params }: PageProps) {
  const { category, slug } = await params;
  const catSlug = decodeURIComponent(category);
  const spokeSlug = decodeURIComponent(slug);
  const article = getSpokeArticle(catSlug, spokeSlug);
  const catInfo = categories.find((c) => c.slug === catSlug);

  if (!article || !catInfo) notFound();

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">홈</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/${catSlug}`} className="hover:text-blue-600">{catInfo.name}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900 font-medium">{spokeSlug}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <span className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
            {catInfo.icon} {catInfo.name}
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {article.h1}
          </h1>
          <p className="mt-3 text-base text-gray-500 leading-relaxed sm:text-lg">
            {article.heroDescription}
          </p>
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-400">
            <span className="font-medium text-gray-500">서민금융 에디터</span>
            {article.datePublished && (
              <>
                <span>|</span>
                <time dateTime={article.dateModified || article.datePublished}>
                  {formatKoreanDate(article.datePublished)} 작성
                </time>
              </>
            )}
            {article.dateModified && article.dateModified !== article.datePublished && (
              <>
                <span>|</span>
                <time dateTime={article.dateModified}>
                  {formatKoreanDate(article.dateModified)} 수정
                </time>
              </>
            )}
          </div>
          <div className="mt-4">
            <ShareButtons title={article.title} />
          </div>
        </div>
      </section>

      {/* 2-column layout */}
      <div className="mx-auto max-w-5xl px-4 lg:flex lg:gap-8">
        <div className="flex-1 max-w-3xl">
          {/* Product Info Card */}
          {article.productInfo && (
            <div className="py-6">
              <ProductInfoCard info={article.productInfo} />
            </div>
          )}

          {/* Article Sections */}
          <article>
            {article.sections.map((section, i) => {
              const { icon: Icon, color } = getSectionIcon(section.title);
              return (
                <Fragment key={i}>
                  <section className="py-6">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 ${color}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                    </div>
                    {/* Viz: 첫 번째 섹션 소제목 아래에만 표시 */}
                    {i === 0 && <ArticleViz slug={catSlug} spokeSlug={spokeSlug} position="top" />}
                    <div className="text-[15px] text-gray-600 leading-[1.85] sm:text-[16px] pl-[42px] space-y-3">
                      {section.content.includes("<p>") ? (
                        <div className="prose-custom" dangerouslySetInnerHTML={{ __html: section.content }} />
                      ) : (
                        section.content.split("\n\n").map((paragraph, pi) => (
                          <p key={pi}>{paragraph}</p>
                        ))
                      )}
                    </div>
                    {i < article.sections.length - 1 && <hr className="mt-8 border-gray-200" />}
                  </section>
                  {i === 0 && article.conditions && article.conditions.length > 0 && (
                    <>
                      <LoanConditionTable conditions={article.conditions} slug={spokeSlug} />
                      <hr className="mt-2 border-gray-200" />
                    </>
                  )}
                  <ArticleViz slug={catSlug} spokeSlug={spokeSlug} position={`after-${i}` as `after-${number}`} />

                  {/* 관련 대출 정보: 2번째 섹션(i=1) 이후 본문 중간 배치 */}
                  {i === 1 && <RelatedSpokes categorySlug={catSlug} currentSlug={spokeSlug} />}
                </Fragment>
              );
            })}
          </article>

          {/* FAQ */}
          {article.faq.length > 0 && (
            <div className="pb-4">
              <FAQSection items={article.faq} />
            </div>
          )}

          {/* Author */}
          <AuthorBio
            categoryName={catInfo.name}
            datePublished={article.datePublished}
            dateModified={article.dateModified}
          />

          {/* Back Links */}
          <div className="py-8 flex gap-4">
            <Link
              href={`/${catSlug}`}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {catInfo.name} 가이드로 돌아가기
            </Link>
          </div>
        </div>

        {/* PC Sidebar */}
        <CategorySidebar categorySlug={catSlug} currentSlug={spokeSlug} />
      </div>

      {/* Article 스키마 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            datePublished: article.datePublished,
            dateModified: article.dateModified,
            author: { "@type": "Person", name: "서민금융 에디터" },
            publisher: { "@type": "Organization", name: "서민금융한눈에" },
            inLanguage: "ko",
          }),
        }}
      />

      {/* FAQPage 스키마 */}
      {article.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: article.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      )}

      {/* BreadcrumbList 스키마 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "홈", item: "https://loan.jjyu.co.kr" },
              { "@type": "ListItem", position: 2, name: catInfo.name, item: `https://loan.jjyu.co.kr/${catSlug}` },
              { "@type": "ListItem", position: 3, name: spokeSlug, item: `https://loan.jjyu.co.kr/${catSlug}/${spokeSlug}` },
            ],
          }),
        }}
      />
    </>
  );
}
