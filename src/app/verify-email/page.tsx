import Link from "next/link";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Icon } from "@/components/ui/icon";
import * as authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api/http";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  let outcome: "success" | "error" = "error";
  let message = "This verification link is missing its token.";

  if (token) {
    try {
      await authApi.verifyEmail(token);
      outcome = "success";
      message = "Your email is verified.";
    } catch (error) {
      message = error instanceof ApiError ? error.message : "This verification link is invalid or has expired.";
    }
  }

  return (
    <AuthPageShell
      title="Email verification"
      footer={
        <Link href="/login" className="font-medium text-brand hover:underline">
          Go to log in
        </Link>
      }
    >
      {outcome === "success" ? (
        <p className="flex items-center gap-2 text-sm text-success">
          <Icon name="checkCircle" size={16} weight="fill" className="text-success" /> {message}
        </p>
      ) : (
        <p role="alert" className="flex items-center gap-2 text-sm text-danger">
          <Icon name="xCircle" size={16} weight="fill" className="text-danger" /> {message}
        </p>
      )}
    </AuthPageShell>
  );
}
