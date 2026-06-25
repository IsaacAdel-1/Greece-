import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small overline label above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Heading level for correct document outline. Defaults to h2. */
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/** Consistent section header: eyebrow + serif title + optional description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-4 font-sans text-xs uppercase tracking-luxe text-brass">
          {eyebrow}
        </p>
      )}
      <Tag className="font-serif text-4xl font-light leading-tight text-ink md:text-5xl">
        {title}
      </Tag>
      {description && (
        <p className="mt-4 font-sans text-sm leading-relaxed text-clay">
          {description}
        </p>
      )}
    </div>
  );
}
