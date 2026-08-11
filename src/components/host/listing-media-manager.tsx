"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropertyMediaSummary} from "@havyn/shared";
import {
  addListingMedia,
  createMediaSignature,
  deleteListingMedia,
  listListingMedia,
  reorderListingMedia,
  updateListingMedia,
} from "@/lib/api/host";
import { ApiError } from "@/lib/api/http";



export function ListingMediaManager({ accessToken, propertyId }: { accessToken: string; propertyId: string }) {
  const queryClient = useQueryClient();
  const mediaQuery = useQuery({
    queryKey: ["host", "listing", propertyId, "media"],
    queryFn: () => listListingMedia(accessToken, propertyId),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadToCloudinary(accessToken, propertyId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host", "listing", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["host", "listing", propertyId, "media"] });
      queryClient.invalidateQueries({ queryKey: ["host", "listings"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (mediaId: string) => deleteListingMedia(accessToken, propertyId, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host", "listing", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["host", "listing", propertyId, "media"] });
      queryClient.invalidateQueries({ queryKey: ["host", "listings"] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedMediaIds: string[]) => reorderListingMedia(accessToken, propertyId, orderedMediaIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host", "listing", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["host", "listing", propertyId, "media"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ mediaId, alt }: { mediaId: string; alt: string }) =>
      updateListingMedia(accessToken, propertyId, mediaId, { alt }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host", "listing", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["host", "listing", propertyId, "media"] });
      queryClient.invalidateQueries({ queryKey: ["host", "listings"] });
    },
  });

  const media = mediaQuery.data ?? [];
  const error = uploadMutation.error ?? deleteMutation.error ?? reorderMutation.error ?? updateMutation.error;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Photos and videos</h2>
          <p className="text-sm text-ink-muted">Upload images or videos. The first item appears on listing cards.</p>
        </div>
      <label className="inline-flex min-h-9 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80">
          <Icon name="plus" size={16} className="mr-1" />
          Upload
          <Input
            type="file"
            accept="image/*,video/mp4,video/quicktime"
            className="sr-only"
            disabled={uploadMutation.isPending}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.currentTarget.value = "";
              if (file) uploadMutation.mutate(file);
            }}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          {errorMessage(error)}
        </p>
      )}

      {uploadMutation.isPending && <p className="text-sm text-ink-muted">Uploading Images to dashboard...</p>}
      {mediaQuery.isLoading && <Skeleton className="h-40 w-full" />}
      {mediaQuery.isError && <p className="text-sm text-danger">Could not load listing media. Please try again.</p>}
      {mediaQuery.data && media.length === 0 && (
        <div className="rounded-xl border border-dashed border-line px-6 py-10 text-center text-sm text-ink-muted">
          No photos or videos yet.
        </div>
      )}
      {media.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item, index) => (
            <MediaItem
              key={item.id}
              item={item}
              first={index === 0}
              pending={deleteMutation.isPending || reorderMutation.isPending || updateMutation.isPending}
              onDelete={() => deleteMutation.mutate(item.id)}
              onEdit={(alt) => updateMutation.mutate({ mediaId: item.id, alt })}
              onMoveFirst={() => reorderMutation.mutate([item.id, ...media.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.id)])}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function MediaItem({
  item,
  first,
  pending,
  onDelete,
  onEdit,
  onMoveFirst,
}: {
  item: PropertyMediaSummary;
  first: boolean;
  pending: boolean;
  onDelete: () => void;
  onEdit: (alt: string) => void;
  onMoveFirst: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [alt, setAlt] = useState(item.alt ?? "");

  function saveEdit() {
    onEdit(alt);
    setEditing(false);
  }

  return (
    <li className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="aspect-video bg-muted">
        {item.resourceType === "VIDEO" ? (
          <video src={item.secureUrl} poster={item.posterUrl ?? undefined} className="size-full object-cover" controls />
        ) : (
          <img src={item.cardUrl || item.secureUrl} alt={item.alt ?? "Listing media"} className="size-full object-cover" />
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-muted">{first ? "Cover" : item.resourceType.toLowerCase()}</p>
          {!editing && item.alt && <p className="mt-0.5 truncate text-xs text-ink-muted">{item.alt}</p>}
        </div>
        <div className="flex gap-2">
          {!first && (
            <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onMoveFirst}>
              Make cover
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => setEditing((value) => !value)}>
            {editing ? "Cancel" : "Edit"}
          </Button>
          <Button type="button" variant="destructive" size="sm" disabled={pending} onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
      {editing && (
        <div className="flex gap-2 border-t border-line p-3">
          <Input
            value={alt}
            maxLength={500}
            placeholder="Media description"
            onChange={(event) => setAlt(event.target.value)}
            disabled={pending}
          />
          <Button type="button" size="sm" disabled={pending} onClick={saveEdit}>
            Save
          </Button>
        </div>
      )}
    </li>
  );
}

async function uploadToCloudinary(accessToken: string, propertyId: string, file: File) {
  const signature = await createMediaSignature(accessToken, propertyId);
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.apiKey);
  form.append("timestamp", String(signature.timestamp));
  form.append("signature", signature.signature);
  form.append("folder", signature.folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`, {
    method: "POST",
    body: form,
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? "Cloudinary upload failed");
  }

  return addListingMedia(accessToken, propertyId, {
    publicId: payload.public_id,
    secureUrl: payload.secure_url,
    resourceType: String(payload.resource_type).toUpperCase() === "VIDEO" ? "VIDEO" : "IMAGE",
    format: payload.format,
    width: payload.width ?? null,
    height: payload.height ?? null,
    duration: payload.duration ?? null,
    bytes: payload.bytes ?? file.size,
    alt: file.name,
  });
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "That media action did not work. Please try again.";
}
