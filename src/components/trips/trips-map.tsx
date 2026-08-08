"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BookingDetail } from "@havyn/shared";
import { EmptyState } from "@/components/patterns/empty-state";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LatLng = { lat: number; lng: number };
type LocatedBooking = BookingDetail & { property: BookingDetail["property"] & { lat: number; lng: number } };
type MappedBooking = { booking: BookingDetail; position: LatLng };

const MAPBOX_STREETS = "mapbox://styles/mapbox/streets-v12";
const MAPBOX_SATELLITE = "mapbox://styles/mapbox/satellite-streets-v12";

export function TripsMap({ bookings }: { bookings: BookingDetail[] }) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-line bg-white p-6">
        <EmptyState icon="mapView" title="Mapbox token needed" description="Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to show booked stays on a map." />
      </div>
    );
  }

  return <TripsMapCanvas bookings={bookings} accessToken={mapboxToken} />;
}

function TripsMapCanvas({ bookings, accessToken }: { bookings: BookingDetail[]; accessToken: string }) {
  const [geocodedLocations, setGeocodedLocations] = useState<Record<string, LatLng | null>>({});

  const storedLocations = useMemo(
    () =>
      bookings.filter(
        (booking): booking is LocatedBooking =>
          booking.property.lat != null && booking.property.lng != null,
      ),
    [bookings],
  );

  const bookingsNeedingGeocode = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.property.lat == null &&
          booking.property.lng == null &&
          geocodableAddress(booking).length > 0 &&
          !(booking.id in geocodedLocations),
      ),
    [bookings, geocodedLocations],
  );

  useEffect(() => {
    if (bookingsNeedingGeocode.length === 0) return;

    const controller = new AbortController();

    async function geocodeBookings() {
      const entries = await Promise.all(
        bookingsNeedingGeocode.map(async (booking) => {
          try {
            const query = encodeURIComponent(geocodableAddress(booking));
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${accessToken}&limit=1`,
              { signal: controller.signal },
            );
            if (!response.ok) return [booking.id, null] as const;
            const data = (await response.json()) as { features?: Array<{ center?: [number, number] }> };
            const center = data.features?.[0]?.center;
            return [booking.id, center ? { lng: center[0], lat: center[1] } : null] as const;
          } catch {
            return [booking.id, null] as const;
          }
        }),
      );

      if (controller.signal.aborted) return;
      setGeocodedLocations((current) => {
        const next = { ...current };
        for (const entry of entries) {
          next[entry[0]] = entry[1];
        }
        return next;
      });
    }

    void geocodeBookings();

    return () => {
      controller.abort();
    };
  }, [accessToken, bookingsNeedingGeocode]);

  const mappedBookings: MappedBooking[] = [
    ...storedLocations.map((booking) => ({ booking, position: { lat: booking.property.lat, lng: booking.property.lng } })),
    ...bookings
      .filter((booking) => geocodedLocations[booking.id])
      .map((booking) => ({ booking, position: geocodedLocations[booking.id] as LatLng })),
  ];

  if (mappedBookings.length === 0 && bookingsNeedingGeocode.length > 0) {
    return <Skeleton className="h-[460px] w-full rounded-xl" />;
  }

  if (mappedBookings.length === 0) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-line bg-white p-6">
        <EmptyState icon="mapView" title="No trip locations yet" description="Your booked properties don't have coordinates or a usable city/state yet." />
      </div>
    );
  }

  return <MapboxTripsMap accessToken={accessToken} mappedBookings={mappedBookings} />;
}

function MapboxTripsMap({ accessToken, mappedBookings }: { accessToken: string; mappedBookings: MappedBooking[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [style, setStyle] = useState(MAPBOX_STREETS);

  const center = useMemo<[number, number]>(() => {
    const lng = mappedBookings.reduce((sum, item) => sum + item.position.lng, 0) / mappedBookings.length;
    const lat = mappedBookings.reduce((sum, item) => sum + item.position.lat, 0) / mappedBookings.length;
    return [lng, lat];
  }, [mappedBookings]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style,
      center,
      zoom: 12,
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [accessToken, center, style]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(style);
  }, [style]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();
    mappedBookings.forEach((item) => {
      const element = document.createElement("button");
      element.type = "button";
      element.className = "flex size-10 items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-lg";
      element.innerHTML = `<span class="sr-only">${escapeHtml(item.booking.property.title)}</span>`;

      const marker = new mapboxgl.Marker({ element, anchor: "bottom" })
        .setLngLat([item.position.lng, item.position.lat])
        .setPopup(new mapboxgl.Popup({ offset: 18, maxWidth: "280px" }).setHTML(popupHtml(item)))
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([item.position.lng, item.position.lat]);
    });

    if (mappedBookings.length === 1) {
      map.flyTo({ center: [mappedBookings[0].position.lng, mappedBookings[0].position.lat], zoom: 13, essential: true });
    } else {
      map.fitBounds(bounds, { padding: 64, maxZoom: 13, duration: 500 });
    }
  }, [mappedBookings]);

  return (
    <div className="relative h-[460px] overflow-hidden rounded-xl border border-line bg-white">
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
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white px-3 py-2 text-xs font-medium text-ink shadow-sm">
        <Icon name="mapPin" size={14} weight="fill" className="mr-1 inline text-brand" />
        {mappedBookings.length} {mappedBookings.length === 1 ? "stay" : "stays"}
      </div>
    </div>
  );
}

function popupHtml(item: MappedBooking) {
  const booking = item.booking;
  const location = [booking.property.city, booking.property.state, booking.property.country].filter(Boolean).join(", ");
  const directionsUrl = `https://www.mapbox.com/directions/?destination=${item.position.lng},${item.position.lat}`;
  const thumbnail = booking.property.thumbnailUrl
    ? `<img src="${escapeAttribute(booking.property.thumbnailUrl)}" alt="" style="width:100%;height:96px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />`
    : "";

  return `
    <div style="max-width:240px;font-family:Inter,system-ui,sans-serif;color:#06152f;">
      ${thumbnail}
      <p style="margin:0;font-weight:700;">${escapeHtml(booking.property.title)}</p>
      <p style="margin:4px 0 0;color:#56657f;">${format(new Date(booking.checkIn), "MMM d")} - ${format(new Date(booking.checkOut), "MMM d, yyyy")}</p>
      <p style="margin:4px 0 0;color:#56657f;">${escapeHtml(location)}</p>
      <a href="${directionsUrl}" target="_blank" rel="noreferrer" style="display:inline-block;margin-top:8px;color:#0648ad;font-weight:700;">Directions</a>
    </div>
  `;
}

function geocodableAddress(booking: BookingDetail) {
  return [booking.property.city, booking.property.state, booking.property.country].filter(Boolean).join(", ");
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
