import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  hint,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {delta && (
          <span className="flex items-center gap-0.5 font-semibold text-emerald-500">
            <ArrowUpRight className="h-3 w-3" /> {delta}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
