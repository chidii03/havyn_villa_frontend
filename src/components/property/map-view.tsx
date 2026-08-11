"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
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

const MAPBOX_STREETS = "mapbox://styles/mapbox/streets-v12";
const MAPBOX_SATELLITE = "mapbox://styles/mapbox/satellite-streets-v12";

export function MapView({
  pins,
  hoveredId,
  onHoverChange,
  onVisiblePinsChange,
}: {
  pins: MapPin[];
  hoveredId?: string | null;
  onHoverChange?: (id: string | null) => void;
  onVisiblePinsChange?: (ids: Set<string> | null) => void;
}) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const located = pins.filter((pin): pin is MapPin & { lat: number; lng: number } => pin.lat != null && pin.lng != null);

  if (!mapboxToken) {
    return <MapListFallback pins={pins} reason="Mapbox isn't configured for this environment yet" />;
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

  return (
    <MapboxPropertyMap
      accessToken={mapboxToken}
      pins={located}
      hoveredId={hoveredId}
      onHoverChange={onHoverChange}
      onVisiblePinsChange={onVisiblePinsChange}
    />
  );
}

function MapboxPropertyMap({
  accessToken,
  pins,
  hoveredId,
  onHoverChange,
  onVisiblePinsChange,
}: {
  accessToken: string;
  pins: Array<MapPin & { lat: number; lng: number }>;
  hoveredId?: string | null;
  onHoverChange?: (id: string | null) => void;
  onVisiblePinsChange?: (ids: Set<string> | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const markerElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const appliedStyleRef = useRef(MAPBOX_STREETS);
  const initialCenterRef = useRef<[number, number] | null>(null);
  const suppressNextMoveRef = useRef(false);
  const [style, setStyle] = useState(MAPBOX_STREETS);

  const center = useMemo<[number, number]>(() => {
    const lng = pins.reduce((sum, pin) => sum + pin.lng, 0) / pins.length;
    const lat = pins.reduce((sum, pin) => sum + pin.lat, 0) / pins.length;
    return [lng, lat];
  }, [pins]);
  if (!initialCenterRef.current) {
    initialCenterRef.current = center;
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = accessToken;
    const mapCenter = initialCenterRef.current ?? center;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style,
      center: mapCenter,
      zoom: 11,
      attributionControl: true,
    });
    let removed = false;

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      markerElementsRef.current.clear();
      if (mapRef.current === map) {
        mapRef.current = null;
      }
      if (!removed) {
        removed = true;
        map.remove();
      }
    };
  }, [accessToken]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || appliedStyleRef.current === style) return;
    appliedStyleRef.current = style;
    try {
      map.setStyle(style);
    } catch {
      // Mapbox can throw if a style switch races with unmount during fast navigation.
    }
  }, [style]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let cancelled = false;

    const syncMarkers = () => {
      if (cancelled || !mapRef.current) return;

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      markerElementsRef.current.clear();

      const bounds = new mapboxgl.LngLatBounds();
      pins.forEach((pin) => {
        const element = document.createElement("button");
        element.type = "button";
        element.className = markerClass(false);
        element.textContent = formatPrice(pin.basePrice, pin.currency);
        element.setAttribute("aria-label", `${pin.title}, ${formatPrice(pin.basePrice, pin.currency)} per night`);
        element.addEventListener("mouseenter", () => onHoverChange?.(pin.id));
        element.addEventListener("mouseleave", () => onHoverChange?.(null));

        const marker = new mapboxgl.Marker({ element, anchor: "bottom" })
          .setLngLat([pin.lng, pin.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 18 }).setHTML(
              `<strong>${escapeHtml(pin.title)}</strong><br/><span>${escapeHtml([pin.city, pin.state].filter(Boolean).join(", "))}</span>`,
            ),
          )
          .addTo(map);

        markersRef.current.set(pin.id, marker);
        markerElementsRef.current.set(pin.id, element);
        bounds.extend([pin.lng, pin.lat]);
      });

      if (pins.length === 1) {
        suppressNextMoveRef.current = true;
        map.flyTo({ center: [pins[0].lng, pins[0].lat], zoom: 12, essential: true });
      } else {
        suppressNextMoveRef.current = true;
        map.fitBounds(bounds, { padding: 64, maxZoom: 13, duration: 500 });
      }
    };

    if (map.loaded()) {
      syncMarkers();
    } else {
      map.once("load", syncMarkers);
      map.once("style.load", syncMarkers);
    }

    return () => {
      cancelled = true;
      map.off("load", syncMarkers);
      map.off("style.load", syncMarkers);
    };
  }, [onHoverChange, pins]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onVisiblePinsChange) return;
    const currentMap = map;
    const notifyVisiblePins = onVisiblePinsChange;

    function updateVisiblePins() {
      if (mapRef.current !== currentMap) return;
      if (suppressNextMoveRef.current) {
        suppressNextMoveRef.current = false;
        return;
      }

      let bounds: mapboxgl.LngLatBounds | null;
      try {
        bounds = currentMap.getBounds();
      } catch {
        return;
      }
      if (!bounds) return;
      const visibleIds = new Set(
        pins.filter((pin) => bounds.contains([pin.lng, pin.lat])).map((pin) => pin.id),
      );
      notifyVisiblePins(visibleIds);
    }

    currentMap.on("dragend", updateVisiblePins);
    currentMap.on("zoomend", updateVisiblePins);
    return () => {
      currentMap.off("dragend", updateVisiblePins);
      currentMap.off("zoomend", updateVisiblePins);
    };
  }, [onVisiblePinsChange, pins]);

  useEffect(() => {
    markerElementsRef.current.forEach((element, id) => {
      element.className = markerClass(hoveredId === id);
    });
  }, [hoveredId]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute left-3 top-3 z-10 flex overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <button
          type="button"
          className={cn("px-3 py-2 text-xs font-medium", style === MAPBOX_STREETS ? "bg-brand text-white" : "text-ink")}
          onClick={() => setStyle(MAPBOX_STREETS)}
        >
          Map
        </button>
        <button
          type="button"
          className={cn("px-3 py-2 text-xs font-medium", style === MAPBOX_SATELLITE ? "bg-brand text-white" : "text-ink")}
          onClick={() => setStyle(MAPBOX_SATELLITE)}
        >
          Satellite
        </button>
      </div>
    </div>
  );
}

function markerClass(active: boolean) {
  return cn(
    "rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap shadow-md transition-colors",
    active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink",
  );
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function MapListFallback({ pins, reason }: { pins: MapPin[]; reason: string }) {
  return (
    <div className="h-full overflow-y-auto rounded-xl border border-line p-4">
      <p className="mb-3 text-sm text-ink-muted">{reason} - here are the same results as a list.</p>
      <ul aria-label="Property locations" className="divide-y divide-line">
        {pins.map((pin) => (
          <li key={pin.id} className="py-2.5 text-sm">
            <p className="font-medium text-ink">{pin.title}</p>
            <p className="text-ink-muted">
              {pin.city}, {pin.state} - {formatPrice(pin.basePrice, pin.currency)}/night
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
