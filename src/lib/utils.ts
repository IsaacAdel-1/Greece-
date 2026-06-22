/**
 * Tiny class-name combiner. Filters falsy values and joins with spaces.
 * Avoids pulling in clsx/tailwind-merge for a project this size.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Format an ISO timestamp as a short, human date+time (e.g. "16 Jun 2026, 14:30"). */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
