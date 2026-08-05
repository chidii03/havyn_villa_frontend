import { RequireAuth } from "@/components/auth/require-auth";
import { AdminNav } from "@/components/admin/admin-nav";

/**
 * Adds an ADMIN role check on top of the (protected) group's base auth guard. No
 * self-serve path to ADMIN exists anywhere in this product (by design — granting it
 * is itself an admin-only action, see admin.service.AdminUserService; the very first
 * admin is an ops/deployment concern, not something a web app should self-serve) —
 * this is real, testable RBAC wiring, same as host/layout.tsx's pattern. Shared
 * chrome (the section nav) lives here since /admin is a multi-page section, same
 * reasoning as host/layout.tsx.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth
      role="ADMIN"
      roleDeniedTitle="Admin access required"
      roleDeniedDescription="You are signed in, but this account is not an admin account. Use an account with the ADMIN role to view the admin dashboard."
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Admin</h1>
        <div className="mt-6">
          <AdminNav />
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </RequireAuth>
  );
}
