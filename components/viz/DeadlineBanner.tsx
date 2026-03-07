"use client";

import { AlertTriangle, Clock, Bell } from "lucide-react";

export interface DeadlineInfo {
  title: string;
  date: string;
  description?: string;
}

function getDaysRemaining(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdays[d.getDay()]})`;
}

export function DeadlineBanner({ deadlines }: { deadlines: DeadlineInfo[] }) {
  return (
    <div className="my-6 space-y-2">
      {deadlines.map((dl, i) => {
        const remaining = getDaysRemaining(dl.date);
        const isUrgent = remaining <= 7 && remaining > 0;
        const isExpired = remaining <= 0;

        return (
          <div
            key={i}
            className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${
              isExpired
                ? "bg-red-50 border-red-200"
                : isUrgent
                  ? "bg-amber-50 border-amber-200"
                  : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
                isExpired
                  ? "bg-red-100"
                  : isUrgent
                    ? "bg-amber-100"
                    : "bg-blue-50"
              }`}
            >
              {isExpired ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : isUrgent ? (
                <Bell className="h-5 w-5 text-amber-500" />
              ) : (
                <Clock className="h-5 w-5 text-blue-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900">{dl.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(dl.date)}
                {dl.description && <> &middot; {dl.description}</>}
              </p>
            </div>

            <div
              className={`text-center shrink-0 px-3 py-1.5 rounded-lg ${
                isExpired
                  ? "bg-red-500 text-white"
                  : isUrgent
                    ? "bg-amber-500 text-white"
                    : "bg-blue-600 text-white"
              }`}
            >
              <p className="text-lg font-extrabold leading-tight">
                {isExpired ? `+${Math.abs(remaining)}` : remaining === 0 ? "D-Day" : `D-${remaining}`}
              </p>
              <p className="text-[10px] font-medium opacity-80">
                {isExpired ? "일 초과" : remaining === 0 ? "오늘" : "일 남음"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
