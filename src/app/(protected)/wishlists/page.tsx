"use client";

import { EmptyState } from "@/components/patterns/empty-state";
import { useRouter } from "next/navigation";

export default function WishlistsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink">Wishlists</h1>
      <div className="mt-8">
        <EmptyState
          icon="heart"
          title="No saved stays yet"
          description="Tap the heart on any property to save it here — favorites land once the property domain (prompt 10) exists."
          action={{ label: "Explore stays", onClick: () => router.push("/") }}
        />
      </div>
    </div>
  );
}
