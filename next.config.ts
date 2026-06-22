import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Kept deliberately strict for a public catalog site. `'unsafe-inline'` is
 * required for styles because Tailwind injects inline styles and Next injects
 * inline style tags; scripts use a nonce-free policy with `'unsafe-inline'`
 * only as a fallback for Next's inline bootstrap in dev. Tighten per provider
 * (maps, analytics) as you add them via env-driven origins.
 */
const isDev = process.env.NODE_ENV !== "production";

const cspDirectives = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  // Next.js requires inline/eval for its runtime in development.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  // Allow Google Maps embed iframe + WhatsApp links.
  `frame-src 'self' https://www.google.com https://maps.google.com`,
  `connect-src 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

// Derive the Supabase Storage hostname from the env URL so next/image is
// allowed to optimize uploaded product photos. Absent in local dev → skipped.
let supabaseHost: string | undefined;
try {
  if (process.env.SUPABASE_URL) {
    supabaseHost = new URL(process.env.SUPABASE_URL).hostname;
  }
} catch {
  supabaseHost = undefined;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Allow remote imagery hosts here when you move off /public.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost }]
        : []),
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
