"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createPropertySchema, type CreatePropertyInput } from "@havyn/shared";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createHostListing } from "@/lib/api/host";
import { listAmenities, listPropertyTypes } from "@/lib/api/properties";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

/**
 * A single sectioned form, not a multi-step wizard — see backend/02-domain-modules.md's
 * session 18 notes for why: this project has no existing Stepper primitive, and this
 * prompt's acceptance criteria is "host can manage listings," not a bespoke onboarding
 * wizard experience. All 19 CreatePropertyRequest fields are covered.
 */
export default function NewListingPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const typesQuery = useQuery({ queryKey: ["property-types"], queryFn: listPropertyTypes });
  const amenitiesQuery = useQuery({ queryKey: ["amenities"], queryFn: listAmenities });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      typeCode: "",
      title: "",
      description: "",
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
      basePrice: 0,
      capacity: 1,
      bedrooms: 0,
      beds: 0,
      bathrooms: 1,
      amenityCodes: [],
    },
  });

  async function onSubmit(values: CreatePropertyInput) {
    setServerError(null);
    try {
      const listing = await createHostListing(accessToken!, values);
      toast.success("Listing created as a draft");
      router.push(`/host/listings/${listing.id}/calendar`);
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-6" noValidate>
      {serverError && (
        <p role="alert" className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      )}

      <Field label="Property type" htmlFor="listing-type" error={errors.typeCode?.message}>
        <Controller
          name="typeCode"
          control={control}
          render={({ field }) => (
            <Select value={field.value || undefined} onValueChange={field.onChange}>
              <SelectTrigger id="listing-type" className="w-full">
                <SelectValue placeholder="Choose a type" />
              </SelectTrigger>
              <SelectContent>
                {(typesQuery.data ?? []).map((type) => (
                  <SelectItem key={type.code} value={type.code}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field label="Title" htmlFor="listing-title" error={errors.title?.message}>
        <Input id="listing-title" aria-invalid={Boolean(errors.title)} {...register("title")} />
      </Field>

      <Field label="Description" htmlFor="listing-description" error={errors.description?.message}>
        <Textarea id="listing-description" rows={4} aria-invalid={Boolean(errors.description)} {...register("description")} />
      </Field>

      <Field label="Address" htmlFor="listing-address" error={errors.address?.message}>
        <Input id="listing-address" aria-invalid={Boolean(errors.address)} {...register("address")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="City" htmlFor="listing-city" error={errors.city?.message}>
          <Input id="listing-city" aria-invalid={Boolean(errors.city)} {...register("city")} />
        </Field>
        <Field label="State" htmlFor="listing-state" error={errors.state?.message}>
          <Input id="listing-state" aria-invalid={Boolean(errors.state)} {...register("state")} />
        </Field>
        <Field label="Country" htmlFor="listing-country" error={errors.country?.message}>
          <Input id="listing-country" aria-invalid={Boolean(errors.country)} {...register("country")} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Base price (₦/night)" htmlFor="listing-base-price" error={errors.basePrice?.message}>
          <Input id="listing-base-price" type="number" min={0} step="1" aria-invalid={Boolean(errors.basePrice)} {...register("basePrice")} />
        </Field>
        <Field label="Guests" htmlFor="listing-capacity" error={errors.capacity?.message}>
          <Input id="listing-capacity" type="number" min={1} step="1" aria-invalid={Boolean(errors.capacity)} {...register("capacity")} />
        </Field>
        <Field label="Bedrooms" htmlFor="listing-bedrooms" error={errors.bedrooms?.message}>
          <Input id="listing-bedrooms" type="number" min={0} step="1" aria-invalid={Boolean(errors.bedrooms)} {...register("bedrooms")} />
        </Field>
        <Field label="Beds" htmlFor="listing-beds" error={errors.beds?.message}>
          <Input id="listing-beds" type="number" min={0} step="1" aria-invalid={Boolean(errors.beds)} {...register("beds")} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field label="Bathrooms" htmlFor="listing-bathrooms" error={errors.bathrooms?.message}>
          <Input id="listing-bathrooms" type="number" min={0} step="0.5" aria-invalid={Boolean(errors.bathrooms)} {...register("bathrooms")} />
        </Field>
        <Field label="Cleaning fee (₦, optional)" htmlFor="listing-cleaning-fee" error={errors.cleaningFee?.message}>
          <Input id="listing-cleaning-fee" type="number" min={0} step="1" {...register("cleaningFee")} />
        </Field>
        <Field label="Service fee % (optional)" htmlFor="listing-service-fee" error={errors.serviceFeePct?.message}>
          <Input id="listing-service-fee" type="number" min={0} max={100} step="0.1" {...register("serviceFeePct")} />
        </Field>
      </div>

      <Field label="House rules (optional)" htmlFor="listing-house-rules" error={errors.houseRules?.message}>
        <Textarea id="listing-house-rules" rows={3} {...register("houseRules")} />
      </Field>

      <div>
        <p className="text-sm font-medium text-ink">Amenities</p>
        <Controller
          name="amenityCodes"
          control={control}
          render={({ field }) => (
            <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {(amenitiesQuery.data ?? []).map((amenity) => {
                const selected = new Set(field.value ?? []);
                return (
                  <label key={amenity.code} className="flex items-center gap-2 text-sm text-ink">
                    <Checkbox
                      checked={selected.has(amenity.code)}
                      onCheckedChange={(checked) => {
                        const next = new Set(selected);
                        if (checked === true) next.add(amenity.code);
                        else next.delete(amenity.code);
                        field.onChange(Array.from(next));
                      }}
                    />
                    {amenity.name}
                  </label>
                );
              })}
            </div>
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start px-6">
        {isSubmitting ? "Creating…" : "Create listing"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
