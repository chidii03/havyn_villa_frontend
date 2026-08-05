import type { AmenitySummary, PageResponse, PropertyDetail, PropertySummary, PropertyTypeSummary } from "@havyn/shared";
import { apiFetch } from "./http";

export function getProperty(id: string) {
  return apiFetch<PropertyDetail>(`/api/v1/properties/${id}`);
}

export function listProperties(page = 0, size = 20) {
  return apiFetch<PageResponse<PropertySummary>>(`/api/v1/properties?page=${page}&size=${size}`);
}

export function listPropertyTypes() {
  return apiFetch<PropertyTypeSummary[]>("/api/v1/property-types");
}

export function listAmenities() {
  return apiFetch<AmenitySummary[]>("/api/v1/amenities");
}
