"use client";

import { registerSchema, type RegisterInput } from "@havyn/shared";
import { zodResolver } from "@hookform/resolvers/zod";
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

export function SignupForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);

    try {
      await registerUser(
        values.email,
        values.password,
        values.fullName
      );

      toast.success(
        "Welcome to Havyn Villa! Check your email to verify your account."
      );

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

        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-name">Full name</Label>

          <Input
            id="signup-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName")}
          />

          {errors.fullName && (
            <p className="text-xs text-danger">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">Email</Label>

          <Input
            id="signup-email"
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
          <Label htmlFor="signup-password">Password</Label>

          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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

          {errors.password ? (
            <p className="text-xs text-danger">
              {errors.password.message}
            </p>
          ) : (
            <p className="text-xs text-ink-muted">
              At least 8 characters.
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2"
        >
          {isSubmitting ? "Creating account…" : "Sign up"}
        </Button>
      </form>

      <GoogleSignInButton />
    </div>
  );
}