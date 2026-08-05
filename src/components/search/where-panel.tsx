"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * Static destination list — NOT Google Places Autocomplete. A real Google Maps
 * browser key hasn't been provisioned yet (NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY is
 * empty in .env.example); wiring live typeahead is a follow-up once one exists (see
 * frontend/01-frontend-foundation.md). Lagos-first per the product brief.
 */
const SUGGESTED_DESTINATIONS = [
  "Lekki, Lagos",
  "Victoria Island, Lagos",
  "Ikoyi, Lagos",
  "Ikeja, Lagos",
  "Abuja",
  "Port Harcourt",
  "Accra, Ghana",
  "Nairobi, Kenya",
];

export function WherePanel({
  value,
  onChange,
  onSelect,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect: (destination: string) => void;
}) {
  const query = value.trim().toLowerCase();
  const suggestions = query
    ? SUGGESTED_DESTINATIONS.filter((d) => d.toLowerCase().includes(query))
    : SUGGESTED_DESTINATIONS;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="search-destination" className="sr-only">
        Where
      </label>
      <input
        id="search-destination"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search destinations"
        autoComplete="off"
        className="h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand"
      />
      <ul className="flex max-h-72 flex-col overflow-y-auto" role="listbox" aria-label="Suggested destinations">
        <li>
          <button
            type="button"
            onClick={() => onSelect("Nearby")}
            className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <Icon name="compass" size={16} active />
            </span>
            <span>
              <span className="block font-medium text-ink">Nearby</span>
              <span className="block text-xs text-ink-muted">Find what&apos;s around you</span>
            </span>
          </button>
        </li>
        {suggestions.map((destination) => (
          <li key={destination}>
            <button
              type="button"
              role="option"
              aria-selected={value === destination}
              onClick={() => onSelect(destination)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-muted",
                value === destination && "bg-muted",
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon name="mapPin" size={16} active />
              </span>
              <span className="font-medium text-ink">{destination}</span>
            </button>
          </li>
        ))}
        {suggestions.length === 0 && <li className="px-2 py-4 text-center text-sm text-ink-muted">No matches</li>}
      </ul>
    </div>
  );
}
