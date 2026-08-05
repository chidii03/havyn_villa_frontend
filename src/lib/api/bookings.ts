import type {
  BookingDetail,
  CancellationResult,
  CreateBookingRequest,
  PageResponse,
  QuoteRequest,
  QuoteResponse,
} from "@havyn/shared";
import { apiFetch } from "./http";

/** Public — no auth required, no persistence. */
export function quoteProperty(propertyId: string, request: QuoteRequest) {
  return apiFetch<QuoteResponse>(`/api/v1/properties/${propertyId}/quote`, { method: "POST", body: request });
}

export function createBooking(accessToken: string, request: CreateBookingRequest, idempotencyKey: string) {
  return apiFetch<BookingDetail>("/api/v1/bookings", {
    method: "POST",
    accessToken,
    body: request,
    headers: { "Idempotency-Key": idempotencyKey },
  });
}

export function listBookings(accessToken: string, page = 0, size = 20) {
  return apiFetch<PageResponse<BookingDetail>>(`/api/v1/bookings?page=${page}&size=${size}`, { accessToken });
}

export function getBooking(accessToken: string, id: string) {
  return apiFetch<BookingDetail>(`/api/v1/bookings/${id}`, { accessToken });
}

export function cancelBooking(accessToken: string, id: string) {
  return apiFetch<CancellationResult>(`/api/v1/bookings/${id}/cancel`, { method: "POST", accessToken });
}
