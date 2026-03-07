import { Phone, MapPin, ExternalLink, Clock } from "lucide-react";

export interface ContactInfo {
  name: string;
  description?: string;
  phone?: string;
  address?: string;
  hours?: string;
  url?: string;
  urlLabel?: string;
}

export function ContactCard({ contacts }: { contacts: ContactInfo[] }) {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2">
      {contacts.map((c, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
        >
          <h4 className="text-sm font-bold text-gray-900">{c.name}</h4>
          {c.description && (
            <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>
          )}
          <div className="mt-3 space-y-2">
            {c.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <a
                  href={`tel:${c.phone.replace(/[^0-9]/g, "")}`}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  {c.phone}
                </a>
              </div>
            )}
            {c.hours && (
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-500">{c.hours}</span>
              </div>
            )}
            {c.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-500">{c.address}</span>
              </div>
            )}
            {c.url && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <a
                  href={c.url}
                  rel="noopener"
                  className="text-xs text-blue-600 hover:underline"
                >
                  {c.urlLabel || "홈페이지 바로가기"}
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
