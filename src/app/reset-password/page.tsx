import Link from "next/link";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

/** Landing target for the link SmtpMailer.sendPasswordReset emails — see apps/api. */
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <AuthPageShell
      title="Choose a new password"
      footer={
        <Link href="/login" className="font-medium text-brand hover:underline">
          Back to log in
        </Link>
      }
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p role="alert" className="text-sm text-danger">
          This reset link is missing its token. Request a new one from the{" "}
          <Link href="/forgot-password" className="font-medium underline">
            forgot password
          </Link>{" "}
          page.
        </p>
      )}
    </AuthPageShell>
  );
}
