import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatDimensions,
  getCategoryBySlug,
  getCoverImage,
  getProductBySlug,
  getProducts,
  getProductsByCategory,
} from "@/lib/catalog";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return buildMetadata({
    title: product.name,
    description: product.summary,
    path: `/products/${product.slug}`,
    image: getCoverImage(product).src,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = await getCategoryBySlug(product.categorySlug);
  const related = (await getProductsByCategory(product.categorySlug))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  // Pre-fill the contact form with this piece via a query param.
  const inquireHref = `/contact?piece=${encodeURIComponent(product.slug)}`;

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- trusted, server-generated JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />

      <Container className="pt-32 md:pt-40">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 font-sans text-xs uppercase tracking-luxe text-clay">
            <li>
              <Link href="/categories" className="hover:text-brass">
                Collections
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            {category && (
              <>
                <li>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="hover:text-brass"
                  >
                    {category.name}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
              </>
            )}
            <li className="text-ink" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="lg:pt-4">
            {product.collection && (
              <p className="font-sans text-xs uppercase tracking-luxe text-brass">
                {product.collection}
              </p>
            )}
            <h1 className="mt-2 font-serif text-4xl font-light leading-tight text-ink md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-6 font-sans text-lg leading-relaxed text-clay">
              {product.description}
            </p>

            {/* Materials */}
            <section className="mt-10 border-t border-sand pt-8">
              <h2 className="font-sans text-xs uppercase tracking-luxe text-ink">
                Materials
              </h2>
              <ul className="mt-4 space-y-2">
                {product.materials.map((m) => (
                  <li key={m.name} className="font-sans text-base text-clay">
                    <span className="text-ink">{m.name}</span>
                    {m.description && <span> — {m.description}</span>}
                  </li>
                ))}
              </ul>
            </section>

            {/* Dimensions */}
            <section className="mt-8 border-t border-sand pt-8">
              <h2 className="font-sans text-xs uppercase tracking-luxe text-ink">
                Dimensions
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-y-3 font-sans text-base sm:grid-cols-3">
                <Spec label="Width" value={`${product.dimensions.width} cm`} />
                <Spec label="Depth" value={`${product.dimensions.depth} cm`} />
                <Spec label="Height" value={`${product.dimensions.height} cm`} />
                {product.dimensions.seatHeight && (
                  <Spec
                    label="Seat height"
                    value={`${product.dimensions.seatHeight} cm`}
                  />
                )}
              </dl>
              <p className="mt-4 font-sans text-xs text-clay">
                Overall: {formatDimensions(product.dimensions)}
              </p>
            </section>

            {/* Inquire — NOT buy */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={inquireHref} variant="primary">
                Inquire About This Piece
              </Button>
              <Button
                href={siteConfig.contact.whatsapp}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask on WhatsApp
              </Button>
            </div>
            <p className="mt-4 font-sans text-xs text-clay">
              Made to order. Lead times and bespoke options shared on request.
            </p>
          </div>
        </div>
      </Container>

      {/* Related */}
      {related.length > 0 && (
        <Container className="py-24">
          <h2 className="mb-12 font-serif text-2xl font-light text-ink md:text-3xl">
            More from {category?.name ?? "this collection"}
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} as="div" delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      )}
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-clay">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
