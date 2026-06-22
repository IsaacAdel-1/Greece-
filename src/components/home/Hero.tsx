import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

/**
 * Full-viewport hero. Imagery is the hero — a single large, optimized photo
 * with `priority` so it is the LCP element, overlaid with a restrained
 * tagline and a single call to action to browse the collections.
 */
export function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[600px] w-full">
      {/* Lifestyle hero — the experience, not the product. A father and daughter
          sharing a warm, candid moment at home; the airy left side is kept clear
          for the copy overlay. */}
      <Image
        src="/images/hero/family-hero.jpg"
        alt="A father and his young daughter sharing a tender, playful moment together at home"
        fill
        priority
        sizes="100vw"
        className="object-cover object-right md:object-center"
      />
      {/* Darken the left third where the copy sits so the headline and both
          buttons stay legible regardless of how light the photo is. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/35 to-ink/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
      {/* Top scrim across the full width so the transparent header's white
          wordmark and nav links stay readable even over the bright right side
          of the photo. */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/55 to-transparent" />

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-content px-6 md:px-10">
          <div className="max-w-xl animate-fade-up">
            <p className="font-sans text-xs uppercase tracking-luxe text-bone/80">
              Made for the moments that matter
            </p>
            <h1 className="mt-5 font-serif text-4xl font-light leading-tight text-bone md:text-6xl">
              {siteConfig.tagline}
            </h1>
            <p className="mt-6 max-w-md font-sans text-lg leading-relaxed text-bone/90">
              {siteConfig.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/categories" variant="primary">
                Explore Collections
              </Button>
              <Button
                href="/about"
                variant="outline-light"
                className="bg-ink/20 backdrop-blur-sm"
              >
                Our Craft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
