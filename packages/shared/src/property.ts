import { z } from "zod";


export interface PropertyTypeSummary {
  code: string;
  name: string;
}

export interface AmenitySummary {
  code: string;
  name: string;
  category: string | null;
}

/** Mirrors properties/web/PropertySummary.java. */
export interface PropertySummary {
  id: string;
  title: string;
  city: string;
  state: string;
  country: string;
  lat: number | null;
  lng: number | null;
  propertyType: string;
  currency: string;
  basePrice: number;
  capacity: number;
  bedrooms: number;
  ratingAvg: number;
  ratingCount: number;
  status: string;
}

/** Mirrors properties/web/PropertyDetail.java. */
export interface PropertyDetail {
  id: string;
  hostId: string;
  type: PropertyTypeSummary;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  lat: number | null;
  lng: number | null;
  currency: string;
  basePrice: number;
  capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  cleaningFee: number;
  serviceFeePct: number;
  houseRules: string | null;
  cancellationPolicy: string;
  status: string;
  ratingAvg: number;
  ratingCount: number;
  amenities: AmenitySummary[];
  createdAt: string;
  updatedAt: string;
  photoUrls: string[];
}

export interface MediaSignatureResponse {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}

export interface PropertyMediaSummary {
  id: string;
  secureUrl: string;
  cardUrl: string;
  heroUrl: string;
  thumbUrl: string;
  posterUrl: string | null;
  resourceType: "IMAGE" | "VIDEO";
  format: string;
  width: number | null;
  height: number | null;
  duration: number | null;
  position: number;
  alt: string | null;
}

export interface AddMediaRequest {
  publicId: string;
  secureUrl: string;
  resourceType: "IMAGE" | "VIDEO";
  format: string;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  bytes: number;
  alt?: string | null;
}

export interface UpdateMediaRequest {
  alt?: string | null;
}

/** Mirrors search/web/SearchResultItem.java. */
export interface SearchResultItem {
  id: string;
  title: string;
  city: string;
  state: string;
  country: string;
  lat: number | null;
  lng: number | null;
  propertyType: string;
  currency: string;
  basePrice: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  ratingAvg: number;
  ratingCount: number;
  photoUrls: string[];
}

/** Mirrors search/service/SortOption.java. */
export const SORT_OPTIONS = ["newest", "price_asc", "price_desc", "rating_desc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

/** Query params GET /search accepts — see architecture/03-api-design.md's session 4 addition. */
export interface SearchQuery {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  bedrooms?: number;
  amenities?: string[];
  rating?: number;
  sort?: SortOption;
  page?: number;
  size?: number;
}

/** Mirrors properties/domain/PropertyStatus.java. */
export const PROPERTY_STATUSES = ["DRAFT", "PENDING", "ACTIVE", "SUSPENDED"] as const;
export type PropertyStatusValue = (typeof PROPERTY_STATUSES)[number];

/** Mirrors properties/web/CreatePropertyRequest.java. */
export interface CreatePropertyRequest {
  typeCode: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  lat?: number | null;
  lng?: number | null;
  currency?: string | null;
  basePrice: number;
  capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  cleaningFee?: number | null;
  serviceFeePct?: number | null;
  houseRules?: string | null;
  cancellationPolicy?: string | null;
  amenityCodes?: string[];
}

/** Mirrors properties/web/UpdatePropertyRequest.java — every field optional, a null field leaves it unchanged. */
export type UpdatePropertyRequest = Partial<CreatePropertyRequest>;

/** Client-side validation mirroring CreatePropertyRequest.java's Bean Validation annotations — the backend re-validates regardless. */
export const createPropertySchema = z.object({
  typeCode: z.string().min(1, "Choose a property type"),
  title: z.string().trim().min(1, "Title is required").max(150),
  description: z.string().trim().min(1, "Description is required"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  country: z.string().trim().min(1, "Country is required").max(100),
  basePrice: z.coerce.number().min(0, "Base price can't be negative"),
  capacity: z.coerce.number().int().positive("Capacity must be at least 1"),
  bedrooms: z.coerce.number().int().min(0),
  beds: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  cleaningFee: z.coerce.number().min(0).optional(),
  serviceFeePct: z.coerce.number().min(0).max(100).optional(),
  houseRules: z.string().trim().optional(),
  cancellationPolicy: z.string().optional(),
  amenityCodes: z.array(z.string()).optional(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

/** Mirrors properties/web/AvailabilityDay.java. */
export interface AvailabilityDay {
  date: string;
  blocked: boolean;
  priceOverride: number | null;
}

/** Mirrors properties/web/AvailabilityDayInput.java — `blocked: null/undefined` leaves the existing block state unchanged. */
export interface AvailabilityDayInput {
  date: string;
  blocked?: boolean | null;
  priceOverride?: number | null;
}
