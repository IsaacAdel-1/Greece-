"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

/**
 * Site header. Transparent over the hero at the top of the page, then fades to
 * a solid bar once scrolled. Collapses to a slide-in panel on mobile.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Which home-page section is currently in view, so the matching nav item
  // lights up as you scroll or click an anchor. "" = top of page (Home).
  // Only meaningful on the home page; cleared on every other route.
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy for the home page's anchored sections (order matters: top→bottom).
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }
    const ids = ["collections", "work", "contact"];
    const onScroll = () => {
      // A probe line a third of the way down the viewport. The last section
      // whose top has passed it is the one we consider "current".
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) current = id;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    // On the home page, highlighting follows the section in view, never the URL.
    if (pathname === "/") {
      if (href.includes("#")) return activeSection === href.split("#")[1];
      if (href === "/") return activeSection === ""; // top of page
      return false; // links to other routes (e.g. About) aren't active here
    }
    // On any other route, only a real page link can be active — section anchors
    // and Home never are. This stops About/Contact from "sticking" once you
    // navigate away.
    if (href === "/" || href.includes("#")) return false;
    return pathname.startsWith(href);
  };

  // The header is only transparent over a *dark* hero on the home page. On every
  // other page the top of the page is the light bone background, so the header
  // must use its dark-on-light treatment even before scrolling — otherwise the
  // light wordmark and nav vanish against the cream background.
  const overHero = pathname === "/" && !scrolled && !menuOpen;

  // The admin area has its own chrome; never show the public header there.
  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-luxe",
        scrolled || menuOpen
          ? "bg-bone/95 backdrop-blur supports-[backdrop-filter]:bg-bone/80"
          : "bg-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — home`}
          className={cn(
            overHero && "drop-shadow-[0_1px_4px_rgba(26,24,21,0.55)]",
          )}
        >
          {/* Light wordmark only while transparent over the dark home hero;
              navy everywhere else (incl. once scrolled) so it stays legible on
              the bone background. The "Furniture Solution" line is kept to the
              footer to keep the header clean. */}
          <Logo light={overHero} tagline={false} />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className={cn(
            "hidden md:block",
            // Lift the links off busy hero imagery so they stay vibrant.
            overHero && "drop-shadow-[0_1px_4px_rgba(26,24,21,0.55)]",
          )}
        >
          <ul className="flex items-center gap-10">
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative inline-block py-1 font-sans text-xs uppercase tracking-luxe transition-colors duration-300",
                      active
                        ? overHero
                          ? "text-bone"
                          : "text-brass"
                        : overHero
                          ? "text-bone/80 hover:text-bone"
                          : "text-ink hover:text-brass",
                    )}
                  >
                    {item.label}
                    {/* Brass underline: solid for the current page, sliding in
                        on hover — a clear, vibrant active indicator on both the
                        transparent and scrolled header. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-brass transition-transform duration-300 ease-luxe",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className={cn(
            "md:hidden p-2",
            overHero
              ? "text-bone drop-shadow-[0_1px_4px_rgba(26,24,21,0.55)]"
              : "text-ink",
          )}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ) : (
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            )}
          </svg>
        </button>
      </Container>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        className={cn(
          "md:hidden overflow-hidden border-t border-sand transition-[max-height] duration-500 ease-luxe",
          menuOpen ? "max-h-96" : "max-h-0 border-t-0",
        )}
      >
        <nav aria-label="Mobile" className="bg-bone">
          <ul className="flex flex-col px-6 py-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href} className="border-b border-sand/60 last:border-0">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block py-4 font-sans text-sm uppercase tracking-luxe",
                    isActive(item.href) ? "text-brass" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
