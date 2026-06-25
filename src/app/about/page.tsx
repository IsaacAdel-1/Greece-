import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Grees& builds furniture around transparency and flexibility — helping clients visualize, choose, and receive pieces designed for real people and real spaces.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      {/* Story — top padding clears the fixed header now the page header is gone. */}
      <Container className="pb-16 pt-36 md:pb-24 md:pt-44">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <Reveal delay={120}>
            <div className="max-w-3xl space-y-5 font-sans text-lg leading-relaxed text-clay">
              <p>
                Grees& started after seeing the same frustrations repeated again
                and again in the furniture market.
              </p>
              <p>
                Clients were struggling with delayed deliveries, uncertainty
                about quality, limited customization options, and the fear of
                paying for something that might not match their expectations.
              </p>
              <p>We believed there had to be a better way.</p>
              <p>
                That&apos;s why we built Grees& around transparency and
                flexibility. Before production begins, we help clients visualize
                their ideas, explore different design options, and make informed
                decisions with confidence.
              </p>
              <p>From consultation to delivery, our focus is simple:</p>
              <ul className="space-y-1 border-l border-brass pl-6 font-serif text-2xl font-light text-ink">
                <li>Less uncertainty.</li>
                <li>More clarity.</li>
                <li>Better quality.</li>
                <li>Furniture designed around real people and real spaces.</li>
              </ul>
              <p>
                Because great furniture is not just about how it looks. It is
                about how it fits your life.
              </p>
            </div>
          </Reveal>

          {/* Small accent image — desktop only, sticks while the story scrolls. */}
          <Reveal delay={200} className="hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden bg-sand lg:sticky lg:top-28">
              <Image
                src="/images/beds/haven-1.webp"
                alt="A low taupe upholstered bed with a soft wrapped headboard"
                fill
                sizes="20rem"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Container>

      {/* CTA */}
      <Container className="py-24 text-center">
        <Reveal className="mx-auto max-w-xl">
          <h2 className="font-serif text-3xl font-light text-ink md:text-4xl">
            Have a space in mind?
          </h2>
          <p className="mt-5 font-sans text-lg leading-relaxed text-clay">
            Tell us about the room and how you want to use it. We will help you
            visualize the options before anything is made.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="primary">
              Start a Conversation
            </Button>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
