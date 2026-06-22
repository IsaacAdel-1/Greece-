import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "outline-light" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-none font-sans text-xs uppercase tracking-luxe transition-colors duration-300 ease-luxe focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-bone hover:bg-brass",
  outline: "border border-ink text-ink hover:bg-ink hover:text-bone",
  // For dark backgrounds: a bone outline that fills on hover. Its own variant
  // (rather than overriding `outline` via className) avoids Tailwind class
  // conflicts that could resolve to dark-on-dark and hide the button.
  "outline-light": "border border-bone text-bone hover:bg-bone hover:text-ink",
  ghost: "text-ink hover:text-brass",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5",
  md: "px-8 py-4",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/**
 * Polymorphic button. Renders a Next <Link> when `href` is provided, otherwise
 * a native <button>. Keeps call sites tidy and styling uniform across both.
 */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  );
}
