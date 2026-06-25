import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";

/** Site footer: brand line, navigation, contact, and legal row. */
export function Footer() {
  const { contact, social, nav, name, tagline } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-sand bg-bone">
      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-3">
        <div>
          <Logo tagline={false} />
          <p className="mt-4 max-w-xs font-sans text-base leading-relaxed text-clay">
            {tagline}.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-4 font-sans text-xs uppercase tracking-luxe text-brass">
            Explore
          </h2>
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-sans text-base text-ink transition-colors hover:text-brass"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-sans text-xs uppercase tracking-luxe text-brass">
            Visit & Contact
          </h2>
          <address className="space-y-2 font-sans text-base not-italic leading-relaxed text-clay">
            <p>
              {contact.address.line1}, {contact.address.line2}
              <br />
              {contact.address.city}, {contact.address.country}
            </p>
            <p>
              <a
                href={`mailto:${contact.email}`}
                className="text-ink transition-colors hover:text-brass"
              >
                {contact.email}
              </a>
            </p>
            <p>
              <a
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                className="text-ink transition-colors hover:text-brass"
              >
                {contact.phone}
              </a>
            </p>
          </address>
          <div className="mt-4 flex gap-5">
            <a
              href={social.instagram}
              className="font-sans text-xs uppercase tracking-luxe text-ink hover:text-brass"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href={social.pinterest}
              className="font-sans text-xs uppercase tracking-luxe text-ink hover:text-brass"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pinterest
            </a>
          </div>
        </div>
      </Container>

      <div className="border-t border-sand">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-clay md:flex-row">
          <p className="font-sans text-xs">
            © {year} {name}. All rights reserved.
          </p>
          <p className="font-sans text-xs">Crafted in {contact.address.city}.</p>
        </Container>
      </div>
    </footer>
  );
}
