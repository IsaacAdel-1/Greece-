import Link from "next/link";
import { getAnalyticsSummary } from "@/lib/analytics/events";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { BarList, Panel, TrendChart } from "@/components/admin/charts";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;

export default async function AdminVisitorsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days: daysParam } = await searchParams;
  const days = RANGES.includes(Number(daysParam) as (typeof RANGES)[number])
    ? Number(daysParam)
    : 30;

  const a = await getAnalyticsSummary(days);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-ink">Visitors</h1>
          <p className="mt-2 font-sans text-base text-clay">
            Traffic over the last {days} days — pages, countries, devices and
            sources.
          </p>
        </div>
        <nav aria-label="Date range" className="flex gap-1">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/admin/visitors?days=${r}`}
              className={cn(
                "border px-3 py-2 font-sans text-xs uppercase tracking-luxe transition-colors",
                r === days
                  ? "border-brass bg-ink text-bone"
                  : "border-sand text-ink hover:border-brass",
              )}
            >
              {r}d
            </Link>
          ))}
        </nav>
      </div>

      {!isSupabaseConfigured() && (
        <p className="mt-4 border border-dashed border-sand bg-bone/60 p-3 font-sans text-xs text-clay">
          Showing in-memory dev data (resets on restart). Add Supabase keys to
          persist visitor analytics.
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total views" value={a.totalVisits} />
        <Stat label="Unique visitors" value={a.uniqueVisitors} />
        <Stat label="Countries" value={a.topCountries.length} />
        <Stat label="Top page" value={a.topPaths[0]?.label ?? "—"} small />
      </div>

      <Panel title={`Daily views — last ${days} days`} className="mt-4">
        <TrendChart data={a.byDay} />
      </Panel>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel title="Top pages">
          <BarList items={a.topPaths} />
        </Panel>
        <Panel title="Top countries">
          <BarList items={a.topCountries} emptyLabel="No country data (set on Vercel)" />
        </Panel>
        <Panel title="Traffic sources (referrers)">
          <BarList items={a.topReferrers} emptyLabel="Mostly direct / unknown" />
        </Panel>
        <div className="grid gap-4">
          <Panel title="Devices">
            <BarList items={a.byDevice} />
          </Panel>
          <Panel title="Browsers">
            <BarList items={a.byBrowser} />
          </Panel>
        </div>
      </div>

      <p className="mt-6 font-sans text-xs text-clay">
        Privacy: we store no raw IP addresses — unique visitors are counted via a
        salted daily hash. Bots are excluded. Source:{" "}
        <span className="text-ink">
          {a.source === "supabase" ? "Supabase" : "in-memory (dev)"}
        </span>
        .
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string | number;
  small?: boolean;
}) {
  return (
    <div className="border border-sand bg-bone p-5">
      <p className="font-sans text-xs uppercase tracking-luxe text-clay">{label}</p>
      <p
        className={cn(
          "mt-2 font-serif font-light text-ink",
          small ? "truncate text-lg" : "text-3xl",
        )}
        title={String(value)}
      >
        {value}
      </p>
    </div>
  );
}
