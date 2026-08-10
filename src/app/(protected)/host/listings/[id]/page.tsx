"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { UpdatePropertyRequest } from "@havyn/shared";
import { ListingMediaManager } from "@/components/host/listing-media-manager";
import { ErrorState } from "@/components/patterns/error-state";
import { Button, LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { deleteDraftListing, getHostListing, updateHostListing } from "@/lib/api/host";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

export default function EditHostListingPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [form, setForm] = useState<UpdatePropertyRequest>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const listingQuery = useQuery({
    queryKey: ["host", "listing", id],
    queryFn: () => getHostListing(accessToken!, id),
    enabled: Boolean(accessToken),
  });

  useEffect(() => {
    const listing = listingQuery.data;
    if (!listing) return;
    setForm({
      title: listing.title,
      description: listing.description,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      country: listing.country,
      basePrice: listing.basePrice,
      capacity: listing.capacity,
      bedrooms: listing.bedrooms,
      beds: listing.beds,
      bathrooms: listing.bathrooms,
      cleaningFee: listing.cleaningFee,
      serviceFeePct: listing.serviceFeePct,
      houseRules: listing.houseRules,
      cancellationPolicy: listing.cancellationPolicy,
    });
  }, [listingQuery.data]);

  const updateMutation = useMutation({
    mutationFn: () => updateHostListing(accessToken!, id, form),
    onSuccess: () => {
      setServerError(null);
      queryClient.invalidateQueries({ queryKey: ["host", "listing", id] });
      queryClient.invalidateQueries({ queryKey: ["host", "listings"] });
    },
    onError: (error) => setServerError(error instanceof ApiError ? error.message : "Could not save this listing."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteDraftListing(accessToken!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host", "listings"] });
      router.push("/host/listings");
    },
    onError: (error) => setServerError(error instanceof ApiError ? error.message : "Could not delete this draft."),
  });

  if (listingQuery.isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }
  if (listingQuery.isError || !listingQuery.data) {
    return <ErrorState title="Couldn't load this listing" description="Please try again in a moment." onRetry={() => listingQuery.refetch()} />;
  }

  const listing = listingQuery.data;
  const canDelete = listing.status === "DRAFT";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <LinkButton href="/host/listings" variant="ghost" size="sm">
            <Icon name="chevronLeft" size={14} />
            Back to listings
          </LinkButton>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink">Edit listing</h2>
        </div>
        <LinkButton href={`/host/listings/${id}/calendar`} variant="outline">
          <Icon name="calendar" size={16} />
          Calendar
        </LinkButton>
      </div>

      {serverError && (
        <p role="alert" className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      )}

      <form
        className="grid gap-4 lg:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          updateMutation.mutate();
        }}
      >
        <Field label="Title" htmlFor="listing-title">
          <Input id="listing-title" value={form.title ?? ""} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </Field>
        <Field label="Address" htmlFor="listing-address">
          <Input id="listing-address" value={form.address ?? ""} onChange={(event) => setForm({ ...form, address: event.target.value })} />
        </Field>
        <Field label="City" htmlFor="listing-city">
          <Input id="listing-city" value={form.city ?? ""} onChange={(event) => setForm({ ...form, city: event.target.value })} />
        </Field>
        <Field label="State" htmlFor="listing-state">
          <Input id="listing-state" value={form.state ?? ""} onChange={(event) => setForm({ ...form, state: event.target.value })} />
        </Field>
        <Field label="Base price" htmlFor="listing-price">
          <Input id="listing-price" type="number" min={0} value={form.basePrice ?? 0} onChange={(event) => setNumber("basePrice", event.target.value)} />
        </Field>
        <Field label="Guests" htmlFor="listing-capacity">
          <Input id="listing-capacity" type="number" min={1} value={form.capacity ?? 1} onChange={(event) => setNumber("capacity", event.target.value)} />
        </Field>
        <Field label="Bedrooms" htmlFor="listing-bedrooms">
          <Input id="listing-bedrooms" type="number" min={0} value={form.bedrooms ?? 0} onChange={(event) => setNumber("bedrooms", event.target.value)} />
        </Field>
        <Field label="Beds" htmlFor="listing-beds">
          <Input id="listing-beds" type="number" min={0} value={form.beds ?? 0} onChange={(event) => setNumber("beds", event.target.value)} />
        </Field>
        <Field label="Bathrooms" htmlFor="listing-bathrooms">
          <Input id="listing-bathrooms" type="number" min={0} step="0.5" value={form.bathrooms ?? 0} onChange={(event) => setNumber("bathrooms", event.target.value)} />
        </Field>
        <Field label="Cleaning fee" htmlFor="listing-cleaning">
          <Input id="listing-cleaning" type="number" min={0} value={form.cleaningFee ?? 0} onChange={(event) => setNumber("cleaningFee", event.target.value)} />
        </Field>
        <div className="lg:col-span-2">
          <Field label="Description" htmlFor="listing-description">
            <Textarea id="listing-description" rows={4} value={form.description ?? ""} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </Field>
        </div>
        <div className="lg:col-span-2">
          <Field label="House rules" htmlFor="listing-rules">
            <Textarea id="listing-rules" rows={3} value={form.houseRules ?? ""} onChange={(event) => setForm({ ...form, houseRules: event.target.value })} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
          {canDelete && (
            <Button type="button" variant="destructive" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>
              {deleteMutation.isPending ? "Deleting..." : "Delete draft"}
            </Button>
          )}
        </div>
      </form>

      <ListingMediaManager accessToken={accessToken!} propertyId={id} />
    </div>
  );

  function setNumber(key: keyof UpdatePropertyRequest, value: string) {
    setForm({ ...form, [key]: Number(value) });
  }
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
