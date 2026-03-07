"use client";

import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

export interface EligibilityQuestion {
  question: string;
  helpText?: string;
}

export function EligibilityChecker({
  questions,
  passMessage = "신청 자격이 있어요!",
  failMessage = "일부 조건이 충족되지 않았어요.",
}: {
  questions: EligibilityQuestion[];
  passMessage?: string;
  failMessage?: string;
}) {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const answered = Object.keys(answers).length;
  const allAnswered = answered === questions.length;
  const allYes = allAnswered && Object.values(answers).every((v) => v === true);

  const toggle = (i: number, val: boolean) => {
    setAnswers((prev) => ({ ...prev, [i]: val }));
  };

  const reset = () => setAnswers({});

  return (
    <div className="my-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b bg-gray-50 px-5 py-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-700">자격 요건 체크</h4>
        {answered > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> 초기화
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-100">
        {questions.map((q, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4 gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-700">{q.question}</p>
              {q.helpText && (
                <p className="text-xs text-gray-400 mt-0.5">{q.helpText}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => toggle(i, true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  answers[i] === true
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                예
              </button>
              <button
                onClick={() => toggle(i, false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  answers[i] === false
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                아니오
              </button>
            </div>
          </div>
        ))}
      </div>
      {allAnswered && (
        <div
          className={`px-5 py-4 flex items-center gap-3 ${
            allYes ? "bg-green-50 border-t border-green-200" : "bg-red-50 border-t border-red-200"
          }`}
        >
          {allYes ? (
            <CheckCircle className="h-5 w-5 text-blue-600 shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 shrink-0" />
          )}
          <p
            className={`text-sm font-medium ${allYes ? "text-blue-700" : "text-red-700"}`}
          >
            {allYes ? passMessage : failMessage}
          </p>
        </div>
      )}
    </div>
  );
}
