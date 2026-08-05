"use client";

import { APIProvider, AdvancedMarker, InfoWindow, Map, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { format } from "date-fns";
import { useState } from "react";
import type { BookingDetail } from "@havyn/shared";
import { EmptyState } from "@/components/patterns/empty-state";
import { Icon } from "@/components/ui/icon";

export function TripsMap({ bookings }: { bookings: BookingDetail[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
  const located = bookings.filter(
    (booking): booking is BookingDetail & { property: BookingDetail["property"] & { lat: number; lng: number } } =>
      booking.property.lat != null && booking.property.lng != null,
  );

  if (!apiKey) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-line bg-white p-6">
        <EmptyState icon="mapView" title="Map key needed" description="Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to show booked stays on a map." />
      </div>
    );
  }

  if (located.length === 0) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-line bg-white p-6">
        <EmptyState icon="mapView" title="No trip locations yet" description="Your booked properties don't have coordinates yet." />
      </div>
    );
  }

  const center = {
    lat: located.reduce((sum, booking) => sum + booking.property.lat, 0) / located.length,
    lng: located.reduce((sum, booking) => sum + booking.property.lng, 0) / located.length,
  };

  return (
    <div className="h-[460px] overflow-hidden rounded-xl border border-line bg-white">
      <APIProvider apiKey={apiKey}>
        <Map defaultCenter={center} defaultZoom={12} mapId={mapId} gestureHandling="greedy" disableDefaultUI={false} className="h-full w-full">
          {located.map((booking) => (
            <TripMarker key={booking.id} booking={booking} />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}

function TripMarker({
  booking,
}: {
  booking: BookingDetail & { property: BookingDetail["property"] & { lat: number; lng: number } };
}) {
  const [open, setOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: booking.property.lat, lng: booking.property.lng }}
        onClick={() => setOpen(true)}
      >
        <div className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-lg">
          <Icon name="mapPin" size={18} weight="fill" />
        </div>
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)} minWidth={220}>
          <div className="max-w-[240px] text-sm text-ink">
            {booking.property.thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- external property media URLs
              <img src={booking.property.thumbnailUrl} alt="" className="mb-2 h-24 w-full rounded-md object-cover" />
            )}
            <p className="font-semibold">{booking.property.title}</p>
            <p className="text-ink-muted">
              {format(new Date(booking.checkIn), "MMM d")} - {format(new Date(booking.checkOut), "MMM d, yyyy")}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
