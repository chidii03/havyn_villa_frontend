"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { addFavorite, listFavorites, removeFavorite } from "@/lib/api/favorites";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";
import { cn } from "@/lib/utils";

export function WishlistHeart({ propertyId, title, className }: { propertyId: string; title: string; className?: string }) {
  const { status, accessToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const reduceMotion = useReducedMotion();
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => listFavorites(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
  });
  const saved = Boolean(favoritesQuery.data?.data.some((favorite) => favorite.propertyId === propertyId));

  const toggleMutation = useMutation({
    mutationFn: () => (saved ? removeFavorite(accessToken!, propertyId) : addFavorite(accessToken!, propertyId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(saved ? "Removed from wishlist" : "Saved to wishlist");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Couldn't update your wishlist. Please try again.");
    },
  });

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (status !== "authenticated") {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    toggleMutation.mutate();
  }

  return (
    <motion.button
      type="button"
      aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      onClick={handleClick}
      whileTap={reduceMotion ? undefined : { scale: 1.25 }}
      className={cn(
        "flex size-11 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/30 disabled:opacity-70",
        className,
      )}
      disabled={toggleMutation.isPending}
      data-testid={`wishlist-heart-${propertyId}`}
    >
      <Icon name="heart" size={18} weight={saved ? "fill" : "bold"} />
    </motion.button>
  );
}
