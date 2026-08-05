"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { DisputeSummary } from "@havyn/shared";
import { ModerationReasonDialog } from "@/components/admin/moderation-reason-dialog";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dismissDispute, listOpenDisputes, resolveDispute } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

export default function AdminDisputesPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<{ disputeId: string; action: "resolve" | "dismiss" } | null>(null);

  const disputesQuery = useQuery({
    queryKey: ["admin", "disputes"],
    queryFn: () => listOpenDisputes(accessToken!),
    enabled: Boolean(accessToken),
  });

  const mutation = useMutation({
    mutationFn: ({ disputeId, action, reason }: { disputeId: string; action: "resolve" | "dismiss"; reason: string }) =>
      action === "resolve" ? resolveDispute(accessToken!, disputeId, reason) : dismissDispute(accessToken!, disputeId, reason),
    onSuccess: (_data, variables) => {
      toast.success(variables.action === "resolve" ? "Dispute resolved" : "Dispute dismissed");
      queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics-summary"] });
      setDialog(null);
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "That didn't work. Please try again."),
  });

  return (
    <div className="flex flex-col gap-6">
      {disputesQuery.isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      )}

      {disputesQuery.isError && (
        <ErrorState title="Couldn't load disputes" description="Please try again in a moment." onRetry={() => disputesQuery.refetch()} />
      )}

      {disputesQuery.data && disputesQuery.data.data.length === 0 && (
        <EmptyState icon="warning" title="No open disputes" description="Disputes raised by guests or hosts on a booking will appear here." />
      )}

      {disputesQuery.data && disputesQuery.data.data.length > 0 && (
        <ul className="space-y-3">
          {disputesQuery.data.data.map((dispute) => (
            <DisputeRow key={dispute.id} dispute={dispute} onAction={(action) => setDialog({ disputeId: dispute.id, action })} />
          ))}
        </ul>
      )}

      <ModerationReasonDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        title={dialog?.action === "resolve" ? "Resolve this dispute?" : "Dismiss this dispute?"}
        description="Both the guest and host can see this note."
        confirmLabel={dialog?.action === "resolve" ? "Resolve" : "Dismiss"}
        pending={mutation.isPending}
        onConfirm={(reason) => dialog && mutation.mutate({ disputeId: dialog.disputeId, action: dialog.action, reason })}
      />
    </div>
  );
}

function DisputeRow({ dispute, onAction }: { dispute: DisputeSummary; onAction: (action: "resolve" | "dismiss") => void }) {
  return (
    <li className="rounded-xl border border-line p-4">
      <p className="text-sm text-ink-muted">Booking {dispute.bookingId}</p>
      <p className="mt-1 text-ink">{dispute.reason}</p>

      <div className="mt-3 flex gap-2">
        <Button type="button" size="sm" className="min-h-11" onClick={() => onAction("resolve")}>
          Resolve
        </Button>
        <Button type="button" variant="outline" size="sm" className="min-h-11" onClick={() => onAction("dismiss")}>
          Dismiss
        </Button>
      </div>
    </li>
  );
}
