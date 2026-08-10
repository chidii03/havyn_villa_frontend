"use client";

import { useState } from "react";
import { BookingWidget } from "./booking-widget";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format/currency";

export function MobileBookingBar({
  propertyId,
  capacity,
  currency,
  basePrice,
  propertyTitle: _propertyTitle,
  location: _location,
}: {
  propertyId: string;
  capacity: number;
  currency: string;
  basePrice: number;
  propertyTitle?: string;
  location?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-1100 border-t border-line bg-surface/95 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <p className="text-ink">
          <span className="font-semibold tabular-nums">{formatPrice(basePrice, currency)}</span>
          <span className="text-ink-muted"> / night</span>
        </p>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button type="button" className="min-h-11 px-6" />}>Reserve</SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Reserve your stay</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-4">
              <BookingWidget propertyId={propertyId} capacity={capacity} currency={currency} basePrice={basePrice} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
