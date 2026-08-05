"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The authoritative client-side auth guard — see require-session-cookie.ts for why
 * this can't be done purely on the server. Renders nothing (well, a loading skeleton)
 * until AuthProvider's silent refresh resolves, then either renders children or
 * redirects.
 */
export function RequireAuth({
  children,
  redirectTo = "/login",
  role,
  roleRedirectTo = "/",
}: {
  children: React.ReactNode;
  redirectTo?: string;
  /** If set, also requires this role (e.g. "ADMIN") on top of being authenticated. */
  role?: string;
  roleRedirectTo?: string;
}) {
  const { status, user } = useAuth();
  const router = useRouter();
  const hasRequiredRole = !role || (user?.roles.includes(role) ?? false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(redirectTo);
    } else if (status === "authenticated" && !hasRequiredRole) {
      router.replace(roleRedirectTo);
    }
  }, [status, hasRequiredRole, redirectTo, roleRedirectTo, router]);

  if (status !== "authenticated" || !hasRequiredRole) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-12" aria-busy="true">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
