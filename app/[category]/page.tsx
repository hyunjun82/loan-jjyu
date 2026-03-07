import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getHubArticle } from "@/data/articles";
import { categories } from "@/data/categories";
import { ChevronRight, ArrowLeft } from "lucide-react";

function formatKoreanDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const slug = decodeURIComponent(category);
  const hub = getHubArticle(slug);
  if (!hub) return {};
  return {
    title: hub.title,
    description: hub.metaDescription,
    openGraph: {
      title: hub.title,
      description: hub.metaDescription,
      type: "website",
      locale: "ko_KR",
    },
  };
}

export default async function HubPage({ params }: PageProps) {
  const { category } = await params;
  const slug = decodeURIComponent(category);
  const hub = getHubArticle(slug);
  const catInfo = categories.find((c) => c.slug === slug);

  if (!hub || !catInfo) notFound();

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">홈</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900 font-medium">{catInfo.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <span className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
            {catInfo.icon} {catInfo.name} 가이드
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {hub.h1}
          </h1>
          <p className="mt-3 text-base text-gray-500 leading-relaxed max-w-2xl">
            {hub.heroDescription}
          </p>
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-400">
            <span className="font-medium text-gray-500">서민금융 에디터</span>
            {hub.dateModified && (
              <>
                <span>|</span>
                <time dateTime={hub.dateModified}>{formatKoreanDate(hub.dateModified)} 업데이트</time>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Spoke Articles List */}
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">상세 가이드</h2>
        <div className="grid gap-3">
          {hub.spokes.map((spoke) => (
            <Link
              key={spoke.slug}
              href={`/${slug}/${spoke.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {spoke.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{spoke.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-blue-600 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Back Link */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> 전체 카테고리 보기
        </Link>
      </div>

      {/* BreadcrumbList 스키마 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "홈", item: "https://loan.jjyu.co.kr" },
              { "@type": "ListItem", position: 2, name: catInfo.name, item: `https://loan.jjyu.co.kr/${slug}` },
            ],
          }),
        }}
      />

      {/* ItemList 스키마 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${catInfo.name} 가이드`,
            description: hub.description,
            numberOfItems: hub.spokes.length,
            itemListElement: hub.spokes.map((spoke, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: spoke.title,
              url: `https://loan.jjyu.co.kr/${slug}/${spoke.slug}`,
            })),
          }),
        }}
      />
    </>
  );
}
