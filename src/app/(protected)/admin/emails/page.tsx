"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { listBookingEmailLogs } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/auth-provider";

const STATUS_OPTIONS = ["", "ATTEMPTED", "SUCCESSFUL", "FAILED"] as const;

interface EmailLog {
  id: string;
  bookingReferenceId?: string | null;
  bookingId?: string | null;
  recipientEmail: string;
  status: "ATTEMPTED" | "SUCCESSFUL" | "FAILED" | string;
  retryAttempts: number;
  failureReason?: string | null;
  createdAt: string;
}

interface EmailsResponse {
  logs: { data: EmailLog[] };
  totalAttempted?: number;
  totalSuccessful?: number;
  totalFailed?: number;
}

export default function AdminEmailsPage() {
  const { accessToken } = useAuth();
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("");
  const [search, setSearch] = useState("");

  const emailsQuery = useQuery<EmailsResponse, Error>({
    queryKey: ["admin", "emails", status, search],
    queryFn: () => listBookingEmailLogs(accessToken!, status, search),
    enabled: Boolean(accessToken),
  });

  const logs: EmailLog[] = emailsQuery.data?.logs.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Attempted" value={emailsQuery.data?.totalAttempted} />
        <Stat label="Successful" value={emailsQuery.data?.totalSuccessful} />
        <Stat label="Failed" value={emailsQuery.data?.totalFailed} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search reference ID or recipient email"
          aria-label="Search email logs"
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

      {emailsQuery.isLoading && <Skeleton className="h-52 w-full" />}
      {emailsQuery.isError && <ErrorState title="Couldn't load email logs" description="Please try again in a moment." onRetry={() => emailsQuery.refetch()} />}
      {emailsQuery.data && logs.length === 0 && (
        <EmptyState
          icon="shieldCheck"
          title="No booking email logs yet"
          description="Successful paid bookings will create confirmation email logs here with reference IDs, recipient emails, send status, and retry details."
        />
      )}
      {logs.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-muted text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Recipient</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Retries</th>
                <th className="px-4 py-3 font-medium">Failure</th>
                <th className="px-4 py-3 font-medium">Attempted</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: EmailLog) => (
                <tr key={log.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{log.bookingReferenceId ?? log.bookingId}</td>
                  <td className="px-4 py-3 text-ink-muted">{log.recipientEmail}</td>
                  <td className="px-4 py-3">
                    <Badge variant={log.status === "SUCCESSFUL" ? "default" : log.status === "FAILED" ? "outline" : "secondary"}>{log.status}</Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-ink-muted">{log.retryAttempts}</td>
                  <td className="px-4 py-3 text-ink-muted">{log.failureReason ?? "-"}</td>
                  <td className="px-4 py-3 text-ink-muted">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-xl border border-line p-4">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">{value ?? 0}</p>
    </div>
  );
}
