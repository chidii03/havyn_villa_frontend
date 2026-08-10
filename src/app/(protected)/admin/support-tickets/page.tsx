"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { listSupportTickets } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/auth-provider";

const STATUS_OPTIONS = ["", "OPEN", "REVIEWING", "RESOLVED"] as const;

export default function AdminSupportTicketsPage() {
  const { accessToken } = useAuth();
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("");
  const [search, setSearch] = useState("");

  const ticketsQuery = useQuery({
    queryKey: ["admin", "support-tickets", status, search],
    queryFn: () => listSupportTickets(accessToken!, status, search),
    enabled: Boolean(accessToken),
  });

  const tickets = ticketsQuery.data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search reference ID or complaint summary"
          aria-label="Search support tickets"
        />
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option || "ALL"}
              type="button"
              variant={status === option ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus(option)}
            >
              {option || "All"}
            </Button>
          ))}
        </div>
      </div>

      {ticketsQuery.isLoading && <Skeleton className="h-52 w-full" />}
      {ticketsQuery.isError && (
        <ErrorState title="Couldn't load support tickets" description="Please try again in a moment." onRetry={() => ticketsQuery.refetch()} />
      )}
      {ticketsQuery.data && tickets.length === 0 && (
        <EmptyState
          icon="warning"
          title="No AI support tickets yet"
          description="When the AI detects a booking, payment, host, property, cancellation, or refund complaint, it will forward the structured record here for Admin."
        />
      )}
      {tickets.length > 0 && (
        <ul className="space-y-3">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="rounded-xl border border-line p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-ink">{ticket.summary}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    User {ticket.userId}
                    {ticket.bookingReferenceId ? ` · Booking ${ticket.bookingReferenceId}` : ""}
                  </p>
                </div>
                <Badge variant={ticket.status === "OPEN" ? "secondary" : "outline"}>{ticket.status}</Badge>
              </div>
              <p className="mt-3 rounded-lg bg-muted p-3 text-sm text-ink-muted">{ticket.sourceMessage}</p>
              <p className="mt-2 text-xs text-ink-muted">{new Date(ticket.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
