import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";
import {
  countInquiries,
  countUnreadInquiries,
  getGenderBreakdown,
} from "@/lib/inquiries/repository";
import { getAnalyticsSummary } from "@/lib/analytics/events";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { BarList, Panel, TrendChart } from "@/components/admin/charts";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, categories, totalInquiries, unread, gender, analytics] =
    await Promise.all([
      getProducts(),
      getCategories(),
      countInquiries(),
      countUnreadInquiries(),
      getGenderBreakdown(),
      getAnalyticsSummary(14),
    ]);

  const stats = [
    { label: "Products", value: products.length, href: "/admin/products" },
    { label: "Categories", value: categories.length, href: "/admin/products" },
    {
      label: "Inquiries",
      value: totalInquiries,
      href: "/admin/inquiries",
      note: unread > 0 ? `${unread} unread` : undefined,
    },
    {
      label: "Visitors (14d)",
      value: analytics.uniqueVisitors,
      href: "/admin/visitors",
      note: `${analytics.totalVisits} views`,
    },
  ];

  const genderTotal = gender.male + gender.female + gender.unknown;
  const genderItems = [
    { label: "Female", count: gender.female },
    { label: "Male", count: gender.male },
    { label: "Unknown", count: gender.unknown },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-ink">Dashboard</h1>
      <p className="mt-2 font-sans text-base text-clay">
        Manage your catalogue, read inquiries, and watch traffic.
      </p>

      {!isSupabaseConfigured() && (
        <p className="mt-4 border border-dashed border-sand bg-bone/60 p-3 font-sans text-xs text-clay">
          Running without Supabase — numbers below come from the in-memory dev
          store and reset on restart. Add Supabase keys to make everything
          durable.
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="border border-sand bg-bone p-6 transition-colors hover:border-brass"
          >
            <p className="font-sans text-xs uppercase tracking-luxe text-clay">
              {s.label}
            </p>
            <p className="mt-3 font-serif text-4xl font-light text-ink">
              {s.value}
            </p>
            {s.note && (
              <p className="mt-1 font-sans text-xs text-brass">{s.note}</p>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Panel title="Visits — last 14 days" className="lg:col-span-2">
          <TrendChart data={analytics.byDay} />
        </Panel>

        <Panel title="Leads by gender">
          {genderTotal === 0 ? (
            <p className="font-sans text-sm text-clay">No inquiries yet.</p>
          ) : (
            <>
              <BarList items={genderItems} />
              <p className="mt-3 font-sans text-[10px] text-clay">
                Self-declared where given, otherwise estimated from the name.
              </p>
            </>
          )}
        </Panel>

        <Panel title="Top countries">
          <BarList items={analytics.topCountries.slice(0, 5)} />
        </Panel>
        <Panel title="Top pages">
          <BarList items={analytics.topPaths.slice(0, 5)} />
        </Panel>
        <Panel title="Devices">
          <BarList items={analytics.byDevice} />
        </Panel>
      </div>

      <p className="mt-6 font-sans text-xs text-clay">
        Data source:{" "}
        <span className="text-ink">
          {analytics.source === "supabase" ? "Supabase" : "in-memory (dev)"}
        </span>
        . See the full breakdown on the{" "}
        <Link href="/admin/visitors" className="text-brass hover:underline">
          Visitors
        </Link>{" "}
        page.
      </p>
    </div>
  );
}
