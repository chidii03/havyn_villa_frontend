"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/lib/auth/auth-provider";
import { cn } from "@/lib/utils";

export function WishlistHeart({ propertyId, title, className }: { propertyId: string; title: string; className?: string }) {
  const { status } = useAuth();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (status !== "authenticated") {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    toast.info("Wishlists are launching soon", {
      description: `We're not able to save "${title}" yet — this is coming in a future update.`,
    });
  }

  return (
    <motion.button
      type="button"
      aria-label={`Save ${title} to wishlist`}
      onClick={handleClick}
      whileTap={reduceMotion ? undefined : { scale: 1.25 }}
      className={cn(
        "flex size-11 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/30",
        className,
      )}
      data-testid={`wishlist-heart-${propertyId}`}
    >
      <Icon name="heart" size={18} weight="bold" />
    </motion.button>
  );
}
