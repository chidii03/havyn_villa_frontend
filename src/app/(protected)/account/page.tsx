import { AccountForm } from "@/components/account/account-form";

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink">Account</h1>
      <p className="mt-1 text-sm text-ink-muted">Profile and security. Payment methods and notifications land later.</p>
      <div className="mt-8">
        <AccountForm />
      </div>
    </div>
  );
}
