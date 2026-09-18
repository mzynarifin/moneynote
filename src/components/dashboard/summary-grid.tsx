import { formatCurrency } from "@/lib/format";

interface SummaryProps {
  label: string;
  value: number;
  accent: string;
  icon?: React.ReactNode;
}

export function SummaryGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {children}
    </div>
  );
}

export function SummaryCard({ label, value, accent, icon }: SummaryProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        {icon ? <span className="text-muted">{icon}</span> : null}
      </div>
      <p className={"mt-2 text-xl font-bold sm:text-2xl " + accent}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}
