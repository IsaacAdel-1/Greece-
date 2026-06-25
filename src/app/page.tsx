import {
  getCategoriesWithCounts,
  getFeaturedProducts,
} from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { ContactTeaser } from "@/components/home/ContactTeaser";
import { DeliveredWork } from "@/components/work/DeliveredWork";

// Safety net: regenerate at most every 5 minutes even if a path-level
// revalidation is ever missed. On-demand revalidatePath keeps it instant.
export const revalidate = 300;

export default async function HomePage() {
  // Fetch in parallel — both go through the catalog seam.
  const [categories, featured] = await Promise.all([
    getCategoriesWithCounts(),
    getFeaturedProducts(3),
  ]);

  return (
    <>
      <Hero />

      {/* What we do beyond finished pieces — second section, right after the hero */}
      <Services />

      {/* Categories */}
      <Container as="section" id="collections" className="scroll-mt-24 py-24">
        <Reveal>
          <SectionHeading eyebrow="Collections" title="Explore by room" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <Reveal key={category.slug} as="div" delay={i * 80}>
              <CategoryCard category={category} priority={i < 3} />
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button href="/categories" variant="outline">
            View All Collections
          </Button>
        </div>
      </Container>

      {/* Featured pieces */}
      <div className="bg-sand/30">
        <Container as="section" className="py-24">
          <Reveal>
            <SectionHeading eyebrow="Featured" title="Pieces of the season" />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, i) => (
              <Reveal key={product.slug} as="div" delay={i * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </Container>
      </div>

      {/* Real delivered projects, by location */}
      <DeliveredWork id="work" />

      <AboutTeaser />
      <ContactTeaser />
    </>
  );
}
