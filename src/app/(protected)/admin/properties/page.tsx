"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { PropertySummary } from "@havyn/shared";
import { ModerationReasonDialog } from "@/components/admin/moderation-reason-dialog";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listAdminProperties, reactivateProperty, rejectProperty, suspendProperty } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/http";
import { formatPrice } from "@/lib/format/currency";
import { useAuth } from "@/lib/auth/auth-provider";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  DRAFT: { label: "Draft", variant: "outline" },
  PENDING: { label: "Pending review", variant: "secondary" },
  ACTIVE: { label: "Live", variant: "default" },
  SUSPENDED: { label: "Suspended", variant: "outline" },
};

export default function AdminPropertiesPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<{ propertyId: string; action: "suspend" | "reject" } | null>(null);

  const propertiesQuery = useQuery({
    queryKey: ["admin", "properties"],
    queryFn: () => listAdminProperties(accessToken!),
    enabled: Boolean(accessToken),
  });

  const moderateMutation = useMutation({
    mutationFn: ({ propertyId, action, reason }: { propertyId: string; action: "suspend" | "reject"; reason: string }) =>
      action === "suspend" ? suspendProperty(accessToken!, propertyId, reason) : rejectProperty(accessToken!, propertyId, reason),
    onSuccess: (_data, variables) => {
      toast.success(variables.action === "suspend" ? "Listing suspended" : "Listing rejected");
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
      setDialog(null);
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "That didn't work. Please try again."),
  });

  const reactivateMutation = useMutation({
    mutationFn: (propertyId: string) => reactivateProperty(accessToken!, propertyId),
    onSuccess: () => {
      toast.success("Listing is live");
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "That didn't work. Please try again."),
  });

  return (
    <div className="flex flex-col gap-6">
      {propertiesQuery.isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      )}

      {propertiesQuery.isError && (
        <ErrorState title="Couldn't load listings" description="Please try again in a moment." onRetry={() => propertiesQuery.refetch()} />
      )}

      {propertiesQuery.data && propertiesQuery.data.data.length === 0 && (
        <EmptyState icon="building" title="No listings yet" description="Listings will appear here once hosts create them." />
      )}

      {propertiesQuery.data && propertiesQuery.data.data.length > 0 && (
        <ul className="space-y-3">
          {propertiesQuery.data.data.map((property) => (
            <PropertyRow
              key={property.id}
              property={property}
              pending={reactivateMutation.isPending && reactivateMutation.variables === property.id}
              onAction={(action) => setDialog({ propertyId: property.id, action })}
              onReactivate={() => reactivateMutation.mutate(property.id)}
            />
          ))}
        </ul>
      )}

      <ModerationReasonDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        title={dialog?.action === "suspend" ? "Suspend this listing?" : "Reject this listing?"}
        description={
          dialog?.action === "suspend"
            ? "The listing will no longer be bookable. The host can see why in their dashboard."
            : "The listing goes back to draft so the host can fix it and resubmit."
        }
        confirmLabel={dialog?.action === "suspend" ? "Suspend" : "Reject"}
        pending={moderateMutation.isPending}
        onConfirm={(reason) => dialog && moderateMutation.mutate({ propertyId: dialog.propertyId, action: dialog.action, reason })}
      />
    </div>
  );
}

function PropertyRow({
  property,
  pending,
  onAction,
  onReactivate,
}: {
  property: PropertySummary;
  pending: boolean;
  onAction: (action: "suspend" | "reject") => void;
  onReactivate: () => void;
}) {
  const status = STATUS_LABELS[property.status] ?? { label: property.status, variant: "outline" as const };

  return (
    <li className="rounded-xl border border-line p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-ink">{property.title}</p>
          <p className="text-sm text-ink-muted">
            {property.city}, {property.state}
          </p>
        </div>
        {property.status === "SUSPENDED" ? (
          <button
            type="button"
            className="rounded-2xl"
            aria-label="Switch listing to live"
            onClick={onReactivate}
            disabled={pending}
          >
            <Badge variant="outline" className="rounded-2xl">
              {pending ? "Switching..." : "Live"}
            </Badge>
          </button>
        ) : (
          <Badge variant={status.variant} className="rounded-2xl">
            {status.label}
          </Badge>
        )}
      </div>

      <p className="mt-2 text-sm text-ink">
        <span className="font-semibold tabular-nums">{formatPrice(property.basePrice, property.currency)}</span>
        <span className="text-ink-muted"> / night</span>
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {property.status === "ACTIVE" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 min-h-9 rounded-2xl px-4"
            onClick={() => onAction("suspend")}
          >
            Suspend
          </Button>
        )}
        {property.status === "PENDING" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 min-h-9 rounded-2xl px-4"
            onClick={() => onAction("reject")}
          >
            Reject
          </Button>
        )}
        {property.status === "SUSPENDED" && (
          <Button
            type="button"
            size="sm"
            className="h-9 min-h-9 rounded-2xl px-4"
            onClick={onReactivate}
            disabled={pending}
          >
            {pending ? "Switching..." : "Live"}
          </Button>
        )}
      </div>
    </li>
  );
}