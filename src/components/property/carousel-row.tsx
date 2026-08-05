"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { PropertyCard, type PropertyCardData } from "./property-card";

export function CarouselRow({ title, properties }: { title: string; properties: PropertyCardData[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (properties.length === 0) {
    return null;
  }

  function scroll(direction: -1 | 1) {
    trackRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  return (
    <section aria-label={title}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scroll(-1)}
            className="flex size-8 items-center justify-center rounded-full border border-line text-ink-muted hover:text-ink"
          >
            <Icon name="chevronLeft" size={14} />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scroll(1)}
            className="flex size-8 items-center justify-center rounded-full border border-line text-ink-muted hover:text-ink"
          >
            <Icon name="chevronRight" size={14} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {properties.map((property) => (
          <div key={property.id} className="w-56 shrink-0 sm:w-64">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </section>
  );
}
