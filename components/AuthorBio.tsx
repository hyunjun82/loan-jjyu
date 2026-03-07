import { Calendar, Database, Landmark } from "lucide-react";

interface AuthorBioProps {
  categoryName?: string;
  datePublished?: string;
  dateModified?: string;
}

function formatKoreanDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
}

export function AuthorBio({ categoryName, datePublished, dateModified }: AuthorBioProps) {
  return (
    <section className="mx-auto max-w-3xl py-6">
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Landmark className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-gray-900">서민금융 에디터</span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                금융상품 정보 전문
              </span>
              {categoryName && (
                <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500">
                  {categoryName}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
              공공데이터 기반으로 서민금융 상품 정보를 쉽게 풀어드려요.
              정확한 정보 전달을 위해 금융위원회·서민금융진흥원 공식 데이터를 활용해요.
            </p>
            {(datePublished || dateModified) && (
              <div className="mt-2 flex items-center gap-3 flex-wrap text-[11px] text-gray-400">
                {datePublished && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> 작성 {formatKoreanDate(datePublished)}
                  </span>
                )}
                {dateModified && dateModified !== datePublished && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> 수정 {formatKoreanDate(dateModified)}
                  </span>
                )}
              </div>
            )}
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                <Database className="h-2.5 w-2.5" /> 금융위원회 공공데이터
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
