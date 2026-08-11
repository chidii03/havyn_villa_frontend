/**
 * Mirrors apps/api/.../admin/web/*.java — kept in lockstep by hand, see property.ts's own note.
 */

/** Mirrors admin/web/AdminUserSummary.java. */
export interface AdminUserSummary {
  id: string;
  email: string;
  emailVerified: boolean;
  roles: string[];
  status: string;
  fullName: string | null;
  createdAt: string;
}

// Admin property moderation reuses the existing PropertySummary/PropertyDetail types
// from property.ts (admin/web/AdminPropertyController.java returns those same DTOs) —
// no separate admin-specific property type needed.

/** Mirrors admin/web/VerificationRequestSummary.java. */
export interface VerificationRequestSummary {
  id: string;
  userId: string;
  documentUrl: string;
  notes: string | null;
  status: string;
  reviewNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface BookingEmailLogSummary {
  id: string;
  bookingId: string;
  bookingReferenceId: string | null;
  recipientEmail: string;
  status: "ATTEMPTED" | "SUCCESSFUL" | "FAILED";
  failureReason: string | null;
  retryAttempts: number;
  createdAt: string;
}

export interface BookingEmailLogPage {
  totalAttempted: number;
  totalSuccessful: number;
  totalFailed: number;
  logs: PageResponse<BookingEmailLogSummary>;
}

export interface SupportTicketSummary {
  id: string;
  userId: string;
  bookingReferenceId: string | null;
  summary: string;
  sourceMessage: string;
  status: "OPEN" | "REVIEWING" | "RESOLVED";
  createdAt: string;
}

/** Mirrors admin/web/DisputeSummary.java. */
export interface DisputeSummary {
  id: string;
  bookingId: string;
  raisedBy: string;
  reason: string;
  status: string;
  resolutionNotes: string | null;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

/** Mirrors admin/web/PlatformSettingSummary.java. */
export interface PlatformSettingSummary {
  key: string;
  value: string;
}

/** Mirrors admin/web/AdminAnalyticsSummary.java. */
export interface AdminAnalyticsSummary {
  totalUsers: number;
  totalHosts: number;
  totalProperties: number;
  activeProperties: number;
  totalBookings: number;
  confirmedOrCompletedBookings: number;
  grossRevenue: number;
  commissionCollected: number;
  pendingVerificationRequests: number;
  openDisputes: number;
}

/** Mirrors admin/web/AuditLogSummary.java. */
export interface AuditLogSummary {
  id: string;
  actorId: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  before: string | null;
  after: string | null;
  createdAt: string;
}
