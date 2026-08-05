"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { AdminUserSummary } from "@havyn/shared";
import { EmptyState } from "@/components/patterns/empty-state";
import { ErrorState } from "@/components/patterns/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { grantRole, listAdminUsers, reactivateUser, revokeRole, suspendUser } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/auth-provider";
import { ApiError } from "@/lib/api/http";

const GRANTABLE_ROLES = ["HOST", "ADMIN"] as const;

export default function AdminUsersPage() {
  const { accessToken, user: me } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");

  const usersQuery = useQuery({
    queryKey: ["admin", "users", email],
    queryFn: () => listAdminUsers(accessToken!, email),
    enabled: Boolean(accessToken),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  const roleMutation = useMutation({
    mutationFn: ({ userId, roleCode, grant }: { userId: string; roleCode: string; grant: boolean }) =>
      grant ? grantRole(accessToken!, userId, roleCode) : revokeRole(accessToken!, userId, roleCode),
    onSuccess: () => {
      toast.success("Role updated");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Couldn't update that role."),
  });

  const statusMutation = useMutation({
    mutationFn: ({ userId, suspend }: { userId: string; suspend: boolean }) =>
      suspend ? suspendUser(accessToken!, userId) : reactivateUser(accessToken!, userId),
    onSuccess: () => {
      toast.success("Account status updated");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Couldn't update that account."),
  });

  return (
    <div className="flex flex-col gap-6">
      <Input
        placeholder="Search by email…"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="max-w-sm"
        aria-label="Search users by email"
      />

      {usersQuery.isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      )}

      {usersQuery.isError && (
        <ErrorState title="Couldn't load users" description="Please try again in a moment." onRetry={() => usersQuery.refetch()} />
      )}

      {usersQuery.data && usersQuery.data.data.length === 0 && <EmptyState icon="user" title="No users found" description="Try a different search." />}

      {usersQuery.data && usersQuery.data.data.length > 0 && (
        <ul className="space-y-3">
          {usersQuery.data.data.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelf={user.id === me?.id}
              onToggleRole={(roleCode, grant) => roleMutation.mutate({ userId: user.id, roleCode, grant })}
              onToggleStatus={(suspend) => statusMutation.mutate({ userId: user.id, suspend })}
              busy={
                (roleMutation.isPending && roleMutation.variables?.userId === user.id) ||
                (statusMutation.isPending && statusMutation.variables?.userId === user.id)
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function UserRow({
  user,
  isSelf,
  onToggleRole,
  onToggleStatus,
  busy,
}: {
  user: AdminUserSummary;
  isSelf: boolean;
  onToggleRole: (roleCode: string, grant: boolean) => void;
  onToggleStatus: (suspend: boolean) => void;
  busy: boolean;
}) {
  return (
    <li className="rounded-xl border border-line p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-ink">{user.fullName ?? user.email}</p>
          <p className="text-sm text-ink-muted">{user.email}</p>
        </div>
        <Badge variant={user.status === "ACTIVE" ? "default" : "outline"}>{user.status}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {GRANTABLE_ROLES.map((roleCode) => {
          const has = user.roles.includes(roleCode);
          const disallowRevoke = isSelf && roleCode === "ADMIN" && has;
          return (
            <Button
              key={roleCode}
              type="button"
              size="sm"
              variant={has ? "default" : "outline"}
              className="min-h-11"
              disabled={busy || disallowRevoke}
              onClick={() => onToggleRole(roleCode, !has)}
              title={disallowRevoke ? "You cannot revoke your own admin role" : undefined}
            >
              {has ? `Revoke ${roleCode}` : `Grant ${roleCode}`}
            </Button>
          );
        })}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="min-h-11"
          disabled={busy}
          onClick={() => onToggleStatus(user.status === "ACTIVE")}
        >
          {user.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
        </Button>
      </div>
    </li>
  );
}
