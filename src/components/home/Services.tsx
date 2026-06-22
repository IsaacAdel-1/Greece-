import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Services band: the two things we do beyond selling finished pieces —
 * Customize (bespoke, made-to-measure) and Relife (restoring/reupholstering
 * existing furniture). Each card leads with a real image from the collection so
 * the service reads instantly.
 */

const services = [
  {
    title: "Customize",
    description:
      "Made to your measurements, materials and finish. Tell us how you live and we’ll design a piece that fits your space — and your life — exactly.",
    image: {
      src: "/images/living-room/halston-sectional-1.webp",
      alt: "A custom cream sectional designed and styled for a client's living room",
    },
  },
  {
    title: "Relife",
    description:
      "Give cherished furniture a second life. We restore, reupholster and refinish well-loved pieces with the same care we put into new ones.",
    image: {
      src: "/images/living-room/cascade-sofa-1.webp",
      alt: "A soft taupe slipcovered sofa restored to like-new condition",
    },
  },
];

export function Services() {
  return (
    <div className="bg-sand/30">
      <Container as="section" className="py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="Beyond the showroom"
            description="Two ways we work directly with you — whether you’re dreaming up something new or breathing life back into a piece you already love."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.title} as="div" delay={i * 100}>
              <article className="group flex h-full flex-col overflow-hidden border border-sand bg-bone transition-colors hover:border-brass">
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <h3 className="font-serif text-2xl font-light text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-3 font-sans text-base leading-relaxed text-clay">
                    {service.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/contact" variant="outline">
            Talk to Us About Your Project
          </Button>
        </div>
      </Container>
    </div>
  );
}
