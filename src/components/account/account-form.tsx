"use client";

import { updateMeSchema, type UpdateMeInput } from "@havyn/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

/** The one genuinely functional protected page in this pass — GET/PATCH /me already exist. */
export function AccountForm() {
  const { user, accessToken, refreshUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateMeInput>({
    resolver: zodResolver(updateMeSchema),
    defaultValues: { fullName: user?.fullName ?? "", phone: user?.phone ?? "" },
  });

  if (!user || !accessToken) {
    return null;
  }

  async function onSubmit(values: UpdateMeInput) {
    setServerError(null);
    try {
      await authApi.updateMe(accessToken!, values);
      await refreshUser();
      toast.success("Profile updated.");
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-sm text-ink-muted">Email</p>
          <p className="font-medium text-ink">{user.email}</p>
        </div>
        <Badge variant={user.emailVerified ? "default" : "outline"}>
          {user.emailVerified ? "Verified" : "Not verified"}
        </Badge>
        {user.roles.map((role) => (
          <Badge key={role} variant="outline">
            {role}
          </Badge>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {serverError && (
          <p role="alert" className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
            {serverError}
          </p>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="account-fullname">Full name</Label>
          <Input id="account-fullname" aria-invalid={Boolean(errors.fullName)} {...register("fullName")} />
          {errors.fullName && <p className="text-xs text-danger">{errors.fullName.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="account-phone">Phone</Label>
          <Input id="account-phone" type="tel" aria-invalid={Boolean(errors.phone)} {...register("phone")} />
          {errors.phone && <p className="text-xs text-danger">{errors.phone.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting || !isDirty} className="self-start">
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
