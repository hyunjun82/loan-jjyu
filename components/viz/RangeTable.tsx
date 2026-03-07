"use client";

import { useState } from "react";

export interface RangeRow {
  range: string;
  values: string[];
  highlight?: boolean;
}

export interface RangeHeader {
  label: string;
}

export function RangeTable({
  title,
  description,
  rowHeader,
  colHeaders,
  rows,
  highlightLabel,
}: {
  title: string;
  description?: string;
  rowHeader: string;
  colHeaders: RangeHeader[];
  rows: RangeRow[];
  highlightLabel?: string;
}) {
  const [activeRow, setActiveRow] = useState<number | null>(null);

  return (
    <div className="my-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b bg-gray-50 px-5 py-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-700">{title}</h4>
        {highlightLabel && (
          <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            {highlightLabel}
          </span>
        )}
      </div>
      {description && (
        <p className="px-5 pt-3 text-xs text-gray-400">{description}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left px-4 py-3 bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                {rowHeader}
              </th>
              {colHeaders.map((h, i) => (
                <th
                  key={i}
                  className="text-center px-4 py-3 bg-gray-50 text-gray-500 font-medium border-b border-gray-200"
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                onClick={() => setActiveRow(activeRow === ri ? null : ri)}
                className={`cursor-pointer transition-colors ${
                  row.highlight
                    ? "bg-blue-50/60 border-l-2 border-l-blue-500"
                    : activeRow === ri
                      ? "bg-gray-50"
                      : "hover:bg-gray-50"
                }`}
              >
                <td className={`px-4 py-3 border-b border-gray-100 font-medium ${row.highlight ? "text-blue-700" : "text-gray-700"}`}>
                  {row.range}
                </td>
                {row.values.map((v, vi) => (
                  <td
                    key={vi}
                    className={`px-4 py-3 border-b border-gray-100 text-center ${row.highlight ? "text-blue-700 font-semibold" : "text-gray-600"}`}
                  >
                    {v}
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
