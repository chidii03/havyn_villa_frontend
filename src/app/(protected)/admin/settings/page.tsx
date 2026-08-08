"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { PlatformSettingSummary } from "@havyn/shared";
import { ErrorState } from "@/components/patterns/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { listSettings, updateSetting } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

/** Commissions/settings are configurable data, never hardcoded. */
export default function AdminSettingsPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => listSettings(accessToken!),
    enabled: Boolean(accessToken),
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => updateSetting(accessToken!, key, value),
    onSuccess: () => {
      toast.success("Setting updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Couldn't update that setting."),
  });

  if (settingsQuery.isLoading) {
    return (
      <div className="max-w-3xl space-y-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (settingsQuery.isError) {
    return <ErrorState title="Couldn't load settings" description="Please try again in a moment." onRetry={() => settingsQuery.refetch()} />;
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink">Platform controls</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Changes apply immediately to new quotes and booking attempts. Existing bookings keep the amounts they were created with.
        </p>
      </div>

      <ul className="space-y-4">
        {(settingsQuery.data ?? []).map((setting) => (
          <SettingRow
            key={setting.key}
            setting={setting}
            onSave={(value) => updateMutation.mutate({ key: setting.key, value })}
            pending={updateMutation.isPending && updateMutation.variables?.key === setting.key}
          />
        ))}
      </ul>
    </div>
  );
}

function SettingRow({ setting, onSave, pending }: { setting: PlatformSettingSummary; onSave: (value: string) => void; pending: boolean }) {
  const [value, setValue] = useState(setting.value);
  const metadata = SETTING_METADATA[setting.key] ?? {
    title: setting.key,
    description: "Advanced platform setting.",
    input: "text" as const,
  };
  const dirty = value !== setting.value;
  const invalid = metadata.input === "percent" && !isValidPercent(value);

  return (
    <li className="rounded-xl border border-line bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Label htmlFor={`setting-${setting.key}`} className="text-base font-semibold text-ink">
              {metadata.title}
            </Label>
            <Badge variant="outline">{setting.key}</Badge>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-muted">{metadata.description}</p>
        </div>
        {setting.key === "bookings_enabled" && (
          <Badge variant={value === "true" ? "default" : "secondary"}>{value === "true" ? "Accepting bookings" : "Bookings paused"}</Badge>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {metadata.input === "boolean" ? (
          <label className="flex min-h-11 items-center gap-3 rounded-lg border border-line px-3">
            <Checkbox checked={value === "true"} onCheckedChange={(checked) => setValue(checked ? "true" : "false")} />
            <span className="text-sm font-medium text-ink">Allow new bookings</span>
          </label>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              id={`setting-${setting.key}`}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              inputMode={metadata.input === "percent" ? "decimal" : "text"}
              className="max-w-40"
            />
            {metadata.input === "percent" && <span className="text-sm font-medium text-ink-muted">%</span>}
          </div>
        )}
        <Button type="button" size="sm" className="min-h-11" disabled={!dirty || pending || invalid} onClick={() => onSave(value)}>
          {pending ? "Saving..." : "Save"}
        </Button>
        {dirty && (
          <Button type="button" variant="outline" size="sm" className="min-h-11" disabled={pending} onClick={() => setValue(setting.value)}>
            Reset
          </Button>
        )}
      </div>
      {invalid && <p className="mt-2 text-sm text-danger">Enter a percentage from 0 to 100.</p>}
    </li>
  );
}

const SETTING_METADATA: Record<string, { title: string; description: string; input: "percent" | "boolean" | "text" }> = {
  commission_pct: {
    title: "Platform commission",
    description:
      "The percentage Havyn Villa keeps from each confirmed booking. For example, 12.00 means a 12% platform commission; host payout is the booking total minus this commission.",
    input: "percent",
  },
  bookings_enabled: {
    title: "Booking availability",
    description:
      "Emergency kill switch for new booking attempts. Turn this off during payment, inventory, or maintenance incidents; existing bookings are not cancelled.",
    input: "boolean",
  },
};

function isValidPercent(value: string) {
  const number = Number(value);
  return value.trim() !== "" && Number.isFinite(number) && number >= 0 && number <= 100;
}
