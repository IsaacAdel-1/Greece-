import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/config/site";

/**
 * Combined founder + contact section: a short word from the founder alongside an
 * invitation to start a conversation, with direct WhatsApp and email actions.
 */
export function ContactTeaser() {
  const { contact } = siteConfig;
  // Gmail/any mail client compose to the business address.
  const emailHref = `mailto:${contact.email}`;

  return (
    <section id="contact" className="scroll-mt-24 bg-ink py-24 text-bone">
      <Container>
        <Reveal className="mx-auto grid max-w-4xl items-center gap-10 sm:grid-cols-[auto_1fr] sm:gap-12">
          {/* Founder */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-bone/10">
              <Image
                src="/images/about/founder.jpg"
                alt="Portrait of the founder of Grees&"
                fill
                sizes="128px"
                className="object-cover object-top"
              />
            </div>
            <p className="mt-4 font-sans text-xs uppercase tracking-luxe text-brass">
              Founder
            </p>
            <p className="mt-1 font-serif text-lg font-light">
              Engineer. Creator. Problem Solver.
            </p>
          </div>

          {/* Begin a conversation */}
          <div className="text-center sm:text-left">
            <p className="font-sans text-xs uppercase tracking-luxe text-brass">
              Begin a Conversation
            </p>
            <h2 className="mt-3 font-serif text-4xl font-light leading-tight md:text-5xl">
              Found a piece that speaks to you?
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-bone/75">
              Our team would be glad to share more — materials, lead times, and
              bespoke options. Reach out and we’ll respond personally.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 sm:justify-start">
              <Button
                href={contact.whatsapp}
                variant="outline-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </Button>
              <Button href={emailHref} variant="outline-light">
                Email Us
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
