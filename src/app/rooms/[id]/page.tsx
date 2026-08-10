import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/booking/booking-widget";
import { MobileBookingBar } from "@/components/booking/mobile-booking-bar";
import { WhatsAppButton } from "@/components/booking/whatsapp-button";
import { AmenitiesGrid } from "@/components/property/amenities-grid";
import { Gallery } from "@/components/property/gallery";
import { HostCard } from "@/components/property/host-card";
import { MapView } from "@/components/property/map-view-lazy";
import { PolicyBlock } from "@/components/property/policy-block";
import { ReviewsSection } from "@/components/property/reviews-section";
import { Icon } from "@/components/ui/icon";
import { ApiError } from "@/lib/api/http";
import { getProperty } from "@/lib/api/properties";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await getProperty(id).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  });

  const location = `${property.city}, ${property.state}`;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <Gallery
        photos={property.photoUrls.map((url) => ({ url, alt: property.title }))}
        title={property.title}
      />

      <div className="mt-6 grid gap-8 pb-24 lg:grid-cols-[1fr_340px] lg:pb-0">
        <div className="space-y-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              {property.title}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-ink-muted">
              <Icon name="mapPin" size={15} />
              {property.city}, {property.state}, {property.country}
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
              <span className="flex items-center gap-1">
                <Icon name="guests" size={15} /> {property.capacity} guests
              </span>
              <span aria-hidden>·</span>
              <span className="flex items-center gap-1">
                <Icon name="bed" size={15} /> {property.bedrooms} bedrooms
              </span>
              <span aria-hidden>·</span>
              <span className="flex items-center gap-1">
                <Icon name="bathtub" size={15} /> {property.bathrooms} baths
              </span>
            </p>
          </div>

          <ReviewsSection
            ratingAvg={property.ratingAvg}
            ratingCount={property.ratingCount}
          />

          <HostCard hostId={property.hostId} />

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">
              About this place
            </h2>
            <p className="mt-2 text-sm whitespace-pre-line text-ink-muted">
              {property.description}
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">
              What this place offers
            </h2>
            <div className="mt-3">
              <AmenitiesGrid amenities={property.amenities} />
            </div>
          </div>

          {property.lat != null && property.lng != null && (
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                Where you&apos;ll be
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Approximate area shown — the exact location is shared after
                booking.
              </p>
              <div className="mt-3 h-72">
                <MapView
                  pins={[
                    {
                      id: property.id,
                      title: property.title,
                      city: property.city,
                      state: property.state,
                      lat: property.lat,
                      lng: property.lng,
                      currency: property.currency,
                      basePrice: property.basePrice,
                    },
                  ]}
                />
              </div>
            </div>
          )}

          <PolicyBlock
            houseRules={property.houseRules}
            cancellationPolicy={property.cancellationPolicy}
          />

          <div className="lg:hidden">
            <WhatsAppButton
              propertyTitle={property.title}
              location={location}
            />
          </div>
        </div>

        <div className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
          <BookingWidget
            propertyId={property.id}
            capacity={property.capacity}
            currency={property.currency}
            basePrice={property.basePrice}
          />
          <WhatsAppButton propertyTitle={property.title} location={location} />
        </div>
      </div>

      <MobileBookingBar
        propertyId={property.id}
        capacity={property.capacity}
        currency={property.currency}
        basePrice={property.basePrice}
        propertyTitle={property.title}
        location={location}
      />
    </div>
  );
}
