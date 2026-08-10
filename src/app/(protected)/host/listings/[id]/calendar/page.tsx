"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, LinkButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorState } from "@/components/patterns/error-state";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvailability, getHostListing, setAvailability } from "@/lib/api/host";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

const RANGE_DAYS = 90;
export default function ListingCalendarPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const today = useMemo(() => new Date(), []);
  const rangeEnd = useMemo(() => addDays(today, RANGE_DAYS), [today]);
  const from = format(today, "yyyy-MM-dd");
  const to = format(rangeEnd, "yyyy-MM-dd");

  const listingQuery = useQuery({
    queryKey: ["host", "listing", id],
    queryFn: () => getHostListing(accessToken!, id),
    enabled: Boolean(accessToken),
  });

  const availabilityQuery = useQuery({
    queryKey: ["host", "listing", id, "availability", from, to],
    queryFn: () => getAvailability(accessToken!, id, from, to),
    enabled: Boolean(accessToken),
  });

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [priceOverride, setPriceOverride] = useState("");

  const saveMutation = useMutation({
    mutationFn: () =>
      setAvailability(
        accessToken!,
        id,
        selectedDates.map((date) => ({
          date: format(date, "yyyy-MM-dd"),
          blocked,
          priceOverride: priceOverride ? Number(priceOverride) : null,
        })),
      ),
    onSuccess: () => {
      toast.success(`Updated ${selectedDates.length} date${selectedDates.length === 1 ? "" : "s"}`);
      setSelectedDates([]);
      setPriceOverride("");
      setBlocked(false);
      queryClient.invalidateQueries({ queryKey: ["host", "listing", id, "availability"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Couldn't update availability. Please try again.");
    },
  });

  const blockedDates = useMemo(
    () => (availabilityQuery.data ?? []).filter((day) => day.blocked).map((day) => new Date(`${day.date}T00:00:00`)),
    [availabilityQuery.data],
  );
  const overriddenDates = useMemo(
    () => (availabilityQuery.data ?? []).filter((day) => day.priceOverride != null).map((day) => new Date(`${day.date}T00:00:00`)),
    [availabilityQuery.data],
  );

  if (listingQuery.isError || availabilityQuery.isError) {
    const loadError = listingQuery.error ?? availabilityQuery.error;
    const description =
      loadError instanceof ApiError
        ? loadError.message
        : listingQuery.isError
          ? "Couldn't load this listing. Please try again in a moment."
          : "Couldn't load availability. Please try again in a moment.";

    return (
      <ErrorState
        title="Couldn't load the calendar"
        description={description}
        onRetry={() => {
          listingQuery.refetch();
          availabilityQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <LinkButton href="/host/listings" variant="ghost" size="sm">
            <Icon name="chevronLeft" size={14} />
            Back to listings
          </LinkButton>
          {listingQuery.isLoading ? <Skeleton className="mt-1 h-6 w-48" /> : <h2 className="mt-1 text-lg font-semibold text-ink">{listingQuery.data?.title}</h2>}
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {availabilityQuery.isLoading ? (
          <Skeleton className="h-80 w-full max-w-md" />
        ) : (
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => setSelectedDates(dates ?? [])}
            disabled={{ before: today }}
            modifiers={{ blocked: blockedDates, priced: overriddenDates }}
            modifiersClassNames={{ blocked: "line-through text-danger", priced: "underline decoration-brand decoration-2" }}
          />
        )}

        <div className="flex w-full max-w-xs flex-col gap-4 rounded-xl border border-line p-4">
          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-3 rounded-full bg-danger/60" /> Blocked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-3 rounded-full border-2 border-brand" /> Custom price
            </span>
          </div>

          <p className="text-sm font-medium text-ink">
            {selectedDates.length === 0 ? "Select dates to edit" : `${selectedDates.length} date${selectedDates.length === 1 ? "" : "s"} selected`}
          </p>

          <label className="flex items-center gap-2 text-sm text-ink">
            <Checkbox checked={blocked} onCheckedChange={(checked) => setBlocked(checked === true)} disabled={selectedDates.length === 0} />
            Block these dates
          </label>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price-override">Price override (₦/night, optional)</Label>
            <Input
              id="price-override"
              type="number"
              min={0}
              step="1"
              value={priceOverride}
              onChange={(event) => setPriceOverride(event.target.value)}
              disabled={selectedDates.length === 0}
              placeholder="Use base price"
            />
          </div>

          <Button
            onClick={() => saveMutation.mutate()}
            disabled={selectedDates.length === 0 || saveMutation.isPending}
            className="mt-2"
          >
            {saveMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
