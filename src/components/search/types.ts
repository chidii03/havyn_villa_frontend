export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export const EMPTY_GUESTS: GuestCounts = { adults: 0, children: 0, infants: 0, pets: 0 };
