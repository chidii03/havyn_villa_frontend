"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BookingDetail, QuoteResponse } from "@havyn/shared";
import { WhenPanel } from "@/components/search/when-panel";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/auth-provider";
import { ApiError } from "@/lib/api/http";
import { createBooking, quoteProperty } from "@/lib/api/bookings";
import { createPaymentIntent } from "@/lib/api/payments";
import { formatPrice } from "@/lib/format/currency";
import { cn } from "@/lib/utils";


export function BookingWidget({
  propertyId,
  capacity,
  currency,
  basePrice,
}: {
  propertyId: string;
  capacity: number;
  currency: string;
  basePrice: number;
}) {
  const { status, accessToken } = useAuth();
  const router = useRouter();

  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [datesOpen, setDatesOpen] = useState(false);
  const [reserveState, setReserveState] = useState<"idle" | "submitting" | "held" | "error">("idle");
  const [reserveError, setReserveError] = useState<string | null>(null);
  const [heldBooking, setHeldBooking] = useState<BookingDetail | null>(null);

  const hasValidRange = Boolean(checkIn && checkOut && checkIn < checkOut);
  const checkInIso = checkIn ? format(checkIn, "yyyy-MM-dd") : null;
  const checkOutIso = checkOut ? format(checkOut, "yyyy-MM-dd") : null;
  const selectionKey = `${checkInIso}:${checkOutIso}:${guests}`;
  const [trackedSelectionKey, setTrackedSelectionKey] = useState(selectionKey);
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
  if (selectionKey !== trackedSelectionKey) {
    setTrackedSelectionKey(selectionKey);
    setIdempotencyKey(crypto.randomUUID());
    setReserveState("idle");
    setReserveError(null);
    setHeldBooking(null);
  }

  const quoteQuery = useQuery({
    queryKey: ["quote", propertyId, checkInIso, checkOutIso, guests],
    queryFn: () => quoteProperty(propertyId, { checkIn: checkInIso!, checkOut: checkOutIso!, guests }),
    enabled: hasValidRange,
    retry: false,
  });

  async function handleReserve() {
    if (!hasValidRange || !quoteQuery.data) return;
    if (status === "loading") return;

    if (status !== "authenticated" || !accessToken) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setReserveState("submitting");
    setReserveError(null);
    try {
      const booking = await createBooking(
        accessToken,
        { propertyId, checkIn: checkInIso!, checkOut: checkOutIso!, guests, expectedTotal: quoteQuery.data.grandTotal },
        idempotencyKey,
      );
      await openCheckout(accessToken, booking.id);
      setHeldBooking(booking);
      setReserveState("held");
    } catch (error) {
      setReserveState("error");
      setReserveError(reserveErrorMessage(error));
      if (error instanceof ApiError && error.code === "PRICE_CHANGED") {
        quoteQuery.refetch();
      }
    }
  }

  if (reserveState === "held" && heldBooking) {
    return <HoldConfirmation booking={heldBooking} accessToken={accessToken} />;
  }

  return (
    <div className="rounded-2xl border border-line p-5 shadow-sm">
      <p className="text-lg text-ink">
        <span className="font-semibold tabular-nums">{formatPrice(basePrice, currency)}</span>
        <span className="text-ink-muted"> / night</span>
      </p>

      <div className="mt-4 space-y-2">
        <Popover open={datesOpen} onOpenChange={setDatesOpen}>
          <PopoverTrigger
            className="w-full rounded-lg border border-line px-3 py-2.5 text-left transition-colors hover:bg-muted"
            aria-expanded={datesOpen}
          >
            <span className="block text-xs font-medium text-ink-muted">Dates</span>
            <span className="text-sm text-ink">
              {checkIn && checkOut ? `${format(checkIn, "MMM d")} – ${format(checkOut, "MMM d, yyyy")}` : "Add dates"}
            </span>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-3">
            <WhenPanel
              checkIn={checkIn}
              checkOut={checkOut}
              onChange={({ checkIn: nextIn, checkOut: nextOut }) => {
                setCheckIn(nextIn);
                setCheckOut(nextOut);
                if (nextIn && nextOut) setDatesOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5">
          <div>
            <span className="block text-xs font-medium text-ink-muted">Guests</span>
            <span className="text-sm text-ink">
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Fewer guests"
              disabled={guests <= 1}
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
            >
              <Icon name="minus" size={14} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="More guests"
              disabled={guests >= capacity}
              onClick={() => setGuests((g) => Math.min(capacity, g + 1))}
            >
              <Icon name="plus" size={14} />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {!hasValidRange && <p className="text-sm text-ink-muted">Add your dates to see the total price.</p>}
        {hasValidRange && quoteQuery.isLoading && <QuoteSkeleton />}
        {hasValidRange && quoteQuery.isError && (
          <p role="alert" className="text-sm text-danger">
            {reserveErrorMessage(quoteQuery.error)}
          </p>
        )}
        {hasValidRange && quoteQuery.data && <QuoteBreakdown quote={quoteQuery.data} />}
      </div>

      {reserveState === "error" && reserveError && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {reserveError}
        </p>
      )}

      <Button
        type="button"
        className="mt-4 w-full"
        disabled={!hasValidRange || !quoteQuery.data || reserveState === "submitting" || status === "loading"}
        onClick={handleReserve}
      >
        {reserveState === "submitting"
          ? "Reserving…"
          : status === "loading"
            ? "Checking session…"
            : status === "authenticated"
              ? "Reserve"
              : "Log in to reserve"}
      </Button>
      <p className="mt-2 text-center text-xs text-ink-muted">Your dates are held first, then secure checkout opens.</p>
    </div>
  );
}

function QuoteBreakdown({ quote }: { quote: QuoteResponse }) {
  return (
    <dl className="space-y-2 text-sm">
      <Row label={`${formatPrice(quote.baseTotal / quote.nights, quote.currency)} x ${quote.nights} nights`} value={quote.baseTotal} currency={quote.currency} />
      {quote.cleaningFee > 0 && <Row label="Cleaning fee" value={quote.cleaningFee} currency={quote.currency} />}
      {quote.serviceFee > 0 && <Row label="Service fee" value={quote.serviceFee} currency={quote.currency} />}
      {quote.discountTotal > 0 && <Row label="Discount" value={-quote.discountTotal} currency={quote.currency} />}
      {quote.taxTotal > 0 && <Row label="Taxes" value={quote.taxTotal} currency={quote.currency} />}
      <div className="border-t border-line pt-2">
        <Row label="Total" value={quote.grandTotal} currency={quote.currency} bold />
      </div>
    </dl>
  );
}

function Row({ label, value, currency, bold }: { label: string; value: number; currency: string; bold?: boolean }) {
  return (
    <div className={cn("flex justify-between", bold ? "font-semibold text-ink" : "text-ink-muted")}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{formatPrice(value, currency)}</dd>
    </div>
  );
}

function QuoteSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

function HoldConfirmation({ booking, accessToken }: { booking: BookingDetail; accessToken: string | null }) {
  const [paymentState, setPaymentState] = useState<"idle" | "submitting" | "error">("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  async function handlePayment() {
    if (!accessToken) {
      setPaymentError("Your session has expired. Please log in again to pay securely.");
      return;
    }
    setPaymentState("submitting");
    setPaymentError(null);
    try {
      const intent = await createPaymentIntent(accessToken, booking.id);
      openCheckoutUrl(intent.checkoutUrl);
    } catch (error) {
      setPaymentState("error");
      setPaymentError(paymentErrorMessage(error));
    }
  }
  return (
    <div className="rounded-2xl border border-line p-5 shadow-sm">
      <div className="flex items-center gap-2 text-brand">
        <Icon name="calendarCheck" size={20} weight="fill" />
        <p className="font-semibold">Dates held</p>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        {format(new Date(booking.checkIn), "MMM d")} – {format(new Date(booking.checkOut), "MMM d, yyyy")} at{" "}
        {booking.property.title || "this property"} is held for you.
      </p>
      {booking.holdExpiresAt && (
        <p className="mt-1 text-sm text-ink-muted">Hold expires around {format(new Date(booking.holdExpiresAt), "h:mm a")}.</p>
      )}
      <p className="mt-4 text-sm text-ink">
        Total: <span className="font-semibold tabular-nums">{formatPrice(booking.grandTotal, booking.currency)}</span>
      </p>
      {paymentError && <p role="alert" className="mt-3 text-sm text-danger">{paymentError}</p>}
      <Button type="button" className="mt-4 w-full" onClick={handlePayment} disabled={paymentState === "submitting"}>
        {paymentState === "submitting" ? "Opening secure checkout..." : "Pay securely"}
      </Button>
      <Link href="/trips" className="mt-4 block text-center text-sm font-medium text-brand hover:underline">
        View in Trips
      </Link>
    </div>
  );
}

async function openCheckout(accessToken: string, bookingId: string) {
  const intent = await createPaymentIntent(accessToken, bookingId);
  openCheckoutUrl(intent.checkoutUrl);
}

function openCheckoutUrl(checkoutUrl: string | null | undefined) {
  if (!checkoutUrl) {
    throw new Error("The payment provider did not return a checkout link.");
  }
  window.location.assign(checkoutUrl);
}

function reserveErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case "DATES_UNAVAILABLE":
        return "These dates were just booked by someone else. Please choose different dates.";
      case "PRICE_CHANGED":
        return "The price for these dates changed. We've refreshed it — please review and try again.";
      case "EXCEEDS_CAPACITY":
        return error.message;
      case "PROPERTY_BOOKING_IN_PROGRESS":
        return "This property is being booked by someone else right now. Please try again in a moment.";
      case "UNAUTHENTICATED":
        return "Please log in to reserve.";
      default:
        return error.message || "Please check your internet connection and try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

function paymentErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "HOLD_EXPIRED") return "Your reservation hold expired. Please reserve these dates again.";
    if (error.code === "BOOKING_NOT_PAYABLE") return "This booking can no longer be paid for.";
    if (error.code === "PAYMENT_PROVIDER_NOT_CONFIGURED") return "Secure checkout is temporarily unavailable. Please try again later.";
    return error.message || "We could not start checkout. Please try again.";
  }
  return error instanceof Error ? error.message : "We could not start checkout. Please try again.";
}
