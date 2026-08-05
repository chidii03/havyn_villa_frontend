"use client";

import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";

export function WhenPanel({
  checkIn,
  checkOut,
  onChange,
}: {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onChange: (range: { checkIn: Date | undefined; checkOut: Date | undefined }) => void;
}) {
  const selected: DateRange | undefined = checkIn || checkOut ? { from: checkIn, to: checkOut } : undefined;

  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      selected={selected}
      onSelect={(range) => onChange({ checkIn: range?.from, checkOut: range?.to })}
      disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
      className="p-0"
    />
  );
}
