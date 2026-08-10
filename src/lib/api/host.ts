import type {
  AuthResponse,
  AvailabilityDay,
  AvailabilityDayInput,
  AddMediaRequest,
  CreatePropertyRequest,
  HostDashboardSummary,
  HostReservationSummary,
  MediaSignatureResponse,
  PageResponse,
  PayoutSummary,
  PropertyDetail,
  PropertyMediaSummary,
  PropertySummary,
  UpdateMediaRequest,
  UpdatePropertyRequest,
} from "@havyn/shared";
import { apiFetch } from "./http";

export function becomeHost(accessToken: string) {
  return apiFetch<AuthResponse>("/api/v1/host/onboarding", { method: "POST", accessToken });
}

export function getDashboardSummary(accessToken: string) {
  return apiFetch<HostDashboardSummary>("/api/v1/host/dashboard/summary", { accessToken });
}

export function listHostListings(accessToken: string, page = 0, size = 20) {
  return apiFetch<PageResponse<PropertySummary>>(`/api/v1/host/listings?page=${page}&size=${size}`, { accessToken });
}

export function getHostListing(accessToken: string, id: string) {
  return apiFetch<PropertyDetail>(`/api/v1/host/listings/${id}`, { accessToken });
}

export function createHostListing(accessToken: string, request: CreatePropertyRequest) {
  return apiFetch<PropertyDetail>("/api/v1/host/listings", { method: "POST", accessToken, body: request });
}

export function updateHostListing(accessToken: string, id: string, request: UpdatePropertyRequest) {
  return apiFetch<PropertyDetail>(`/api/v1/host/listings/${id}`, { method: "PATCH", accessToken, body: request });
}

export function deleteDraftListing(accessToken: string, id: string) {
  return apiFetch<void>(`/api/v1/host/listings/${id}`, { method: "DELETE", accessToken });
}

export function submitListing(accessToken: string, id: string) {
  return apiFetch<PropertyDetail>(`/api/v1/host/listings/${id}/submit`, { method: "POST", accessToken });
}

export function publishListing(accessToken: string, id: string) {
  return apiFetch<PropertyDetail>(`/api/v1/host/listings/${id}/publish`, { method: "POST", accessToken });
}

export function suspendListing(accessToken: string, id: string) {
  return apiFetch<PropertyDetail>(`/api/v1/host/listings/${id}/suspend`, { method: "POST", accessToken });
}

export function reactivateListing(accessToken: string, id: string) {
  return apiFetch<PropertyDetail>(`/api/v1/host/listings/${id}/reactivate`, { method: "POST", accessToken });
}

export function getAvailability(accessToken: string, id: string, from: string, to: string) {
  return apiFetch<AvailabilityDay[]>(`/api/v1/host/listings/${id}/availability?from=${from}&to=${to}`, { accessToken });
}

export function setAvailability(accessToken: string, id: string, days: AvailabilityDayInput[]) {
  return apiFetch<AvailabilityDay[]>(`/api/v1/host/listings/${id}/availability`, {
    method: "PUT",
    accessToken,
    body: { days },
  });
}

export function createMediaSignature(accessToken: string, propertyId: string) {
  return apiFetch<MediaSignatureResponse>(`/api/v1/host/listings/${propertyId}/media/signature`, { method: "POST", accessToken });
}

export function listListingMedia(accessToken: string, propertyId: string) {
  return apiFetch<PropertyMediaSummary[]>(`/api/v1/host/listings/${propertyId}/media`, { accessToken });
}

export function addListingMedia(accessToken: string, propertyId: string, request: AddMediaRequest) {
  return apiFetch<PropertyMediaSummary>(`/api/v1/host/listings/${propertyId}/media`, { method: "POST", accessToken, body: request });
}

export function deleteListingMedia(accessToken: string, propertyId: string, mediaId: string) {
  return apiFetch<void>(`/api/v1/host/listings/${propertyId}/media/${mediaId}`, { method: "DELETE", accessToken });
}

export function updateListingMedia(accessToken: string, propertyId: string, mediaId: string, request: UpdateMediaRequest) {
  return apiFetch<PropertyMediaSummary>(`/api/v1/host/listings/${propertyId}/media/${mediaId}`, {
    method: "PATCH",
    accessToken,
    body: request,
  });
}

export function reorderListingMedia(accessToken: string, propertyId: string, orderedMediaIds: string[]) {
  return apiFetch<PropertyMediaSummary[]>(`/api/v1/host/listings/${propertyId}/media/order`, {
    method: "PUT",
    accessToken,
    body: { orderedMediaIds },
  });
}

export function listReservations(accessToken: string, propertyId?: string, page = 0, size = 20) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (propertyId) {
    params.set("propertyId", propertyId);
  }
  return apiFetch<PageResponse<HostReservationSummary>>(`/api/v1/host/reservations?${params}`, { accessToken });
}

export function listPayouts(accessToken: string, page = 0, size = 20) {
  return apiFetch<PageResponse<PayoutSummary>>(`/api/v1/host/payouts?page=${page}&size=${size}`, { accessToken });
}
