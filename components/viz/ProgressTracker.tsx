"use client";

import { Check } from "lucide-react";

export interface ProgressStep {
  label: string;
}

export function ProgressTracker({
  steps,
  current = 0,
}: {
  steps: ProgressStep[];
  current?: number;
}) {
  return (
    <div className="my-6 overflow-x-auto">
      <div className="flex items-center min-w-max gap-0">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    done
                      ? "bg-blue-600 text-white"
                      : active
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={`mt-2 text-xs whitespace-nowrap font-medium ${
                    done || active ? "text-blue-700" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 h-[2px] w-12 sm:w-16 ${
                    i < current ? "bg-blue-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
