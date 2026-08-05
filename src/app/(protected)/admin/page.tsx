"use client";

import { useQuery } from "@tanstack/react-query";
import type { IconName } from "@/components/ui/icon-registry";
import { ErrorState } from "@/components/patterns/error-state";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnalyticsSummary } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/auth-provider";
import { formatPrice } from "@/lib/format/currency";

/** Every figure here comes straight from GET /admin/analytics/summary — no client-side arithmetic. */
export default function AdminDashboardPage() {
  const { accessToken } = useAuth();

  const summaryQuery = useQuery({
    queryKey: ["admin", "analytics-summary"],
    queryFn: () => getAnalyticsSummary(accessToken!),
    enabled: Boolean(accessToken),
  });

  if (summaryQuery.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="rounded-xl border border-line p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-7 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return (
      <ErrorState title="Couldn't load platform analytics" description="Please try again in a moment." onRetry={() => summaryQuery.refetch()} />
    );
  }

  const summary = summaryQuery.data;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon="user" label="Users" value={String(summary.totalUsers)} hint={`${summary.totalHosts} hosts`} />
      <StatCard icon="building" label="Listings" value={String(summary.totalProperties)} hint={`${summary.activeProperties} active`} />
      <StatCard
        icon="calendarCheck"
        label="Bookings"
        value={String(summary.totalBookings)}
        hint={`${summary.confirmedOrCompletedBookings} confirmed/completed`}
      />
      <StatCard icon="wallet" label="Gross revenue" value={formatPrice(summary.grossRevenue, "NGN")} />
      <StatCard icon="wallet" label="Commission collected" value={formatPrice(summary.commissionCollected, "NGN")} />
      <StatCard
        icon="shieldCheck"
        label="Pending KYC"
        value={String(summary.pendingVerificationRequests)}
        hint={summary.pendingVerificationRequests > 0 ? "Needs review" : undefined}
      />
      <StatCard
        icon="warning"
        label="Open disputes"
        value={String(summary.openDisputes)}
        hint={summary.openDisputes > 0 ? "Needs attention" : undefined}
      />
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
