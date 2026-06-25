import Image from "next/image";
import Link from "next/link";
import type { CategoryWithCount } from "@/lib/catalog";

interface CategoryCardProps {
  category: CategoryWithCount;
  priority?: boolean;
}

/**
 * A category tile: full-bleed cover image with an overlaid title and piece
 * count. Links to the category page.
 */
export function CategoryCard({ category, priority = false }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
    >
      <div className="relative aspect-[4/3] bg-bone">
        <Image
          src={category.cover.src}
          alt={category.cover.alt}
          fill
          quality={90}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          priority={priority}
          className="object-contain transition-transform duration-700 ease-luxe group-hover:scale-105"
        />
        {/* Gradient scrim keeps the overlaid text readable over the image. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="font-sans text-[11px] uppercase tracking-luxe text-bone/80">
          {category.tagline}
        </p>
        <h3 className="mt-1 font-serif text-2xl font-light text-bone">
          {category.name}
        </h3>
        <p className="mt-1 font-sans text-xs text-bone/70">
          {category.productCount}{" "}
          {category.productCount === 1 ? "piece" : "pieces"}
        </p>
      </div>
    </Link>
  );
}
