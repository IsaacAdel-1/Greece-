import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { FadeSlideshow } from "@/components/ui/FadeSlideshow";

/**
 * Services band: the two things we do beyond selling finished pieces —
 * Customize (bespoke, made-to-measure) and Relife (restoring/reupholstering
 * existing furniture). Each card cross-fades between its two photos every 3s.
 */

const customizeImages = [
  { src: "/images/services/customize-1.jpg", alt: "Designers working through a client's floor plan together" },
  { src: "/images/services/customize-2.jpg", alt: "Hands comparing wood and fabric samples against a layout sketch" },
];

const relifeImages = [
  { src: "/images/services/relife-1.jpg", alt: "Before and after of a tired wooden dresser restored and refinished" },
  { src: "/images/services/relife-2.jpg", alt: "Before and after of a worn armchair reupholstered like new" },
];

export function Services() {
  return (
    <div className="bg-sand/30">
      <Container as="section" className="py-24">
        <Reveal>
          {/* "Services" is the large heading; the line under it is intentionally
              smaller (per the requested hierarchy). */}
          <SectionHeading
            title="Services"
            description="Beyond the showroom — two ways we work directly with you, whether you’re dreaming up something new or breathing life back into a piece you already love."
          />
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          <ServiceCard
            title="Customize"
            description="Made to your measurements, materials and finish. Tell us how you live and we’ll design a piece that fits your space — and your life — exactly."
            images={customizeImages}
          />
          <ServiceCard
            title="Relife"
            description="Give cherished furniture a second life. We restore, reupholster and refinish well-loved pieces with the same care we put into new ones — see the difference, before and after."
            images={relifeImages}
            delay={100}
            startDelayMs={800}
          />
        </div>

        <div className="mt-12 text-center">
          <Button href="#contact" variant="outline">
            Talk to Us About Your Project
          </Button>
        </div>
      </Container>
    </div>
  );
}

function ServiceCard({
  title,
  description,
  images,
  delay = 0,
  startDelayMs = 0,
}: {
  title: string;
  description: string;
  images: { src: string; alt: string }[];
  delay?: number;
  startDelayMs?: number;
}) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className="flex h-full flex-col overflow-hidden border border-sand bg-bone transition-colors hover:border-brass"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <FadeSlideshow
          images={images}
          sizes="(min-width: 768px) 40vw, 90vw"
          startDelayMs={startDelayMs}
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-2xl font-light text-ink">{title}</h3>
        <p className="mt-3 font-sans text-sm leading-relaxed text-clay">
          {description}
        </p>
      </div>
    </Reveal>
  );
}
