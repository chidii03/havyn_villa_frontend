"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { BookingDetail } from "@havyn/shared";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { TripsMap } from "@/components/trips/trips-map";
import { useAuth } from "@/lib/auth/auth-provider";
import { ApiError } from "@/lib/api/http";
import { cancelBooking, listBookings } from "@/lib/api/bookings";
import { formatPrice } from "@/lib/format/currency";

/**
 * frontend/03-ui-and-navigation-spec.md#3. Real `GET /bookings` data — no "upcoming/
 * past" framing, since nothing can be CONFIRMED yet (no payment provider, prompt 13);
 * see BookingWidget's doc comment and frontend/01-frontend-foundation.md's session 6
 * notes. A flat list with honest status labels is what's actually true right now.
 */
export default function TripsPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: ["bookings", "mine"],
    queryFn: () => listBookings(accessToken!),
    enabled: Boolean(accessToken),
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => cancelBooking(accessToken!, bookingId),
    onSuccess: (result) => {
      toast.success(
        result.refundAmount > 0
          ? `Booking cancelled — ${formatPrice(result.refundAmount, result.booking.currency)} refund initiated`
          : "Booking cancelled",
      );
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Couldn't cancel this booking. Please try again.");
    },
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink">Trips</h1>

      <div className="mt-8">
        {bookingsQuery.isLoading && <TripsSkeleton />}

        {bookingsQuery.isError && (
          <ErrorState
            title="Couldn't load your trips"
            description="Please try again in a moment."
            onRetry={() => bookingsQuery.refetch()}
          />
        )}

        {bookingsQuery.data && bookingsQuery.data.data.length === 0 && (
          <EmptyState
            icon="suitcase"
            title="No trips booked yet"
            description="Reserve a stay and it'll show up here."
            action={{ label: "Explore stays", onClick: () => router.push("/") }}
          />
        )}

        {bookingsQuery.data && bookingsQuery.data.data.length > 0 && (
          <div className="space-y-6">
            <TripsMap bookings={bookingsQuery.data.data} />
            <ul className="space-y-4">
              {bookingsQuery.data.data.map((booking) => (
                <TripCard
                  key={booking.id}
                  booking={booking}
                  onCancel={() => cancelMutation.mutate(booking.id)}
                  cancelling={cancelMutation.isPending && cancelMutation.variables === booking.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  PENDING: { label: "Awaiting payment", variant: "secondary" },
  CONFIRMED: { label: "Confirmed", variant: "default" },
  CANCELLED: { label: "Cancelled", variant: "outline" },
  COMPLETED: { label: "Completed", variant: "default" },
  REFUNDED: { label: "Refunded", variant: "outline" },
};

const CANCELLABLE_STATUSES = new Set(["PENDING", "CONFIRMED"]);

function TripCard({ booking, onCancel, cancelling }: { booking: BookingDetail; onCancel: () => void; cancelling: boolean }) {
  const status = STATUS_LABELS[booking.status] ?? { label: booking.status, variant: "outline" as const };
  const canCancel = CANCELLABLE_STATUSES.has(booking.status);

  return (
    <li className="rounded-xl border border-line p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-ink">{booking.property.title}</p>
          <p className="text-sm text-ink-muted">
            {booking.property.city && booking.property.state ? `${booking.property.city}, ${booking.property.state}` : ""}
          </p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-muted">
        <Icon name="calendar" size={14} />
        {format(new Date(booking.checkIn), "MMM d")} – {format(new Date(booking.checkOut), "MMM d, yyyy")} ·{" "}
        {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
      </p>

      {booking.status === "PENDING" && booking.holdExpiresAt && (
        <p className="mt-1 text-sm text-ink-muted">Hold expires around {format(new Date(booking.holdExpiresAt), "MMM d, h:mm a")}.</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-ink">
          <span className="font-semibold tabular-nums">{formatPrice(booking.grandTotal, booking.currency)}</span>
          <span className="text-ink-muted"> total</span>
        </p>
        {canCancel && (
          <Button type="button" variant="outline" size="sm" className="min-h-11" onClick={onCancel} disabled={cancelling}>
            {cancelling ? "Cancelling…" : "Cancel"}
          </Button>
        )}
      </div>
    </li>
  );
}

function TripsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="rounded-xl border border-line p-4">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-2 h-4 w-1/3" />
          <Skeleton className="mt-3 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
