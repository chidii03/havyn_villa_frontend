"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import type { PropertyTypeSummary } from "@havyn/shared";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon-registry";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, IconName> = {
  APARTMENT: "building",
  VILLA: "house",
  HOUSE: "house",
  STUDIO: "building",
  CONDO: "building",
  CABIN: "house",
  GUESTHOUSE: "house",
};

export function CategoryChips({ types, basePath }: { types: PropertyTypeSummary[]; basePath: string }) {
  const searchParams = useSearchParams();
  const trackRef = useRef<HTMLDivElement>(null);
  const activeCode = searchParams.get("type");

  function hrefFor(code: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (code) {
      params.set("type", code);
    } else {
      params.delete("type");
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function scroll(direction: -1 | 1) {
    trackRef.current?.scrollBy({ left: direction * 240, behavior: "smooth" });
  }

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        aria-label="Scroll categories left"
        onClick={() => scroll(-1)}
        className="absolute left-0 z-10 hidden size-8 items-center justify-center rounded-full border border-line bg-surface shadow-sm sm:flex"
      >
        <Icon name="chevronLeft" size={14} />
      </button>

      <div
        ref={trackRef}
        role="tablist"
        aria-label="Property categories"
        className="flex w-full gap-2 overflow-x-auto scroll-smooth px-1 py-1 sm:px-10 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        <Link
          href={hrefFor(null)}
          role="tab"
          aria-selected={!activeCode}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            !activeCode ? "border-brand bg-brand/10 text-brand" : "border-line text-ink-muted hover:text-ink",
          )}
        >
          <Icon name="compass" size={15} />
          All stays
        </Link>
        {types.map((type) => {
          const isActive = activeCode === type.code;
          return (
            <Link
              key={type.code}
              href={hrefFor(type.code)}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive ? "border-brand bg-brand/10 text-brand" : "border-line text-ink-muted hover:text-ink",
              )}
            >
              <Icon name={TYPE_ICONS[type.code] ?? "house"} size={15} />
              {type.name}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Scroll categories right"
        onClick={() => scroll(1)}
        className="absolute right-0 z-10 hidden size-8 items-center justify-center rounded-full border border-line bg-surface shadow-sm sm:flex"
      >
        <Icon name="chevronRight" size={14} />
      </button>
    </div>
  );
}
