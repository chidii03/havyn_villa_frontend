"use client";

import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { EmptyState } from "@/components/patterns/empty-state";
import { formatPrice } from "@/lib/format/currency";
import { cn } from "@/lib/utils";

export interface MapPin {
  id: string;
  title: string;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  currency: string;
  basePrice: number;
}

export function MapView({
  pins,
  hoveredId,
  onHoverChange,
}: {
  pins: MapPin[];
  hoveredId?: string | null;
  onHoverChange?: (id: string | null) => void;
}) {
  // Read at render time, not module scope — keeps this swappable in tests via
  // vi.stubEnv without needing vi.resetModules()/a dynamic re-import.
  const GOOGLE_MAPS_BROWSER_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
  const GOOGLE_MAPS_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

  const located = pins.filter((pin): pin is MapPin & { lat: number; lng: number } => pin.lat != null && pin.lng != null);

  if (!GOOGLE_MAPS_BROWSER_KEY) {
    return <MapListFallback pins={pins} reason="Map view isn't configured for this environment yet" />;
  }

  if (located.length === 0) {
    return (
      <EmptyState
        icon="mapView"
        title="No locations to show"
        description="None of the current results have a map location yet."
      />
    );
  }

  const center = {
    lat: located.reduce((sum, pin) => sum + pin.lat, 0) / located.length,
    lng: located.reduce((sum, pin) => sum + pin.lng, 0) / located.length,
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_BROWSER_KEY}>
      <Map
        defaultCenter={center}
        defaultZoom={11}
        mapId={GOOGLE_MAPS_MAP_ID}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="h-full w-full rounded-xl"
      >
        {located.map((pin) => (
          <AdvancedMarker
            key={pin.id}
            position={{ lat: pin.lat, lng: pin.lng }}
            onMouseEnter={() => onHoverChange?.(pin.id)}
            onMouseLeave={() => onHoverChange?.(null)}
          >
            <PriceMarker price={formatPrice(pin.basePrice, pin.currency)} active={hoveredId === pin.id} />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}

function PriceMarker({ price, active }: { price: string; active: boolean }) {
  return (
    <div
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap shadow-md transition-colors",
        active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink",
      )}
    >
      {price}
    </div>
  );
}

/** The a11y fallback required by prompt 20 — also what actually renders whenever no Maps key is configured. */
function MapListFallback({ pins, reason }: { pins: MapPin[]; reason: string }) {
  return (
    <div className="h-full overflow-y-auto rounded-xl border border-line p-4">
      <p className="mb-3 text-sm text-ink-muted">{reason} — here are the same results as a list.</p>
      <ul aria-label="Property locations" className="divide-y divide-line">
        {pins.map((pin) => (
          <li key={pin.id} className="py-2.5 text-sm">
            <p className="font-medium text-ink">{pin.title}</p>
            <p className="text-ink-muted">
              {pin.city}, {pin.state} · {formatPrice(pin.basePrice, pin.currency)}/night
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
