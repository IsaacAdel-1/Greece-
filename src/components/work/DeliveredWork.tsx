import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import { LocationCard, type LocationCardData } from "./LocationCard";

/**
 * Real delivered projects, grouped by location. Each location card cross-fades
 * through its photos every 3 seconds. Photos live under /public/images/delivered
 * — reassign them per real delivery location (and add more locations) as needed.
 */
const deliveredLocations: LocationCardData[] = [
  {
    location: "Sheikh Zayed",
    images: [
      { src: "/images/delivered/marble-dining-set.jpg", alt: "A round marble-top dining table with cream upholstered chairs in a client's home in Sheikh Zayed" },
      { src: "/images/delivered/living-marble-tables.jpg", alt: "A cream modular sofa with marble coffee tables in an open-plan living space in Sheikh Zayed" },
      { src: "/images/delivered/marble-round-velvet-dining.jpg", alt: "A round marble dining table with grey velvet chairs delivered in Sheikh Zayed" },
    ],
  },
  {
    location: "New Cairo",
    images: [
      { src: "/images/delivered/grey-modular-sectional.jpg", alt: "A large grey modular sectional sofa delivered in New Cairo" },
      { src: "/images/delivered/walnut-dining-bench.jpg", alt: "A live-edge walnut dining table with a matching bench delivered in New Cairo" },
      { src: "/images/delivered/walnut-vanity-bedroom.jpg", alt: "A floating walnut dressing table with an arched mirror delivered in New Cairo" },
    ],
  },
];

interface DeliveredWorkProps {
  /** Anchor id, so the navbar can link straight to this section. */
  id?: string;
  /** Extra classes on the section wrapper (e.g. a background). */
  className?: string;
}

/** Gallery of completed client projects, grouped by location. */
export function DeliveredWork({ id, className }: DeliveredWorkProps) {
  return (
    // scroll-mt clears the fixed header when navigated to via the anchor.
    <section id={id} className={cn("scroll-mt-24", className)}>
      <Container className="py-24">
        <Reveal>
          <SectionHeading title="Pieces already in clients' homes" />
        </Reveal>
        {/* Centered, capped width so the (currently two) cards stay balanced
            instead of clinging to the left of a 3-up grid. */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-14">
          {deliveredLocations.map((loc, i) => (
            <Reveal key={loc.location} as="div" delay={(i % 3) * 80}>
              {/* Stagger each card's image timing by 500ms so they never flip
                  in sync. */}
              <LocationCard
                location={loc.location}
                images={loc.images}
                startDelayMs={i * 500}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
