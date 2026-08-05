"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface CarouselPhoto {
  url: string;
  alt: string;
}


export function CardCarousel({ photos, title }: { photos: CarouselPhoto[]; title: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-muted">
        <Icon name="image" size={28} className="text-ink-muted" />
        <span className="sr-only">No photos yet for {title}</span>
      </div>
    );
  }

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(index, photos.length - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActiveIndex(Math.round(track.scrollLeft / track.clientWidth));
  }

  return (
    <div className="group/carousel relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, index) => (
          <CarouselImage
            key={photo.url}
            photo={photo}
            alt={index === 0 ? photo.alt : ""}
          />
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="absolute top-1/2 left-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100 disabled:pointer-events-none disabled:opacity-0"
          >
            <Icon name="chevronLeft" size={14} />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === photos.length - 1}
            className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100 disabled:pointer-events-none disabled:opacity-0"
          >
            <Icon name="chevronRight" size={14} />
          </button>

          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
            {photos.map((photo, index) => (
              <span
                key={photo.url}
                className={cn(
                  "size-1.5 rounded-full bg-white/70 transition-all",
                  index === activeIndex && "w-3 bg-white",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CarouselImage({ photo, alt }: { photo: CarouselPhoto; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full shrink-0 snap-center items-center justify-center bg-muted">
        <Icon name="image" size={28} className="text-ink-muted" />
        <span className="sr-only">Photo unavailable for {photo.alt}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Cloudinary CDN URLs, not next/image-optimizable local assets
    <img
      src={photo.url}
      alt={alt}
      className="h-full w-full shrink-0 snap-center object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
