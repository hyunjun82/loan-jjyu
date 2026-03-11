"use client";

import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import { hubArticles } from "@/data/articles";

interface RelatedSpokesProps {
  categorySlug: string;
  currentSlug: string;
}

export function RelatedSpokes({ categorySlug, currentSlug }: RelatedSpokesProps) {
  const hub = hubArticles[categorySlug];
  if (!hub) return null;

  const allOtherSpokes = hub.spokes.filter((s) => s.slug !== currentSlug);
  if (allOtherSpokes.length === 0) return null;

  const displaySpokes = allOtherSpokes.slice(0, 3);
  const moreCount = allOtherSpokes.length;

  return (
    <section className="mb-8">
      <Link
        href={`/${categorySlug}`}
        className="group flex items-center justify-center gap-2.5 w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-5 py-4 text-white font-bold text-base transition-all shadow-sm hover:shadow-md mb-5"
      >
        <BookOpen className="h-5 w-5 shrink-0" />
        <span>{hub.categorySlug} 대출 정보 {moreCount}개 전체 보기</span>
        <ChevronRight className="h-5 w-5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 mt-3">
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          📋 관련 대출 정보도 확인해 보세요
        </h3>
        <div className="space-y-2.5">
          {displaySpokes.map((spoke) => (
            <Link
              key={spoke.slug}
              href={`/${categorySlug}/${spoke.slug}`}
              className="group flex items-start gap-2.5 rounded-lg bg-white px-4 py-3 border border-gray-100 transition-all hover:border-blue-200 hover:shadow-sm"
            >
              <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
              <div className="min-w-0">
                <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {spoke.title}
                </span>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {spoke.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
