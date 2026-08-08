"use client";

import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface GalleryPhoto {
  url: string;
  alt: string;
  kind?: "image" | "video";
}

interface GalleryProps {
  photos: GalleryPhoto[];
  title: string;
}

interface GalleryTileProps {
  photo: GalleryPhoto;
  onClick: () => void;
  className?: string;
  overlay?: string;
}

interface LightboxProps {
  photos: GalleryPhoto[];
  initialIndex: number;
  title: string;
  onClose: () => void;
}

export function Gallery({ photos, title }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl bg-muted sm:aspect-21/9">
        <Icon name="image" size={32} className="text-ink-muted" />
        <p className="text-sm text-ink-muted">Photos for {title} haven&apos;t been added yet</p>
      </div>
    );
  }

  const [hero, ...rest] = photos;
  const visibleThumbs = rest.slice(0, 4);
  const remainingCount = photos.length - 1 - visibleThumbs.length;

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 overflow-hidden rounded-2xl sm:aspect-21/9 sm:grid-cols-4 sm:grid-rows-2">
        <GalleryTile photo={hero} onClick={() => setLightboxIndex(0)} className="sm:col-span-2 sm:row-span-2" />
        {visibleThumbs.map((photo, index) => (
          <GalleryTile
            key={photo.url}
            photo={photo}
            onClick={() => setLightboxIndex(index + 1)}
            className="hidden sm:block"
            overlay={index === visibleThumbs.length - 1 && remainingCount > 0 ? `+${remainingCount} more` : undefined}
          />
        ))}
      </div>

      <Button type="button" variant="outline" className="mt-3 gap-1.5" onClick={() => setLightboxIndex(0)}>
        <Icon name="expand" size={14} />
        Show all photos
      </Button>

      {lightboxIndex !== null && (
        <Lightbox photos={photos} initialIndex={lightboxIndex} title={title} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}

function GalleryTile({
  photo,
  onClick,
  className,
  overlay,
}: GalleryTileProps) {
  return (
    <button type="button" onClick={onClick} className={cn("relative aspect-square w-full sm:aspect-auto", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary CDN URLs */}
      <img src={photo.url} alt={photo.alt} className="h-full w-full object-cover" loading="lazy" />
      {photo.kind === "video" && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Icon name="playCircle" size={28} weight="fill" className="text-white" />
        </span>
      )}
      {overlay && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">
          {overlay}
        </span>
      )}
    </button>
  );
}

function Lightbox({
  photos,
  initialIndex,
  title,
  onClose,
}: LightboxProps) {
  const [index, setIndex] = useState<number>(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const current = photos[index];

  function go(delta: number) {
    setIndex((prev) => (prev + delta + photos.length) % photos.length);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") onClose();
    if (event.key === "ArrowLeft") go(-1);
    if (event.key === "ArrowRight") go(1);
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(deltaX) > 50) go(deltaX > 0 ? -1 : 1);
    touchStartX.current = null;
  }

  return (
    <Dialog open onOpenChange={(open: unknown) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex h-screen max-h-none w-screen max-w-none flex-col gap-0 rounded-none bg-black p-0 sm:max-w-none"
        onKeyDown={onKeyDown}
      >
        <DialogTitle className="sr-only">
          {title} — photo {index + 1} of {photos.length}
        </DialogTitle>
        <button
          type="button"
          aria-label="Close photo viewer"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25"
        >
          <Icon name="close" size={18} />
        </button>

        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {current.kind === "video" ? (
            <video src={current.url} controls autoPlay className="max-h-full max-w-full" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- Cloudinary CDN URLs
            <img src={current.url} alt={current.alt} className="max-h-full max-w-full object-contain" />
          )}

          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <Icon name="chevronLeft" size={18} />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <Icon name="chevronRight" size={18} />
              </button>
            </>
          )}
        </div>

        <p className="py-3 text-center text-sm tabular-nums text-white/70">
          {index + 1} / {photos.length}
        </p>
      </DialogContent>
    </Dialog>
  );
}
