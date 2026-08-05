import { EmptyState } from "@/components/patterns/empty-state";
import { CarouselRow } from "@/components/property/carousel-row";
import { CategoryChips } from "@/components/property/category-chips";
import { FiltersSheet } from "@/components/property/filters-sheet";
import { listAmenities, listPropertyTypes } from "@/lib/api/properties";
import { search } from "@/lib/api/search";
import type { SearchResultItem } from "@havyn/shared";

const ROW_SIZE = 12;
const HOME_SEARCH_SIZE = 140;
const TARGET_EXTRA_ROWS = 8;
const FEATURED_TITLE = "New on Havyn Villa";
const CURATED_ROWS = [
  { title: "Lagos weekend stays", predicate: (p: SearchResultItem) => includesAny(p, ["lagos"]) },
  { title: "Island apartments", predicate: (p: SearchResultItem) => includesAny(p, ["island", "lekki", "ikoyi", "vi"]) },
  { title: "Pool-ready homes", predicate: (p: SearchResultItem) => includesAny(p, ["pool", "swim"]) },
  { title: "Family-sized villas", predicate: (p: SearchResultItem) => p.capacity >= 4 || p.bedrooms >= 3 },
  { title: "Couple escapes", predicate: (p: SearchResultItem) => p.capacity <= 3 && p.bedrooms <= 2 },
  { title: "High-rating picks", predicate: (p: SearchResultItem) => p.ratingAvg >= 4 },
  { title: "Best value stays", predicate: (p: SearchResultItem) => p.basePrice > 0 },
  { title: "Fresh shortlets", predicate: () => true },
];

export default async function Home({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const [types, amenities, results] = await Promise.all([
    listPropertyTypes(),
    listAmenities(),
    search({ type, sort: "newest", size: HOME_SEARCH_SIZE }),
  ]);

  const properties = results.data.filter(hasUsablePhoto);

  if (properties.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-6xl px-6 pt-6 pb-24">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <CategoryChips types={types} basePath="/" />
            </div>
            <FiltersSheet types={types} amenities={amenities} basePath="/" />
          </div>
          <div className="mt-8">
            <EmptyState
              icon="sparkle"
              title="No stays yet"
              description="Havyn Villa is just getting started — new listings will appear here as hosts publish them."
            />
          </div>
        </div>
      </div>
    );
  }

  const { featured, rows } = buildHomeRows(properties);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-6 pt-6 pb-24">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <CategoryChips types={types} basePath="/" />
          </div>
          <FiltersSheet types={types} amenities={amenities} basePath="/" />
        </div>

        <div className="mt-8 space-y-10">
          <CarouselRow title={FEATURED_TITLE} properties={featured} />
          {rows.map((row) => (
            <CarouselRow key={row.title} title={row.title} properties={row.properties} />
          ))}
        </div>
      </div>
    </div>
  );
}

function buildHomeRows(properties: SearchResultItem[]) {
  const used = new Set<string>();

  const featured = properties.slice(0, ROW_SIZE);
  featured.forEach((p) => used.add(p.id));

  let remaining = properties.filter((p) => !used.has(p.id));

  const byCity = new Map<string, SearchResultItem[]>();
  for (const property of remaining) {
    const key = property.city?.trim() || "Other";
    const list = byCity.get(key) ?? [];
    list.push(property);
    byCity.set(key, list);
  }

  const MIN_ROW_SIZE = 4;

  const rows = Array.from(byCity.entries())
    .filter(([, list]) => list.length >= MIN_ROW_SIZE)
    .sort((a, b) => b[1].length - a[1].length) 
    .map(([city, list]) => {
      const cityProperties = list.filter((p) => !used.has(p.id)).slice(0, ROW_SIZE);
      cityProperties.forEach((p) => used.add(p.id));
      const state = cityProperties[0]?.state;
      return {
        title: state && state !== city ? `Stays in ${city}, ${state}` : `Stays in ${city}`,
        properties: cityProperties,
      };
    })
    .filter((row) => row.properties.length >= MIN_ROW_SIZE)
    .slice(0, TARGET_EXTRA_ROWS);

  remaining = properties.filter((p) => !used.has(p.id));
  for (const curated of CURATED_ROWS) {
    if (rows.length >= TARGET_EXTRA_ROWS) break;
    const rowProperties = remaining.filter(curated.predicate).slice(0, ROW_SIZE);
    if (rowProperties.length < MIN_ROW_SIZE) continue;
    rowProperties.forEach((p) => used.add(p.id));
    rows.push({ title: curated.title, properties: rowProperties });
    remaining = properties.filter((p) => !used.has(p.id));
  }

  return { featured, rows };
}

function includesAny(property: SearchResultItem, needles: string[]) {
  const haystack = [property.title, property.city, property.state, property.country, property.propertyType]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
}

function hasUsablePhoto(property: SearchResultItem) {
  return property.photoUrls.some((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  });
}
