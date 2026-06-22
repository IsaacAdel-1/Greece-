import Image from "next/image";
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
      {/* Founder signature */}
      <div className="border-b border-sand">
        <Container className="flex flex-col items-center gap-6 py-12 text-center sm:flex-row sm:gap-8 sm:text-left">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-sand sm:h-32 sm:w-32">
            <Image
              src="/images/about/founder.jpg"
              alt="Portrait of the founder of Grees&"
              fill
              sizes="128px"
              // Frame from the top so the whole face stays in the circle rather
              // than being cropped through the middle.
              className="object-cover object-top"
            />
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-luxe text-brass">
              Founder
            </p>
            <p className="mt-1 font-serif text-xl font-light text-ink">
              Engineer. Creator. Problem Solver.
            </p>
            <p className="mt-1 font-sans text-sm leading-relaxed text-clay">
              Building spaces, furniture, and ideas that make everyday life
              better.
            </p>
          </div>
        </Container>
      </div>

      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-3">
        <div>
          <Logo />
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
