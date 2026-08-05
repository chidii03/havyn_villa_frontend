import Link from "next/link";
import type { SearchQuery, SortOption } from "@havyn/shared";
import { SORT_OPTIONS } from "@havyn/shared";
import { CategoryChips } from "@/components/property/category-chips";
import { FiltersSheet } from "@/components/property/filters-sheet";
import { SearchResultsView } from "@/components/property/search-results-view";
import { listAmenities, listPropertyTypes } from "@/lib/api/properties";
import { search } from "@/lib/api/search";

type RawSearchParams = Record<string, string | string[] | undefined>;

export default async function SearchPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const params = await searchParams;
  const page = asNumber(params.page) ?? 0;

  const checkIn = asString(params.checkIn);
  const rawCheckOut = asString(params.checkOut);
  const checkOut = normalizeCheckOut(checkIn, rawCheckOut);

  const query: SearchQuery = {
    destination: asString(params.destination),
    checkIn,
    checkOut,
    guests: asNumber(params.guests),
    minPrice: asNumber(params.minPrice),
    maxPrice: asNumber(params.maxPrice),
    type: asString(params.type),
    bedrooms: asNumber(params.bedrooms),
    amenities: asArray(params.amenities),
    rating: asNumber(params.rating),
    sort: asSortOption(params.sort),
    page,
    size: 20,
  };

  const [types, amenities, results] = await Promise.all([listPropertyTypes(), listAmenities(), search(query)]);

  const destination = query.destination;
  const dateRange = query.checkIn && query.checkOut ? `${query.checkIn} – ${query.checkOut}` : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {destination ? `Stays in ${destination}` : "Search stays"}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {results.total} {results.total === 1 ? "stay" : "stays"}
          {[dateRange, query.guests ? `${query.guests} guests` : null].filter(Boolean).length > 0
            ? ` · ${[dateRange, query.guests ? `${query.guests} guests` : null].filter(Boolean).join(" · ")}`
            : ""}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <CategoryChips types={types} basePath="/search" />
        </div>
        <FiltersSheet types={types} amenities={amenities} basePath="/search" />
      </div>

      <div className="mt-6">
        <SearchResultsView properties={results.data} />
      </div>

      <SearchPagination page={results.page} size={results.size} total={results.total} searchParams={params} />
    </div>
  );
}

function SearchPagination({
  page,
  size,
  total,
  searchParams,
}: {
  page: number;
  size: number;
  total: number;
  searchParams: RawSearchParams;
}) {
  const totalPages = Math.max(1, Math.ceil(total / size));
  if (totalPages <= 1) return null;

  function hrefForPage(targetPage: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || value === undefined) continue;
      for (const v of Array.isArray(value) ? value : [value]) params.append(key, v);
    }
    params.set("page", String(targetPage));
    return `/search?${params.toString()}`;
  }

  return (
    <nav aria-label="Search results pages" className="mt-8 flex items-center justify-center gap-4">
      <Link
        href={hrefForPage(page - 1)}
        aria-disabled={page === 0}
        className="text-sm font-medium text-ink aria-disabled:pointer-events-none aria-disabled:text-ink-muted/50"
      >
        Previous
      </Link>
      <span className="text-sm tabular-nums text-ink-muted">
        Page {page + 1} of {totalPages}
      </span>
      <Link
        href={hrefForPage(page + 1)}
        aria-disabled={page + 1 >= totalPages}
        className="text-sm font-medium text-ink aria-disabled:pointer-events-none aria-disabled:text-ink-muted/50"
      >
        Next
      </Link>
    </nav>
  );
}

function asString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value || undefined;
}

function asNumber(value: string | string[] | undefined): number | undefined {
  const str = asString(value);
  if (!str) return undefined;
  const num = Number(str);
  return Number.isFinite(num) ? num : undefined;
}

function asArray(value: string | string[] | undefined): string[] | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value : [value];
}

function asSortOption(value: string | string[] | undefined): SortOption | undefined {
  const str = asString(value);
  return str && (SORT_OPTIONS as readonly string[]).includes(str) ? (str as SortOption) : undefined;
}

function normalizeCheckOut(checkIn: string | undefined, checkOut: string | undefined): string | undefined {
  if (!checkIn || !checkOut) return checkOut;
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start < end) {
    return checkOut;
  }
  const nextDay = new Date(start);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  return nextDay.toISOString().slice(0, 10);
}
