"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  isPreSale: boolean;
};

export default function ProductGallery({ images, alt, isPreSale }: ProductGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.round(track.scrollLeft / track.clientWidth);
    setIndex(Math.max(0, Math.min(images.length - 1, next)));
  };

  const scrollTo = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(images.length - 1, target));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  };

  const arrowButton =
    "absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-ivory/95 text-ink shadow-md border border-ink/10 transition hover:bg-ivory active:scale-95";

  return (
    <div className="flex flex-col gap-4">
      <div className="relative border border-ink/15 bg-ecru">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <div key={src} className="relative w-full shrink-0 snap-center aspect-[4/5] overflow-hidden">
              <Image
                src={src}
                alt={alt}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {isPreSale && (
          <span className="absolute top-4 left-4 bg-ink text-ivory font-body text-[9px] uppercase tracking-[0.2em] px-3 py-1.5">
            Pre-Sale · Arriving Spring 2027
          </span>
        )}

        {hasMultiple && index > 0 && (
          <button type="button" aria-label="Previous picture" onClick={() => scrollTo(index - 1)} className={`${arrowButton} left-3`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {hasMultiple && index < images.length - 1 && (
          <button type="button" aria-label="Next picture" onClick={() => scrollTo(index + 1)} className={`${arrowButton} right-3 animate-pulse`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {hasMultiple && (
          <span className="absolute bottom-4 right-4 bg-ivory/90 text-ink font-body text-[9px] uppercase tracking-[0.2em] px-3 py-1.5">
            {index + 1} / {images.length} · Scroll across
          </span>
        )}
      </div>

      {hasMultiple && (
        <div className="flex items-center gap-2" aria-hidden="true">
          {images.map((src, i) => (
            <span key={src} className={`h-px flex-1 ${i === index ? "bg-gold" : "bg-ink/20"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
