import type { AmenitySummary } from "@havyn/shared";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon-registry";

/** Mirrors apps/api's V1__init.sql amenity codes — see components/ui/icon-registry.ts. */
const AMENITY_ICONS: Record<string, IconName> = {
  WIFI: "wifi",
  DEDICATED_WORKSPACE: "suitcase",
  KITCHEN: "kitchen",
  WASHER: "washer",
  FREE_PARKING: "parking",
  POOL: "pool",
  AIR_CONDITIONING: "ac",
  HEATING: "heating",
  TV: "tv",
  SELF_CHECK_IN: "selfCheckIn",
  PET_FRIENDLY: "petFriendly",
  GYM: "gym",
  EXTERIOR_SECURITY_CAMERAS: "securityCamera",
  SMOKE_ALARM: "safetyAlarm",
  CARBON_MONOXIDE_ALARM: "safetyAlarm",
  BREAKFAST: "breakfast",
};

export function AmenitiesGrid({ amenities }: { amenities: AmenitySummary[] }) {
  if (amenities.length === 0) {
    return <p className="text-sm text-ink-muted">This host hasn&apos;t listed any amenities yet.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {amenities.map((amenity) => (
        <li key={amenity.code} className="flex items-center gap-3 text-sm text-ink">
          <Icon name={AMENITY_ICONS[amenity.code] ?? "checkCircle"} size={20} className="shrink-0 text-ink-muted" />
          {amenity.name}
        </li>
      ))}
    </ul>
  );
}
