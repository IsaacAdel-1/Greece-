import { cn } from "@/lib/utils";

/** Centered max-width wrapper with consistent responsive gutters. */
export function Container({
  children,
  className,
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "main";
  /** Optional anchor id, so the navbar can link straight to a section. */
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn("mx-auto w-full max-w-content px-6 md:px-10", className)}
    >
      {children}
    </Tag>
  );
}
