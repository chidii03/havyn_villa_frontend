"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { BookingDetail } from "@havyn/shared";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { listAdminBookings } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/auth-provider";
import { formatPrice } from "@/lib/format/currency";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  CONFIRMED: "default",
  COMPLETED: "default",
  PENDING: "secondary",
  CANCELLED: "outline",
  REFUNDED: "outline",
};

export default function AdminBookingsPage() {
  const { accessToken } = useAuth();
  const bookingsQuery = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () => listAdminBookings(accessToken!),
    enabled: Boolean(accessToken),
  });

  const bookings = bookingsQuery.data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      {bookingsQuery.isLoading && <Skeleton className="h-52 w-full" />}
      {bookingsQuery.isError && (
        <ErrorState title="Couldn't load bookings" description="Please try again in a moment." onRetry={() => bookingsQuery.refetch()} />
      )}
      {bookingsQuery.data && bookings.length === 0 && (
        <EmptyState icon="calendarCheck" title="No bookings yet" description="Paid and pending booking records will appear here." />
      )}
      {bookings.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-muted text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Guests</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BookingRow({ booking }: { booking: BookingDetail }) {
  return (
    <tr className="border-t border-line">
      <td className="px-4 py-3 font-medium text-ink">{booking.referenceId ?? "-"}</td>
      <td className="px-4 py-3 text-ink-muted">{booking.property.title}</td>
      <td className="px-4 py-3 text-ink-muted">
        {format(new Date(booking.checkIn), "MMM d")} - {format(new Date(booking.checkOut), "MMM d, yyyy")}
      </td>
      <td className="px-4 py-3 tabular-nums text-ink-muted">{booking.guests}</td>
      <td className="px-4 py-3 tabular-nums text-ink-muted">{formatPrice(booking.grandTotal, booking.currency)}</td>
      <td className="px-4 py-3">
        <Badge variant={STATUS_VARIANTS[booking.status] ?? "outline"}>{booking.status}</Badge>
      </td>
    </tr>
  );
}
