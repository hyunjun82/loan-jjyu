"use client";

import { CheckCircle, XCircle, Minus } from "lucide-react";

export interface ComparisonColumn {
  name: string;
  highlight?: boolean;
}

export interface ComparisonRow {
  label: string;
  values: (string | boolean | null)[];
}

export function ComparisonTable({
  columns,
  rows,
  title,
}: {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  title?: string;
}) {
  return (
    <div className="my-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {title && (
        <div className="border-b bg-gray-50 px-5 py-3">
          <h4 className="text-sm font-bold text-gray-700">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left px-4 py-3 bg-gray-50 text-gray-500 font-medium w-1/3">
                항목
              </th>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`text-center px-4 py-3 font-bold ${
                    col.highlight
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {col.name}
                  {col.highlight && (
                    <span className="ml-1 inline-block text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full align-middle">
                      추천
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, ri) => (
              <tr key={ri} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-600 font-medium">{row.label}</td>
                {row.values.map((val, vi) => (
                  <td
                    key={vi}
                    className={`px-4 py-3 text-center ${
                      columns[vi]?.highlight ? "bg-blue-50/30" : ""
                    }`}
                  >
                    {val === true ? (
                      <CheckCircle className="h-4.5 w-4.5 text-blue-600 mx-auto" />
                    ) : val === false ? (
                      <XCircle className="h-4.5 w-4.5 text-red-400 mx-auto" />
                    ) : val === null ? (
                      <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                    ) : (
                      <span className="text-gray-700">{val}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
