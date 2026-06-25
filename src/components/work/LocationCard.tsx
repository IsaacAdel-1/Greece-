"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LocationCardData {
  /** Area / neighbourhood the project was delivered in. */
  location: string;
  images: { src: string; alt: string }[];
}

/**
 * A delivered-project card for one location. Its photos cross-fade on a 3-second
 * loop. Hovering (or focusing) the card freezes the current photo until the
 * pointer leaves.
 *
 * The pause is tracked in a ref so the interval runs continuously and is never
 * torn down/recreated on hover — otherwise rapid enter/leave events would keep
 * resetting the timer and the slideshow would appear to "hang".
 */
export function LocationCard({
  location,
  images,
  startDelayMs = 0,
}: LocationCardData & {
  /** Phase-shift the cycle so cards don't all flip at the same moment. */
  startDelayMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (images.length <= 1) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        if (pausedRef.current) return; // frozen while hovered/focused
        setIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }, startDelayMs);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [images.length, startDelayMs]);

  const freeze = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      className="group relative aspect-[4/3] overflow-hidden bg-sand"
      onMouseEnter={freeze}
      onMouseLeave={resume}
      onFocusCapture={freeze}
      onBlurCapture={resume}
    >
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          quality={90}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className={cn(
            "object-cover transition-opacity duration-1000 ease-luxe",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      {/* Readability scrim + location label. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="font-sans text-[11px] uppercase tracking-luxe text-bone/80">
          Delivered in
        </p>
        <h3 className="mt-1 font-serif text-2xl font-light text-bone">
          {location}
        </h3>
      </div>

      {/* Slide indicators. */}
      {images.length > 1 && (
        <div className="absolute right-4 top-4 flex gap-1.5">
          {images.map((img, i) => (
            <span
              key={img.src}
              aria-hidden="true"
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === index ? "bg-bone" : "bg-bone/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
