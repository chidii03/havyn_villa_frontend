import type { PageResponse, SearchQuery, SearchResultItem } from "@havyn/shared";
import { apiFetch } from "./http";

/** Mirrors Spring's Set&lt;String&gt; query-param binding: repeat the key, not a comma-joined value. */
export function buildSearchQueryString(query: SearchQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, String(item));
    } else {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

export function search(query: SearchQuery) {
  const qs = buildSearchQueryString(query);
  return apiFetch<PageResponse<SearchResultItem>>(`/api/v1/search${qs ? `?${qs}` : ""}`);
}