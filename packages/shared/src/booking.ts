/**
 * Mirrors apps/api/.../booking/web/*.java — kept in lockstep by hand since the
 * backend doesn't (yet) publish a machine-readable schema.
 */

export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REFUNDED"] as const;
export type BookingStatusValue = (typeof BOOKING_STATUSES)[number];

export interface QuoteRequest {
  checkIn: string;
  checkOut: string;
  guests: number;
}

/** Mirrors booking/web/QuoteResponse.java — deliberately has no commission field; see its Javadoc. */
export interface QuoteResponse {
  nights: number;
  baseTotal: number;
  cleaningFee: number;
  serviceFee: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: string;
}

/** {@code expectedTotal} is the last quote's grandTotal — the server re-verifies it and rejects on drift. */
export interface CreateBookingRequest {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  expectedTotal: number;
}

export interface BookingPropertySummary {
  id: string;
  title: string;
  city: string;
  state: string;
  country: string;
}

/** Mirrors booking/web/BookingDetail.java. */
export interface BookingDetail {
  id: string;
  property: BookingPropertySummary;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  baseTotal: number;
  cleaningFee: number;
  serviceFee: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: string;
  status: BookingStatusValue;
  holdExpiresAt: string | null;
  createdAt: string;
}

/** Mirrors booking/web/CancellationResult.java. */
export interface CancellationResult {
  booking: BookingDetail;
  refundPercentage: number;
  refundAmount: number;
}
