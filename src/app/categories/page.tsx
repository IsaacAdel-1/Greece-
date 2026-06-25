import type { Metadata } from "next";
import { getCategoriesWithCounts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/catalog/PageHeader";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Collections",
  description:
    "Browse our luxury furniture collections by room — living, bedroom, dining, office and outdoor.",
  path: "/categories",
});

export const revalidate = 300;

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <>
      <PageHeader
        eyebrow="Collections"
        title="Furniture, by room"
        description="Five collections, each composed for a particular way of living. Choose a room to explore the pieces within."
      />
      <Container className="pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <Reveal key={category.slug} as="div" delay={(i % 3) * 80}>
              <CategoryCard category={category} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
