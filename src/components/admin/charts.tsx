import type { CountItem, DayCount } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

/**
 * Dependency-free dashboard charts built from plain divs/SVG. For a catalog
 * site's analytics this is lighter and fully themeable, with no client JS.
 */

/** Horizontal ranked bars (top paths, countries, devices, …). */
export function BarList({
  items,
  emptyLabel = "No data yet",
  formatLabel,
}: {
  items: CountItem[];
  emptyLabel?: string;
  formatLabel?: (label: string) => string;
}) {
  if (items.length === 0) {
    return <p className="font-sans text-sm text-clay">{emptyLabel}</p>;
  }
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate font-sans text-sm text-ink" title={item.label}>
              {formatLabel ? formatLabel(item.label) : item.label}
            </span>
            <span className="shrink-0 font-sans text-xs tabular-nums text-clay">
              {item.count}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full bg-sand">
            <div
              className="h-1.5 bg-brass"
              style={{ width: `${Math.round((item.count / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Daily visits as a column chart. */
export function TrendChart({ data }: { data: DayCount[] }) {
  if (data.length === 0) {
    return <p className="font-sans text-sm text-clay">No visits recorded yet.</p>;
  }
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex h-32 items-end gap-px" role="img" aria-label="Daily visits">
      {data.map((d) => (
        <div key={d.date} className="group relative flex-1">
          <div
            className={cn(
              "w-full bg-brass/80 transition-colors group-hover:bg-brass",
              d.count === 0 && "bg-sand",
            )}
            style={{ height: `${Math.max(2, Math.round((d.count / max) * 100))}%` }}
          />
          {/* Tooltip */}
          <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap bg-ink px-2 py-1 font-sans text-[10px] text-bone group-hover:block">
            {d.date}: {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}

/** A titled panel wrapper used across the dashboard. */
export function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-sand bg-bone p-6", className)}>
      <h2 className="font-sans text-xs uppercase tracking-luxe text-clay">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
