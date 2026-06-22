/**
 * Single source of truth for brand + business information.
 *
 * Anything that might change (contact details, nav, social) lives here rather
 * than being hardcoded across components. Public-facing contact details are
 * read from NEXT_PUBLIC_* env vars where present, with sensible fallbacks so
 * the site still renders during local development without a .env file.
 */

const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+20 100 000 0000";
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "201000000000";

export const siteConfig = {
  name: "Grees",
  /** Used in <title> templates and footers. */
  legalName: "Grees Furniture Solutions",
  tagline: "Furniture for a Life Well Lived",
  description:
    "Handcrafted furniture made for the moments that matter — gathering, resting, growing together. Timeless pieces for the living room, bedroom and dining room, built to be part of your family's story for years to come.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.minasalama.com",
  locale: "en",
  ogImage: "/images/living-room/halston-sectional-1.webp",

  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@minasalama.com",
    phone,
    /** WhatsApp deep link (digits only, no +). */
    whatsapp: `https://wa.me/${whatsappNumber}`,
    address: {
      line1: "14 Gezira Avenue",
      line2: "Zamalek",
      city: "Cairo",
      country: "Egypt",
    },
    /** Embed URL for the contact map (no API key required). */
    mapEmbedUrl:
      "https://www.google.com/maps?q=Zamalek,Cairo,Egypt&output=embed",
    hours: "By appointment · Sun–Thu, 10:00–18:00",
  },

  social: {
    instagram: "https://instagram.com/",
    pinterest: "https://pinterest.com/",
  },

  /**
   * Primary navigation shared by header and footer. Most items are sections on
   * the home page (anchor links); only About is its own route. The full
   * Collections and Contact pages remain reachable via in-section buttons.
   */
  nav: [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/#collections" },
    { label: "Projects", href: "/#work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
