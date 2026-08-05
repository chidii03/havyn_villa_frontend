"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { IconName } from "@/components/ui/icon-registry";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardSummary } from "@/lib/api/host";
import { useAuth } from "@/lib/auth/auth-provider";
import { formatPrice } from "@/lib/format/currency";

/**
 * Every figure here comes straight from GET /host/dashboard/summary — no client-side
 * arithmetic on money, per project-docs/prompts/17-host-dashboard.md's "No business
 * math on the frontend" constraint.
 */
export default function HostDashboardPage() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const summaryQuery = useQuery({
    queryKey: ["host", "dashboard-summary"],
    queryFn: () => getDashboardSummary(accessToken!),
    enabled: Boolean(accessToken),
  });

  if (summaryQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (summaryQuery.isError) {
    return (
      <ErrorState title="Couldn't load your dashboard" description="Please try again in a moment." onRetry={() => summaryQuery.refetch()} />
    );
  }

  const summary = summaryQuery.data;
  if (!summary) {
    return null;
  }

  if (summary.totalListingsCount === 0) {
    return (
      <EmptyState
        icon="building"
        title="Create your first listing"
        description="Once it's published, you'll see reservations, earnings, and payouts here."
        action={{ label: "Create a listing", onClick: () => router.push("/host/listings/new") }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="building"
          label="Active listings"
          value={String(summary.activeListingsCount)}
          hint={`${summary.totalListingsCount} total`}
        />
        <StatCard icon="calendarCheck" label="Upcoming reservations" value={String(summary.upcomingReservationsCount)} />
        <StatCard
          icon="wallet"
          label="Total earnings"
          value={
            summary.totalEarnings.length > 0
              ? summary.totalEarnings.map((entry) => formatPrice(entry.amount, entry.currency)).join(" · ")
              : formatPrice(0, "NGN")
          }
          hint={`${summary.pendingPayoutsCount} payout${summary.pendingPayoutsCount === 1 ? "" : "s"} pending`}
        />
        <StatCard
          icon="star"
          label="Average rating"
          value={summary.averageRating.toFixed(2)}
          hint={summary.averageRating === 0 ? "No reviews yet" : undefined}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <LinkButton href="/host/listings">Manage listings</LinkButton>
        <LinkButton href="/host/reservations" variant="outline">
          View reservations
        </LinkButton>
        <LinkButton href="/host/earnings" variant="outline">
          View earnings
        </LinkButton>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, hint }: { icon: IconName; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-center gap-2 text-ink-muted">
        <Icon name={icon} size={16} />
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="rounded-xl border border-line p-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-7 w-16" />
        </div>
      ))}
    </div>
  );
}
