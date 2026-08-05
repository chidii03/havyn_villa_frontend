"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PropertySummary } from "@havyn/shared";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { listHostListings, publishListing, reactivateListing, submitListing, suspendListing } from "@/lib/api/host";
import { useAuth } from "@/lib/auth/auth-provider";
import { ApiError } from "@/lib/api/http";
import { formatPrice } from "@/lib/format/currency";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  DRAFT: { label: "Draft", variant: "outline" },
  PENDING: { label: "Pending review", variant: "secondary" },
  ACTIVE: { label: "Live", variant: "default" },
  SUSPENDED: { label: "Suspended", variant: "outline" },
};

export default function HostListingsPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const listingsQuery = useQuery({
    queryKey: ["host", "listings"],
    queryFn: () => listHostListings(accessToken!),
    enabled: Boolean(accessToken),
  });

  const transitionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "submit" | "publish" | "suspend" | "reactivate" }) => {
      const fn = { submit: submitListing, publish: publishListing, suspend: suspendListing, reactivate: reactivateListing }[action];
      return fn(accessToken!, id);
    },
    onSuccess: (_data, variables) => {
      const messages = {
        submit: "Submitted for review",
        publish: "Listing published",
        suspend: "Listing suspended",
        reactivate: "Listing reactivated",
      } as const;
      toast.success(messages[variables.action]);
      queryClient.invalidateQueries({ queryKey: ["host", "listings"] });
      queryClient.invalidateQueries({ queryKey: ["host", "dashboard-summary"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "That didn't work. Please try again.");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">Manage your listings, availability, and pricing.</p>
        <LinkButton href="/host/listings/new">
          <Icon name="plus" size={16} />
          New listing
        </LinkButton>
      </div>

      {listingsQuery.isLoading && <ListingsSkeleton />}

      {listingsQuery.isError && (
        <ErrorState title="Couldn't load your listings" description="Please try again in a moment." onRetry={() => listingsQuery.refetch()} />
      )}

      {listingsQuery.data && listingsQuery.data.data.length === 0 && (
        <EmptyState
          icon="building"
          title="No listings yet"
          description="Create your first listing to start hosting."
          action={{ label: "Create a listing", onClick: () => (window.location.href = "/host/listings/new") }}
        />
      )}

      {listingsQuery.data && listingsQuery.data.data.length > 0 && (
        <ul className="space-y-4">
          {listingsQuery.data.data.map((listing) => (
            <ListingRow
              key={listing.id}
              listing={listing}
              onAction={(action) => transitionMutation.mutate({ id: listing.id, action })}
              pending={transitionMutation.isPending && transitionMutation.variables?.id === listing.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ListingRow({
  listing,
  onAction,
  pending,
}: {
  listing: PropertySummary;
  onAction: (action: "submit" | "publish" | "suspend" | "reactivate") => void;
  pending: boolean;
}) {
  const status = STATUS_LABELS[listing.status] ?? { label: listing.status, variant: "outline" as const };

  return (
    <li className="rounded-xl border border-line p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-ink">{listing.title}</p>
          <p className="text-sm text-ink-muted">
            {listing.city}, {listing.state}
          </p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <p className="mt-3 text-sm text-ink">
        <span className="font-semibold tabular-nums">{formatPrice(listing.basePrice, listing.currency)}</span>
        <span className="text-ink-muted"> / night · {listing.capacity} guests</span>
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <LinkButton href={`/host/listings/${listing.id}/calendar`} variant="outline" size="sm" className="min-h-11">
          <Icon name="calendar" size={14} />
          Calendar
        </LinkButton>

        {listing.status === "DRAFT" && (
          <Button size="sm" className="min-h-11" onClick={() => onAction("submit")} disabled={pending}>
            {pending ? "Submitting…" : "Submit for review"}
          </Button>
        )}
        {listing.status === "PENDING" && (
          <Button size="sm" className="min-h-11" onClick={() => onAction("publish")} disabled={pending}>
            {pending ? "Publishing…" : "Publish"}
          </Button>
        )}
        {listing.status === "ACTIVE" && (
          <Button variant="outline" size="sm" className="min-h-11" onClick={() => onAction("suspend")} disabled={pending}>
            {pending ? "Suspending…" : "Suspend"}
          </Button>
        )}
        {listing.status === "SUSPENDED" && (
          <Button size="sm" className="min-h-11" onClick={() => onAction("reactivate")} disabled={pending}>
            {pending ? "Reactivating…" : "Reactivate"}
          </Button>
        )}
      </div>
    </li>
  );
}

function ListingsSkeleton() {
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
