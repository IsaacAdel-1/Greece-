import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/** Dark, quiet call-to-contact band near the foot of the home page. */
export function ContactTeaser() {
  return (
    <section id="contact" className="scroll-mt-24 bg-ink py-24 text-bone">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs uppercase tracking-luxe text-brass">
            Begin a Conversation
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light leading-tight md:text-4xl">
            Found a piece that speaks to you?
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-bone/75">
            Our team would be glad to share more — materials, lead times, and
            bespoke options. Reach out and we will respond personally.
          </p>
          <div className="mt-10">
            <Button href="/contact" variant="outline-light">
              Make an Inquiry
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
