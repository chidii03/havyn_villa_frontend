"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

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
  roleDeniedTitle = "Access required",
  roleDeniedDescription = "Your account does not have permission to view this page.",
  roleDeniedAction,
}: {
  children: React.ReactNode;
  redirectTo?: string;
  /** If set, also requires this role (e.g. "ADMIN") on top of being authenticated. */
  role?: string;
  roleDeniedTitle?: string;
  roleDeniedDescription?: string;
  roleDeniedAction?: { href: string; label: string };
}) {
  const { status, user } = useAuth();
  const router = useRouter();
  const hasRequiredRole = !role || (user?.roles.includes(role) ?? false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(redirectTo);
    }
  }, [status, redirectTo, router]);

  if (status !== "authenticated") {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-12" aria-busy="true">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!hasRequiredRole) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="rounded-full bg-brand/10 p-4 text-brand" aria-hidden="true">
          <Icon name="shieldCheck" size={32} weight="duotone" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-ink">{roleDeniedTitle}</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink-muted">{roleDeniedDescription}</p>
        {roleDeniedAction ? (
          <LinkButton href={roleDeniedAction.href} className="mt-6">
            {roleDeniedAction.label}
          </LinkButton>
        ) : null}
      </section>
    );
  }

  return <>{children}</>;
}
