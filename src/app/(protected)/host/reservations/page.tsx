"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { listReservations } from "@/lib/api/host";
import { useAuth } from "@/lib/auth/auth-provider";
import { formatPrice } from "@/lib/format/currency";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  PENDING: { label: "Awaiting payment", variant: "secondary" },
  CONFIRMED: { label: "Confirmed", variant: "default" },
  CANCELLED: { label: "Cancelled", variant: "outline" },
  COMPLETED: { label: "Completed", variant: "default" },
  REFUNDED: { label: "Refunded", variant: "outline" },
};

export default function HostReservationsPage() {
  const { accessToken } = useAuth();

  const reservationsQuery = useQuery({
    queryKey: ["host", "reservations"],
    queryFn: () => listReservations(accessToken!),
    enabled: Boolean(accessToken),
  });

  if (reservationsQuery.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="rounded-xl border border-line p-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="mt-2 h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (reservationsQuery.isError) {
    return (
      <ErrorState
        title="Couldn't load your reservations"
        description="Please try again in a moment."
        onRetry={() => reservationsQuery.refetch()}
      />
    );
  }

  const reservations = reservationsQuery.data?.data ?? [];

  if (reservations.length === 0) {
    return (
      <EmptyState icon="calendarCheck" title="No reservations yet" description="Once a guest books one of your listings, it'll show up here." />
    );
  }

  return (
    <ul className="space-y-4">
      {reservations.map((reservation) => {
        const status = STATUS_LABELS[reservation.status] ?? { label: reservation.status, variant: "outline" as const };
        return (
          <li key={reservation.id} className="rounded-xl border border-line p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{reservation.propertyTitle}</p>
                <p className="text-sm text-ink-muted">{reservation.guestName}</p>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              {format(new Date(reservation.checkIn), "MMM d")} – {format(new Date(reservation.checkOut), "MMM d, yyyy")} ·{" "}
              {reservation.guestsCount} {reservation.guestsCount === 1 ? "guest" : "guests"}
            </p>
            <p className="mt-2 text-sm text-ink">
              <span className="font-semibold tabular-nums">{formatPrice(reservation.grandTotal, reservation.currency)}</span>
              <span className="text-ink-muted"> total</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
