import { RequireAuth } from "@/components/auth/require-auth";
import { HostNav } from "@/components/host/host-nav";

/**
 * Adds a HOST role check on top of the (protected) group's base auth guard — mirrors
 * admin/layout.tsx's pattern exactly. A signed-in non-host is bounced to
 * /become-a-host (not the generic "/" default) since that's the actual next step for
 * them, not a dead end. Shared chrome (the section nav) lives here, unlike
 * trips/admin's single-page routes, since /host is a multi-page section.
 */
export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth
      role="HOST"
      roleDeniedTitle="Host access required"
      roleDeniedDescription="You are signed in, but this account is not a host account yet. Become a host to manage listings, reservations, and earnings."
      roleDeniedAction={{ href: "/become-a-host", label: "Become a host" }}
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Host dashboard</h1>
        <div className="mt-6">
          <HostNav />
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </RequireAuth>
  );
}
