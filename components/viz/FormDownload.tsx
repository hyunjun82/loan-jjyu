import { FileDown, FileText } from "lucide-react";

export interface FormFile {
  name: string;
  description: string;
  fileType?: string;
  url?: string;
  note?: string;
}

export function FormDownload({ items = [] }: { items: FormFile[] }) {
  if (!items.length) return null;
  return (
    <div className="my-6 space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 shrink-0">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
              {item.note && (
                <p className="text-xs text-amber-600 mt-1">{item.note}</p>
              )}
            </div>
          </div>
          {item.url ? (
            <a
              href={item.url}
              download
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shrink-0"
            >
              <FileDown className="h-3.5 w-3.5" />
              {item.fileType || "PDF"}
            </a>
          ) : (
            <span className="text-xs text-gray-300 shrink-0">기관 제공</span>
          )}
        </div>
      ))}
    </div>
  );
}
