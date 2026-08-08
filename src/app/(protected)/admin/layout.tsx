import { RequireAuth } from "@/components/auth/require-auth";
import { AdminNav } from "@/components/admin/admin-nav";

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
