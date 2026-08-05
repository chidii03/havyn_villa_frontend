"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { EMPTY_GUESTS, type GuestCounts } from "./types";
import { WhenPanel } from "./when-panel";
import { WherePanel } from "./where-panel";
import { WhoPanel } from "./who-panel";

type Segment = "where" | "when" | "who" | null;

/**
 * The where/when/who search pill — frontend/03-ui-and-navigation-spec.md#1.2.
 * Expanded (hero) and compact (sticky header) variants share this one component,
 * only the sizing/typography differ; both have the same three real popovers.
 */
export function SearchBar({ variant = "expanded" }: { variant?: "expanded" | "compact" }) {
  const router = useRouter();
  const [openSegment, setOpenSegment] = useState<Segment>(null);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState<GuestCounts>(EMPTY_GUESTS);

  const totalGuests = guests.adults + guests.children;
  const whenLabel = checkIn && checkOut ? `${format(checkIn, "MMM d")} – ${format(checkOut, "MMM d")}` : "Add dates";
  const whoLabel = totalGuests > 0 ? `${totalGuests} guest${totalGuests === 1 ? "" : "s"}` : "Add guests";
  const isCompact = variant === "compact";

  function handleSearch() {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    if (totalGuests > 0) params.set("guests", String(totalGuests));
    setOpenSegment(null);
    router.push(`/search${params.size > 0 ? `?${params.toString()}` : ""}`);
  }

  function segment(
    key: Exclude<Segment, null>,
    label: string,
    value: string,
    panel: React.ReactNode,
    options?: { placeholder?: boolean },
  ) {
    return (
      <Popover open={openSegment === key} onOpenChange={(open) => setOpenSegment(open ? key : null)}>
        <PopoverTrigger
          aria-expanded={openSegment === key}
          className={cn(
            "flex min-w-0 flex-1 flex-col justify-center rounded-full px-4 text-left transition-colors hover:bg-muted",
            isCompact ? "h-11 gap-0 py-0" : "h-14 gap-0.5 py-2",
            openSegment === key && "bg-muted",
          )}
        >
          <span className={cn("font-semibold text-ink", isCompact ? "text-xs" : "text-sm")}>{label}</span>
          {!isCompact && (
            <span className={cn("truncate text-sm", options?.placeholder ? "text-ink-muted" : "text-ink")}>
              {value}
            </span>
          )}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto min-w-80 p-3 sm:min-w-96">
          {panel}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div
      role="search"
      aria-label="Search stays"
      className={cn(
        "flex w-full items-center rounded-full border border-line bg-surface shadow-e1 transition-shadow hover:shadow-e2",
        isCompact ? "h-11 gap-0.5 p-0.5" : "h-16 gap-1 p-1.5",
      )}
    >
      {segment(
        "where",
        "Where",
        destination || "Search destinations",
        <WherePanel
          value={destination}
          onChange={setDestination}
          onSelect={(value) => {
            setDestination(value);
            setOpenSegment("when");
          }}
        />,
        { placeholder: !destination },
      )}
      <span aria-hidden className="h-6 w-px shrink-0 bg-line" />
      {segment(
        "when",
        "When",
        whenLabel,
        <WhenPanel
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={({ checkIn: nextIn, checkOut: nextOut }) => {
            setCheckIn(nextIn);
            setCheckOut(nextOut);
            if (nextIn && nextOut) {
              setOpenSegment("who");
            }
          }}
        />,
        { placeholder: !(checkIn && checkOut) },
      )}
      <span aria-hidden className="h-6 w-px shrink-0 bg-line" />
      {segment("who", "Who", whoLabel, <WhoPanel value={guests} onChange={setGuests} />, { placeholder: totalGuests === 0 })}
      <Button
        type="button"
        onClick={handleSearch}
        size="icon"
        className={cn("shrink-0 rounded-full", isCompact ? "size-9" : "size-14")}
        aria-label="Search"
      >
        <Icon name="search" size={isCompact ? 16 : 22} className="text-primary-foreground" />
      </Button>
    </div>
  );
}
