"use client";

import { useState } from "react";
import { Calculator as CalcIcon } from "lucide-react";

export interface CalcField {
  key: string;
  label: string;
  placeholder?: string;
  unit?: string;
  type?: "number" | "select";
  options?: { label: string; value: string }[];
  defaultValue?: string;
}

export interface CalcResult {
  label: string;
  formula: (values: Record<string, number | string>) => string;
  highlight?: boolean;
}

export function Calculator({
  title,
  description,
  fields,
  results,
}: {
  title: string;
  description?: string;
  fields: CalcField[];
  results: CalcResult[];
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => {
      init[f.key] = f.defaultValue || "";
    });
    return init;
  });

  const [calculated, setCalculated] = useState(false);

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setCalculated(false);
  };

  const handleCalc = () => setCalculated(true);

  const parsedValues: Record<string, number | string> = {};
  for (const [k, v] of Object.entries(values)) {
    const num = parseFloat(v);
    parsedValues[k] = isNaN(num) ? v : num;
  }

  return (
    <div className="my-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b bg-gray-50 px-5 py-3 flex items-center gap-2">
        <CalcIcon className="h-4 w-4 text-blue-600" />
        <h4 className="text-sm font-bold text-gray-700">{title}</h4>
      </div>
      {description && (
        <p className="px-5 pt-3 text-xs text-gray-400">{description}</p>
      )}
      <div className="p-5 space-y-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {f.label}
            </label>
            {f.type === "select" && f.options ? (
              <select
                value={values[f.key] || ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                <option value="">선택하세요</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={values[f.key] || ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder || "0"}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 pr-12"
                />
                {f.unit && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {f.unit}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
        <button
          onClick={handleCalc}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          계산하기
        </button>
      </div>
      {calculated && (
        <div className="border-t bg-blue-50/50 px-5 py-4 space-y-2">
          {results.map((r, i) => {
            let resultVal: string;
            try {
              resultVal = r.formula(parsedValues);
            } catch {
              resultVal = "\u2014";
            }
            return (
              <div
                key={i}
                className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                  r.highlight ? "bg-white border border-blue-200" : ""
                }`}
              >
                <span className="text-sm text-gray-600">{r.label}</span>
                <span
                  className={`text-sm font-bold ${
                    r.highlight ? "text-blue-700 text-base" : "text-gray-900"
                  }`}
                >
                  {resultVal}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
