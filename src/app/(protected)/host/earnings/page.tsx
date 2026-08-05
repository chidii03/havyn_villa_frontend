"use client";

import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardSummary, listPayouts } from "@/lib/api/host";
import { useAuth } from "@/lib/auth/auth-provider";
import { formatPrice } from "@/lib/format/currency";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  PENDING: { label: "Pending", variant: "secondary" },
  PAID: { label: "Paid", variant: "default" },
  FAILED: { label: "Failed", variant: "outline" },
};

/**
 * "Pending" is the honest status for every payout shown here today — there's no
 * live payout-execution rail yet (see backend/02-domain-modules.md's session 7
 * notes), so this page never claims money has actually moved, only that it's
 * accrued and owed.
 */
export default function HostEarningsPage() {
  const { accessToken } = useAuth();

  const summaryQuery = useQuery({
    queryKey: ["host", "dashboard-summary"],
    queryFn: () => getDashboardSummary(accessToken!),
    enabled: Boolean(accessToken),
  });
  const payoutsQuery = useQuery({
    queryKey: ["host", "payouts"],
    queryFn: () => listPayouts(accessToken!),
    enabled: Boolean(accessToken),
  });

  if (summaryQuery.isLoading || payoutsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full max-w-sm" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (summaryQuery.isError || payoutsQuery.isError) {
    return (
      <ErrorState
        title="Couldn't load your earnings"
        description="Please try again in a moment."
        onRetry={() => {
          summaryQuery.refetch();
          payoutsQuery.refetch();
        }}
      />
    );
  }

  const totalEarnings = summaryQuery.data?.totalEarnings ?? [];
  const payouts = payoutsQuery.data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-sm text-ink-muted">Total earnings accrued</p>
        <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink">
          {totalEarnings.length > 0 ? totalEarnings.map((entry) => formatPrice(entry.amount, entry.currency)).join(" · ") : formatPrice(0, "NGN")}
        </p>
      </div>

      {payouts.length === 0 ? (
        <EmptyState
          icon="wallet"
          title="No payouts yet"
          description="Earnings accrue here once a guest's payment for one of your stays is confirmed."
        />
      ) : (
        <ul className="space-y-3">
          {payouts.map((payout) => {
            const status = STATUS_LABELS[payout.status] ?? { label: payout.status, variant: "outline" as const };
            return (
              <li key={payout.id} className="flex items-center justify-between rounded-xl border border-line p-4">
                <div>
                  <p className="font-medium text-ink">{payout.period}</p>
                  <p className="text-sm text-ink-muted">Payouts are accrued, not yet disbursed — see status.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold tabular-nums text-ink">{formatPrice(payout.amount, payout.currency)}</span>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
