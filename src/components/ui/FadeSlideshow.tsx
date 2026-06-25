"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Cross-fades a set of images on a fixed interval (default 3s). Fills its
 * positioned parent — wrap it in an aspect-ratio box. Used for the Services
 * cards (Customize, Relife) where two images alternate.
 */
export function FadeSlideshow({
  images,
  sizes,
  intervalMs = 3000,
  startDelayMs = 0,
  className,
}: {
  images: { src: string; alt: string }[];
  sizes: string;
  intervalMs?: number;
  /** Phase-shift the cycle so two adjacent slideshows don't flip together. */
  startDelayMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(
        () => setIndex((prev) => (prev + 1) % images.length),
        intervalMs,
      );
    }, startDelayMs);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [images.length, intervalMs, startDelayMs]);

  return (
    <div className={cn("absolute inset-0", className)}>
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          quality={90}
          sizes={sizes}
          className={cn(
            "object-cover transition-opacity duration-1000 ease-luxe",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}
