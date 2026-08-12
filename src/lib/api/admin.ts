import type {
  AdminAnalyticsSummary,
  AdminUserSummary,
  AuditLogSummary,
  BookingDetail,
  BookingEmailLogPage,
  DisputeSummary,
  PageResponse,
  PlatformSettingSummary,
  PropertyDetail,
  PropertySummary,
  SupportTicketSummary,
  VerificationRequestSummary,
} from "@havyn/shared";
import { apiFetch } from "./http";

// --- users ---

export function listAdminUsers(accessToken: string, email = "", page = 0, size = 20) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (email) {
    params.set("email", email);
  }
  return apiFetch<PageResponse<AdminUserSummary>>(`/api/v1/admin/users?${params}`, { accessToken });
}

export function grantRole(accessToken: string, userId: string, roleCode: string) {
  return apiFetch<AdminUserSummary>(`/api/v1/admin/users/${userId}/roles/${roleCode}`, { method: "POST", accessToken });
}

export function revokeRole(accessToken: string, userId: string, roleCode: string) {
  return apiFetch<AdminUserSummary>(`/api/v1/admin/users/${userId}/roles/${roleCode}`, { method: "DELETE", accessToken });
}

export function suspendUser(accessToken: string, userId: string) {
  return apiFetch<AdminUserSummary>(`/api/v1/admin/users/${userId}/suspend`, { method: "POST", accessToken });
}

export function reactivateUser(accessToken: string, userId: string) {
  return apiFetch<AdminUserSummary>(`/api/v1/admin/users/${userId}/reactivate`, { method: "POST", accessToken });
}

// --- listing moderation ---

export function listAdminProperties(accessToken: string, page = 0, size = 20) {
  return apiFetch<PageResponse<PropertySummary>>(`/api/v1/admin/properties?page=${page}&size=${size}`, { accessToken });
}

export function suspendProperty(accessToken: string, propertyId: string, reason: string) {
  return apiFetch<PropertyDetail>(`/api/v1/admin/properties/${propertyId}/suspend`, { method: "POST", accessToken, body: { reason } });
}

export function reactivateProperty(accessToken: string, propertyId: string) {
  return apiFetch<PropertyDetail>(`/api/v1/admin/properties/${propertyId}/reactivate`, { method: "POST", accessToken });
}

export function rejectProperty(accessToken: string, propertyId: string, reason: string) {
  return apiFetch<PropertyDetail>(`/api/v1/admin/properties/${propertyId}/reject`, { method: "POST", accessToken, body: { reason } });
}

// --- KYC ---

export function listPendingVerificationRequests(accessToken: string, page = 0, size = 20) {
  return apiFetch<PageResponse<VerificationRequestSummary>>(`/api/v1/admin/verification-requests?page=${page}&size=${size}`, {
    accessToken,
  });
}

export function approveVerificationRequest(accessToken: string, id: string) {
  return apiFetch<VerificationRequestSummary>(`/api/v1/admin/verification-requests/${id}/approve`, { method: "POST", accessToken });
}

export function rejectVerificationRequest(accessToken: string, id: string, reason: string) {
  return apiFetch<VerificationRequestSummary>(`/api/v1/admin/verification-requests/${id}/reject`, {
    method: "POST",
    accessToken,
    body: { reason },
  });
}

// --- disputes ---

export function listOpenDisputes(accessToken: string, page = 0, size = 20) {
  return apiFetch<PageResponse<DisputeSummary>>(`/api/v1/admin/disputes?page=${page}&size=${size}`, { accessToken });
}

export function resolveDispute(accessToken: string, id: string, reason: string) {
  return apiFetch<DisputeSummary>(`/api/v1/admin/disputes/${id}/resolve`, { method: "POST", accessToken, body: { reason } });
}

export function dismissDispute(accessToken: string, id: string, reason: string) {
  return apiFetch<DisputeSummary>(`/api/v1/admin/disputes/${id}/dismiss`, { method: "POST", accessToken, body: { reason } });
}

// --- settings ---

export function listSettings(accessToken: string) {
  return apiFetch<PlatformSettingSummary[]>("/api/v1/admin/settings", { accessToken });
}

export function updateSetting(accessToken: string, key: string, value: string) {
  return apiFetch<PlatformSettingSummary>(`/api/v1/admin/settings/${key}`, { method: "PUT", accessToken, body: { value } });
}

// --- analytics ---

export function getAnalyticsSummary(accessToken: string) {
  return apiFetch<AdminAnalyticsSummary>("/api/v1/admin/analytics/summary", { accessToken });
}

export function listAdminBookings(accessToken: string, page = 0, size = 20) {
  return apiFetch<PageResponse<BookingDetail>>(`/api/v1/admin/bookings?page=${page}&size=${size}`, { accessToken });
}

// --- audit log ---

export function listAuditLog(accessToken: string, page = 0, size = 20) {
  return apiFetch<PageResponse<AuditLogSummary>>(`/api/v1/admin/audit-log?page=${page}&size=${size}`, { accessToken });
}

export function listBookingEmailLogs(accessToken: string, status = "", search = "", page = 0, size = 20) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  return apiFetch<BookingEmailLogPage>(`/api/v1/admin/emails?${params}`, { accessToken });
}

export function listSupportTickets(accessToken: string, status = "", search = "", page = 0, size = 20) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  return apiFetch<PageResponse<SupportTicketSummary>>(`/api/v1/admin/support-tickets?${params}`, { accessToken });
}
