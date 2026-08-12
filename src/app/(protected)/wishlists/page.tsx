"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/patterns/empty-state";
import { PropertyCard } from "@/components/property/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { listFavorites } from "@/lib/api/favorites";
import { getProperty } from "@/lib/api/properties";
import { useAuth } from "@/lib/auth/auth-provider";

export default function WishlistsPage() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const wishlistQuery = useQuery({
    queryKey: ["favorites", "properties"],
    queryFn: async () => {
      const favorites = await listFavorites(accessToken!);
      return Promise.all(favorites.data.map((favorite) => getProperty(favorite.propertyId)));
    },
    enabled: Boolean(accessToken),
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink">Wishlists</h1>
      <div className="mt-8">
        {wishlistQuery.isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="aspect-4/3 rounded-xl" />
            ))}
          </div>
        )}

        {wishlistQuery.data && wishlistQuery.data.length === 0 && (
          <EmptyState
            icon="heart"
            title="No saved stays yet"
            description="Tap the heart on any property to save it here."
            action={{ label: "Explore stays", onClick: () => router.push("/") }}
          />
        )}

        {wishlistQuery.data && wishlistQuery.data.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistQuery.data.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {wishlistQuery.isError && (
          <EmptyState
            icon="warning"
            title="Couldn't load your wishlist"
            description="Please try again in a moment."
            action={{ label: "Try again", onClick: () => wishlistQuery.refetch() }}
          />
        )}
      </div>
    </div>
  );
}
