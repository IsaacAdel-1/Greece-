import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog/types";
import { getCoverImage } from "@/lib/catalog/format";

interface ProductCardProps {
  product: Product;
  /** Hint next/image about layout to pick good responsive sizes. */
  priority?: boolean;
}

/**
 * A single catalog piece, presented image-first. The whole card is a link to
 * the product detail page. Imagery uses next/image for optimization + lazy
 * loading; alt text comes from the data so it is always meaningful.
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const cover = getCoverImage(product);

  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-bone">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            quality={90}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            priority={priority}
            className="object-contain transition-transform duration-700 ease-luxe group-hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute left-4 top-4 bg-bone/90 px-3 py-1 font-sans text-[10px] uppercase tracking-luxe text-ink">
              New
            </span>
          )}
        </div>

        <div className="mt-5">
          {product.collection && (
            <p className="font-sans text-[11px] uppercase tracking-luxe text-brass">
              {product.collection}
            </p>
          )}
          <h3 className="mt-1 font-serif text-xl font-light text-ink transition-colors group-hover:text-brass">
            {product.name}
          </h3>
          <p className="mt-1 font-sans text-base leading-relaxed text-clay">
            {product.summary}
          </p>
        </div>
      </Link>
    </article>
  );
}
