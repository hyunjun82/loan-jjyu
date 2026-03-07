"use client";

export interface TimelineStep {
  step: string;
  title: string;
  desc: string;
}

export function ProcessTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="my-6">
      <div className="relative">
        {steps.map((s, i) => (
          <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
            {i < steps.length - 1 && (
              <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-gray-200" />
            )}
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold shadow-sm">
              {s.step}
            </div>
            <div className="pt-1.5">
              <h4 className="text-[15px] font-bold text-gray-900">{s.title}</h4>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
