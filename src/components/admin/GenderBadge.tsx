import { cn } from "@/lib/utils";

/**
 * Displays a lead's gender. A self-declared value is shown as a solid badge;
 * a name-based GUESS is shown as a dashed/outlined badge with its confidence,
 * so the owner can always tell fact from estimate.
 */
export function GenderBadge({
  gender,
  guess,
  confidence,
}: {
  gender: "male" | "female" | "unspecified" | null;
  guess: "male" | "female" | "unknown" | null;
  confidence: number | null;
}) {
  const label = (g: "male" | "female") => (g === "female" ? "Female" : "Male");
  const tone = (g: "male" | "female") =>
    g === "female"
      ? "text-pink-800 border-pink-300 bg-pink-50"
      : "text-blue-800 border-blue-300 bg-blue-50";

  // 1. Self-declared, concrete.
  if (gender === "male" || gender === "female") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 border px-2 py-0.5 font-sans text-xs",
          tone(gender),
        )}
        title="Self-declared on the contact form"
      >
        {label(gender)}
      </span>
    );
  }

  // 2. Declared "prefer not to say".
  if (gender === "unspecified") {
    return <span className="font-sans text-xs text-clay">Not specified</span>;
  }

  // 3. Name-based guess (clearly marked as an estimate).
  if (guess === "male" || guess === "female") {
    const pct = Math.round((confidence ?? 0) * 100);
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 border border-dashed px-2 py-0.5 font-sans text-xs",
          tone(guess),
        )}
        title={`Estimated from the name — not declared (${pct}% confidence)`}
      >
        {label(guess)}? <span className="opacity-70">~{pct}%</span>
      </span>
    );
  }

  return <span className="font-sans text-xs text-clay">—</span>;
}
