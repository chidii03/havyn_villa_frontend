"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { VerificationRequestSummary } from "@havyn/shared";
import { ModerationReasonDialog } from "@/components/admin/moderation-reason-dialog";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { approveVerificationRequest, listPendingVerificationRequests, rejectVerificationRequest } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

export default function AdminVerificationRequestsPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const requestsQuery = useQuery({
    queryKey: ["admin", "verification-requests"],
    queryFn: () => listPendingVerificationRequests(accessToken!),
    enabled: Boolean(accessToken),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "verification-requests"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "analytics-summary"] });
  }

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveVerificationRequest(accessToken!, id),
    onSuccess: () => {
      toast.success("Verification approved");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Couldn't approve this request."),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectVerificationRequest(accessToken!, id, reason),
    onSuccess: () => {
      toast.success("Verification rejected");
      invalidate();
      setRejectingId(null);
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Couldn't reject this request."),
  });

  return (
    <div className="flex flex-col gap-6">
      {requestsQuery.isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      )}

      {requestsQuery.isError && (
        <ErrorState title="Couldn't load verification requests" description="Please try again in a moment." onRetry={() => requestsQuery.refetch()} />
      )}

      {requestsQuery.data && requestsQuery.data.data.length === 0 && (
        <EmptyState icon="shieldCheck" title="No pending verification requests" description="Host ID submissions awaiting review will appear here." />
      )}

      {requestsQuery.data && requestsQuery.data.data.length > 0 && (
        <ul className="space-y-3">
          {requestsQuery.data.data.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              onApprove={() => approveMutation.mutate(request.id)}
              onReject={() => setRejectingId(request.id)}
              busy={approveMutation.isPending && approveMutation.variables === request.id}
            />
          ))}
        </ul>
      )}

      <ModerationReasonDialog
        open={rejectingId !== null}
        onOpenChange={(open) => !open && setRejectingId(null)}
        title="Reject this verification request?"
        description="The host will be able to submit a new request."
        confirmLabel="Reject"
        pending={rejectMutation.isPending}
        onConfirm={(reason) => rejectingId && rejectMutation.mutate({ id: rejectingId, reason })}
      />
    </div>
  );
}

function RequestRow({
  request,
  onApprove,
  onReject,
  busy,
}: {
  request: VerificationRequestSummary;
  onApprove: () => void;
  onReject: () => void;
  busy: boolean;
}) {
  return (
    <li className="rounded-xl border border-line p-4">
      <p className="font-medium text-ink">User {request.userId}</p>
      <a href={request.documentUrl} target="_blank" rel="noreferrer" className="text-sm text-brand hover:underline">
        View submitted document
      </a>
      {request.notes && <p className="mt-1 text-sm text-ink-muted">{request.notes}</p>}

      <div className="mt-3 flex gap-2">
        <Button type="button" size="sm" className="min-h-11" onClick={onApprove} disabled={busy}>
          {busy ? "Approving…" : "Approve"}
        </Button>
        <Button type="button" variant="outline" size="sm" className="min-h-11" onClick={onReject}>
          Reject
        </Button>
      </div>
    </li>
  );
}
