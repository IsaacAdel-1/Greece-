"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Fire-and-forget page-view tracker.
 *
 * Records one event per pathname (including the App Router's client-side
 * navigations, which never reload the page). It sends the visitor's external
 * referrer once (on first load) and is fully non-blocking — a failed beacon is
 * silently ignored and never affects the page.
 *
 * The admin area is excluded so the owner's own usage doesn't pollute traffic.
 */
export function PageTracker() {
  const pathname = usePathname();
  // Avoid double-sending the same path (React strict mode mounts effects twice
  // in dev, and re-renders shouldn't re-fire).
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      ref: document.referrer || undefined,
    });

    // keepalive lets the request complete even if the user navigates away.
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Analytics is best-effort; never surface errors.
    });
  }, [pathname]);

  return null;
}
