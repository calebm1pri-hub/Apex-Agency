import { cn } from "@/lib/utils";

/** Dependency-free bar chart for the analytics overview. */
export function MiniBarChart({
  data,
  className,
}: {
  data: { label: string; value: number }[];
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={cn("flex h-40 items-end gap-2", className)}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-blush-500 to-rose-300 transition-all"
              style={{ height: `${(d.value / max) * 100}%` }}
              title={`${d.value}`}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
