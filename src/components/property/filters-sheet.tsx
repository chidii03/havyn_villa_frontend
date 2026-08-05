"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { AmenitySummary, PropertyTypeSummary } from "@havyn/shared";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/format/currency";

const MAX_PRICE = 500_000;
const RATING_OPTIONS = ["3", "4", "4.5"] as const;

export function FiltersSheet({
  types,
  amenities,
  basePath,
}: {
  types: PropertyTypeSummary[];
  amenities: AmenitySummary[];
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [priceRange, setPriceRange] = useState<number[]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || MAX_PRICE,
  ]);
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [bedrooms, setBedrooms] = useState(Number(searchParams.get("bedrooms")) || 0);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set(searchParams.getAll("amenities")));
  const [rating, setRating] = useState(searchParams.get("rating") ?? "");

  function toggleAmenity(code: string, checked: boolean) {
    setSelectedAmenities((prev) => {
      const next = new Set(prev);
      if (checked) next.add(code);
      else next.delete(code);
      return next;
    });
  }

  function apply() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    else params.delete("minPrice");
    if (priceRange[1] < MAX_PRICE) params.set("maxPrice", String(priceRange[1]));
    else params.delete("maxPrice");
    if (type) params.set("type", type);
    else params.delete("type");
    if (bedrooms > 0) params.set("bedrooms", String(bedrooms));
    else params.delete("bedrooms");
    if (rating) params.set("rating", rating);
    else params.delete("rating");
    params.delete("amenities");
    selectedAmenities.forEach((code) => params.append("amenities", code));

    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
    setOpen(false);
  }

  function clearAll() {
    setPriceRange([0, MAX_PRICE]);
    setType("");
    setBedrooms(0);
    setSelectedAmenities(new Set());
    setRating("");
    const params = new URLSearchParams(searchParams.toString());
    for (const key of ["minPrice", "maxPrice", "type", "bedrooms", "rating", "amenities", "page"]) {
      params.delete(key);
    }
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" className="gap-1.5" />}>
        <Icon name="filter" size={15} />
        Filters
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-7 overflow-y-auto px-4">
          <div>
            <p className="text-sm font-medium text-ink">Price range (per night)</p>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as number[])}
              min={0}
              max={MAX_PRICE}
              step={5000}
              className="mt-4"
            />
            <div className="mt-2 flex justify-between text-sm tabular-nums text-ink-muted">
              <span>{formatPrice(priceRange[0], "NGN")}</span>
              <span>{formatPrice(priceRange[1], "NGN")}{priceRange[1] === MAX_PRICE ? "+" : ""}</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">Property type</p>
            <Select value={type || undefined} onValueChange={(value) => setType(String(value ?? ""))}>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t.code} value={t.code}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">Bedrooms</p>
            <div className="mt-2 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Fewer bedrooms"
                disabled={bedrooms === 0}
                onClick={() => setBedrooms((n) => Math.max(0, n - 1))}
              >
                <Icon name="minus" size={14} />
              </Button>
              <span className="w-14 text-center text-sm tabular-nums text-ink">
                {bedrooms === 0 ? "Any" : `${bedrooms}+`}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="More bedrooms"
                onClick={() => setBedrooms((n) => n + 1)}
              >
                <Icon name="plus" size={14} />
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">Amenities</p>
            <div className="mt-2 grid grid-cols-1 gap-2.5">
              {amenities.map((amenity) => (
                <label key={amenity.code} className="flex items-center gap-2 text-sm text-ink">
                  <Checkbox
                    checked={selectedAmenities.has(amenity.code)}
                    onCheckedChange={(checked) => toggleAmenity(amenity.code, checked === true)}
                  />
                  {amenity.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">Minimum rating</p>
            <Select value={rating || undefined} onValueChange={(value) => setRating(String(value ?? ""))}>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
                {RATING_OPTIONS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}+ stars
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex-row gap-2 border-t border-line">
          <Button type="button" variant="outline" className="flex-1" onClick={clearAll}>
            Clear all
          </Button>
          <Button type="button" className="flex-1" onClick={apply}>
            Show results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
