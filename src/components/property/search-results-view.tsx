"use client";

import { useState } from "react";
import type { SearchResultItem } from "@havyn/shared";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { MapView } from "./map-view-lazy";
import { ResultsGrid } from "./results-grid";

/** list/map toggle + hover-sync client island — the data itself is fetched server-side by /search/page.tsx. */
export function SearchResultsView({ properties }: { properties: SearchResultItem[] }) {
  const [view, setView] = useState<"list" | "map">("list");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex justify-end lg:hidden">
        <div className="inline-flex rounded-full border border-line p-1" role="group" aria-label="Results view">
          <ToggleButton active={view === "list"} icon="listView" label="List" onClick={() => setView("list")} />
          <ToggleButton active={view === "map"} icon="mapView" label="Map" onClick={() => setView("map")} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className={cn(view === "map" && "hidden lg:block")}>
          <ResultsGrid properties={properties} hoveredId={hoveredId} onHoverChange={setHoveredId} />
        </div>
        <div className={cn("lg:sticky lg:top-20 lg:h-[calc(100vh-7rem)]", view === "list" ? "hidden lg:block" : "h-[60vh]")}>
          <MapView pins={properties} hoveredId={hoveredId} onHoverChange={setHoveredId} />
        </div>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: "listView" | "mapView";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors",
        active ? "bg-brand text-white" : "text-ink-muted",
      )}
    >
      <Icon name={icon} size={14} />
      {label}
    </button>
  );
}
