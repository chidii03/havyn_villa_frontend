"use client";

import { loginSchema, type LoginInput } from "@havyn/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setServerError(null);

    try {
      await login(values.email, values.password);

      toast.success("Welcome back!");

      router.push("/");
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        {serverError && (
          <p
            role="alert"
            className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            {serverError}
          </p>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email</Label>

          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />

          {errors.email && (
            <p className="text-xs text-danger">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              className="pr-11"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="
                absolute
                right-0
                top-0
                flex
                h-full
                w-11
                items-center
                justify-center
                text-ink-muted
                transition-colors
                hover:text-foreground
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand
                focus-visible:ring-offset-1
              "
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-danger">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2"
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <GoogleSignInButton />
    </div>
  );
}