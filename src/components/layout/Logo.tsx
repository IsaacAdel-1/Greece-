import { cn } from "@/lib/utils";

/**
 * Grees wordmark, recreated in type to match the brand lockup:
 *   "Grees" (navy serif) + "&" (gold) over "Furniture solution".
 *
 * Built as text rather than an image so it stays crisp at any size, themes for
 * light/dark backgrounds, and needs no asset loading. Pass `light` to render
 * the on-image (header-over-hero) variant.
 */
export function Logo({
  className,
  light = false,
  tagline = true,
}: {
  className?: string;
  light?: boolean;
  /** Show the "Furniture Solution" line under the wordmark. */
  tagline?: boolean;
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className="flex items-baseline font-serif text-2xl tracking-tight">
        <span className={light ? "text-bone" : "text-navy"}>Grees</span>
        <span className="ml-0.5 text-brass">&amp;</span>
      </span>
      {tagline && (
        <span
          className={cn(
            "mt-1 font-sans text-[0.6rem] uppercase tracking-luxe",
            light ? "text-bone/80" : "text-clay",
          )}
        >
          Furniture Solution
        </span>
      )}
    </span>
  );
}
