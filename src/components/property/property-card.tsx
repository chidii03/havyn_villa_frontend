import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { formatPrice } from "@/lib/format/currency";
import { CardCarousel } from "./card-carousel";
import { WishlistHeart } from "./wishlist-heart";

export interface PropertyCardData {
  id: string;
  title: string;
  city: string;
  state: string;
  currency: string;
  basePrice: number;
  ratingAvg: number;
  ratingCount: number;
  photoUrls: string[];
}

/** frontend/03-ui-and-navigation-spec.md#5. */
export function PropertyCard({ property }: { property: PropertyCardData }) {
  const photos = property.photoUrls.filter(Boolean).map((url) => ({ url, alt: property.title }));

  return (
    <Link href={`/rooms/${property.id}`} className="group block focus-visible:outline-none">
      <div className="relative">
        <CardCarousel photos={photos} title={property.title} />
        <WishlistHeart propertyId={property.id} title={property.title} className="absolute top-2 right-2" />
      </div>

      <div className="mt-2 flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-medium text-ink group-hover:underline">
          {property.city}, {property.state}
        </p>
        {property.ratingCount > 0 && (
          <div className="flex shrink-0 items-center gap-1 text-sm text-ink">
            <Icon name="star" size={13} weight="fill" />
            <span className="tabular-nums">{property.ratingAvg.toFixed(1)}</span>
          </div>
        )}
      </div>
      <p className="truncate text-sm text-ink-muted">{property.title}</p>
      <p className="mt-1 text-sm text-ink">
        <span className="font-semibold tabular-nums">{formatPrice(property.basePrice, property.currency)}</span>
        <span className="text-ink-muted"> / night</span>
      </p>
    </Link>
  );
}
