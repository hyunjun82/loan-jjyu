import { AlertTriangle, Lightbulb, Info, ShieldAlert } from "lucide-react";

type BoxType = "warning" | "tip" | "info" | "danger";

const BOX_ICONS: Record<BoxType, React.ElementType> = {
  warning: AlertTriangle,
  tip: Lightbulb,
  info: Info,
  danger: ShieldAlert,
};

export function WarningBox({
  type = "warning",
  title,
  children,
}: {
  type?: BoxType;
  title: string;
  children: React.ReactNode;
}) {
  const Icon = BOX_ICONS[type];

  return (
    <div className="my-5 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="flex">
        <div className="w-1 shrink-0 bg-blue-500" />
        <div className="flex items-start gap-3 px-4 py-4">
          <Icon className="h-[18px] w-[18px] text-gray-400 shrink-0 mt-[1px]" />
          <div>
            <p className="text-[14px] font-bold text-gray-900">{title}</p>
            <div className="mt-1 text-[13px] text-gray-500 leading-[1.75]">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TipBox({ title, children }: { title: string; children: React.ReactNode }) {
  return <WarningBox type="tip" title={title}>{children}</WarningBox>;
}
