/**
 * Mirrors apps/api/.../hosts/web/*.java — kept in lockstep by hand, see property.ts's own note.
 */

export interface CurrencyAmount {
  currency: string;
  amount: number;
}

/** Mirrors hosts/web/HostDashboardSummary.java. */
export interface HostDashboardSummary {
  activeListingsCount: number;
  totalListingsCount: number;
  upcomingReservationsCount: number;
  totalEarnings: CurrencyAmount[];
  pendingPayoutsCount: number;
  averageRating: number;
}

/** Mirrors hosts/web/HostReservationSummary.java. */
export interface HostReservationSummary {
  id: string;
  propertyId: string;
  propertyTitle: string;
  guestId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: number;
  grandTotal: number;
  currency: string;
  status: string;
  createdAt: string;
}

/** Mirrors hosts/web/PayoutSummary.java. */
export interface PayoutSummary {
  id: string;
  period: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}
