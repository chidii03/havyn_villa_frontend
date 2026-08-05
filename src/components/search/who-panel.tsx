"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { GuestCounts } from "./types";

const ROWS: { key: keyof GuestCounts; label: string; description: string; min: number }[] = [
  { key: "adults", label: "Adults", description: "Ages 13 or above", min: 0 },
  { key: "children", label: "Children", description: "Ages 2 – 12", min: 0 },
  { key: "infants", label: "Infants", description: "Under 2", min: 0 },
  { key: "pets", label: "Pets", description: "Bringing a service animal?", min: 0 },
];

export function WhoPanel({ value, onChange }: { value: GuestCounts; onChange: (value: GuestCounts) => void }) {
  function step(key: keyof GuestCounts, delta: number, min: number) {
    onChange({ ...value, [key]: Math.max(min, value[key] + delta) });
  }

  return (
    <div className="flex flex-col divide-y divide-line">
      {ROWS.map(({ key, label, description, min }) => (
        <div key={key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
          <div>
            <p className="text-sm font-medium text-ink">{label}</p>
            <p className="text-xs text-ink-muted">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={value[key] <= min}
              onClick={() => step(key, -1, min)}
              aria-label={`Decrease ${label.toLowerCase()}`}
            >
              <Icon name="minus" size={14} />
            </Button>
            <span className="w-4 text-center text-sm tabular-nums" aria-live="polite">
              {value[key]}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => step(key, 1, min)}
              aria-label={`Increase ${label.toLowerCase()}`}
            >
              <Icon name="plus" size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
