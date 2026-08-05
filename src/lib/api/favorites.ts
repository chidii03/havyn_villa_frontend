import type { PageResponse } from "@havyn/shared";
import { apiFetch } from "./http";

export interface FavoriteSummary {
  propertyId: string;
  createdAt: string;
}

export function listFavorites(accessToken: string, page = 0, size = 100) {
  return apiFetch<PageResponse<FavoriteSummary>>(`/api/v1/favorites?page=${page}&size=${size}`, { accessToken });
}

export function addFavorite(accessToken: string, propertyId: string) {
  return apiFetch<FavoriteSummary>(`/api/v1/favorites/${propertyId}`, { method: "POST", accessToken });
}

export function removeFavorite(accessToken: string, propertyId: string) {
  return apiFetch<void>(`/api/v1/favorites/${propertyId}`, { method: "DELETE", accessToken });
}
