"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { CatalogImage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/**
 * Product image gallery: one large active image with a row of selectable
 * thumbnails beneath it. Clicking the main image opens a full-screen zoom
 * (lightbox); inside it, click toggles a 2× magnify that pans with the cursor.
 *
 * Images use object-contain so the whole piece is always visible (renders are
 * shot on a white ground and must never be cropped).
 */
export function ProductGallery({
  images,
  productName,
}: {
  images: CatalogImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const active = images[activeIndex] ?? images[0];

  // Escape closes the lightbox; lock body scroll while it's open.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  // Reset the magnify whenever the lightbox closes or the image changes.
  useEffect(() => {
    setZoomed(false);
  }, [lightbox, activeIndex]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomed) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  return (
    <div>
      {/* Main image — click to open the zoom view. */}
      <button
        type="button"
        onClick={() => setLightbox(true)}
        aria-label={`Zoom in on ${productName}`}
        className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
      >
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          priority
          quality={90}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />
        <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-ink/70 px-2.5 py-1 font-sans text-[10px] uppercase tracking-luxe text-bone opacity-0 transition-opacity group-hover:opacity-100">
          ⤢ Zoom
        </span>
      </button>

      {images.length > 1 && (
        <ul
          className="mt-4 grid grid-cols-4 gap-3"
          aria-label={`${productName} image thumbnails`}
        >
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-current={i === activeIndex ? "true" : undefined}
                aria-label={`View image ${i + 1}: ${image.alt}`}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden bg-bone transition-opacity duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass",
                  i === activeIndex
                    ? "ring-1 ring-ink ring-offset-2 ring-offset-bone"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Zoom lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 sm:p-8"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} — zoomed image`}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close zoom"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center text-2xl text-bone/80 hover:text-bone"
          >
            ✕
          </button>
          <div
            className={cn(
              "relative h-full w-full max-w-5xl overflow-hidden",
              zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
            )}
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
            onMouseMove={handleMove}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              quality={95}
              sizes="100vw"
              className={cn(
                "object-contain transition-transform duration-300 ease-luxe",
                zoomed && "scale-[2.2]",
              )}
              style={
                zoomed
                  ? { transformOrigin: `${origin.x}% ${origin.y}%` }
                  : undefined
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
