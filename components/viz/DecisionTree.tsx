"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw, HelpCircle } from "lucide-react";

export interface TreeNode {
  id: string;
  question: string;
  helpText?: string;
  options: {
    label: string;
    nextId?: string;
    resultTitle?: string;
    resultDesc?: string;
    resultLink?: string;
  }[];
}

export function DecisionTree({
  title,
  nodes,
}: {
  title: string;
  nodes: TreeNode[];
}) {
  const [history, setHistory] = useState<string[]>([nodes[0]?.id || ""]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [finalResult, setFinalResult] = useState<{
    title: string;
    desc: string;
    link?: string;
  } | null>(null);

  const currentId = history[history.length - 1];
  const currentNode = nodes.find((n) => n.id === currentId);
  const stepNum = history.length;

  const handleSelect = (optionIdx: number) => {
    if (!currentNode) return;
    const option = currentNode.options[optionIdx];
    setSelectedOptions((prev) => ({ ...prev, [currentId]: optionIdx }));

    if (option.resultTitle) {
      setFinalResult({
        title: option.resultTitle,
        desc: option.resultDesc || "",
        link: option.resultLink,
      });
    } else if (option.nextId) {
      setHistory((prev) => [...prev, option.nextId!]);
      setFinalResult(null);
    }
  };

  const reset = () => {
    setHistory([nodes[0]?.id || ""]);
    setSelectedOptions({});
    setFinalResult(null);
  };

  const goBack = () => {
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setFinalResult(null);
    const removed = history[history.length - 1];
    setSelectedOptions((prev) => {
      const next = { ...prev };
      delete next[removed];
      return next;
    });
  };

  return (
    <div className="my-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b bg-gray-50 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-blue-600" />
          <h4 className="text-sm font-bold text-gray-700">{title}</h4>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> 처음부터
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 mb-4">
          {history.map((_, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${
                  i === history.length - 1 && !finalResult
                    ? "bg-blue-600 ring-2 ring-blue-200"
                    : "bg-blue-400"
                }`}
              />
              {i < history.length - 1 && <div className="h-[2px] w-4 bg-blue-300" />}
            </div>
          ))}
          {finalResult && (
            <>
              <div className="h-[2px] w-4 bg-blue-300" />
              <div className="h-2 w-2 rounded-full bg-blue-600 ring-2 ring-blue-200" />
            </>
          )}
        </div>

        {finalResult ? (
          <div className="text-center py-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-3">
              <ArrowRight className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">{finalResult.title}</h4>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">{finalResult.desc}</p>
            {finalResult.link && (
              <a
                href={finalResult.link}
                className="inline-block mt-3 text-sm text-blue-600 font-medium hover:underline"
              >
                자세히 보기 &rarr;
              </a>
            )}
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={goBack}
                className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                이전으로
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                다시 하기
              </button>
            </div>
          </div>
        ) : currentNode ? (
          <>
            <p className="text-sm font-medium text-gray-400 mb-1">질문 {stepNum}</p>
            <h4 className="text-[15px] font-bold text-gray-900 mb-1">{currentNode.question}</h4>
            {currentNode.helpText && (
              <p className="text-xs text-gray-400 mb-4">{currentNode.helpText}</p>
            )}
            <div className="space-y-2 mt-4">
              {currentNode.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-sm text-gray-700"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {history.length > 1 && (
              <button
                onClick={goBack}
                className="mt-3 text-xs text-gray-400 hover:text-blue-600 transition-colors"
              >
                &larr; 이전 질문
              </button>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
