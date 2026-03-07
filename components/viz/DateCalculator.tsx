"use client";

import { useState } from "react";
import { CalendarDays, Clock } from "lucide-react";

export interface DateCalcPreset {
  label: string;
  days: number;
  description?: string;
}

export function DateCalculator({
  title,
  presets,
  description,
}: {
  title: string;
  presets?: DateCalcPreset[];
  description?: string;
}) {
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("");
  const [result, setResult] = useState<{ target: string; remaining: number } | null>(null);

  const calculate = (inputDays?: number) => {
    const d = inputDays ?? parseInt(days);
    if (!startDate || isNaN(d)) return;
    const start = new Date(startDate);
    const target = new Date(start);
    target.setDate(target.getDate() + d);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const yy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, "0");
    const dd = String(target.getDate()).padStart(2, "0");
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = weekdays[target.getDay()];

    setResult({
      target: `${yy}년 ${parseInt(mm)}월 ${parseInt(dd)}일 (${dayOfWeek})`,
      remaining: diff,
    });
  };

  const selectPreset = (preset: DateCalcPreset) => {
    setDays(String(preset.days));
    if (startDate) {
      calculate(preset.days);
    }
  };

  return (
    <div className="my-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b bg-gray-50 px-5 py-3 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-blue-600" />
        <h4 className="text-sm font-bold text-gray-700">{title}</h4>
      </div>
      {description && (
        <p className="px-5 pt-3 text-xs text-gray-400">{description}</p>
      )}
      <div className="p-5 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">기준일</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setResult(null); }}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        {presets && presets.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">기간 선택</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => selectPreset(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    days === String(p.days)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">또는 개월 수 직접 입력</label>
          <div className="relative">
            <input
              type="number"
              value={days}
              onChange={(e) => { setDays(e.target.value); setResult(null); }}
              placeholder="30"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">일</span>
          </div>
        </div>

        <button
          onClick={() => calculate()}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="border-t bg-blue-50/50 px-5 py-4">
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white border border-blue-200">
            <span className="text-sm text-gray-600">상환 완료일</span>
            <span className="text-base font-bold text-blue-700">{result.target}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 px-3">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className={`text-sm font-medium ${result.remaining > 0 ? "text-blue-600" : "text-red-600"}`}>
              {result.remaining > 0
                ? `오늘부터 ${result.remaining}일 남았어요`
                : result.remaining === 0
                  ? "오늘이 상환일이에요!"
                  : `${Math.abs(result.remaining)}일 지났어요`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
