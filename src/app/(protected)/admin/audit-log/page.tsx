"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { listAuditLog } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/auth-provider";

/** The queryable audit trail every sensitive admin action writes to — see project-docs/prompts/18-admin-platform.md. */
export default function AdminAuditLogPage() {
  const { accessToken } = useAuth();

  const auditQuery = useQuery({
    queryKey: ["admin", "audit-log"],
    queryFn: () => listAuditLog(accessToken!, 0, 50),
    enabled: Boolean(accessToken),
  });

  if (auditQuery.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (auditQuery.isError) {
    return <ErrorState title="Couldn't load the audit log" description="Please try again in a moment." onRetry={() => auditQuery.refetch()} />;
  }

  const entries = auditQuery.data?.data ?? [];

  if (entries.length === 0) {
    return <EmptyState icon="shieldCheck" title="No audit entries yet" description="Sensitive admin actions will be recorded here." />;
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li key={entry.id} className="rounded-xl border border-line p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-ink">{entry.action}</p>
            <p className="text-xs text-ink-muted">{format(new Date(entry.createdAt), "MMM d, yyyy h:mm a")}</p>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            {entry.targetType}
            {entry.targetId ? ` ${entry.targetId}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
