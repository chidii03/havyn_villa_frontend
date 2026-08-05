"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { PlatformSettingSummary } from "@havyn/shared";
import { ErrorState } from "@/components/patterns/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { listSettings, updateSetting } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

/** Commissions/settings are configurable data, never hardcoded — see project-docs/prompts/18-admin-platform.md. */
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
      <div className="space-y-3 max-w-sm">
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (settingsQuery.isError) {
    return <ErrorState title="Couldn't load settings" description="Please try again in a moment." onRetry={() => settingsQuery.refetch()} />;
  }

  return (
    <ul className="max-w-sm space-y-4">
      {(settingsQuery.data ?? []).map((setting) => (
        <SettingRow
          key={setting.key}
          setting={setting}
          onSave={(value) => updateMutation.mutate({ key: setting.key, value })}
          pending={updateMutation.isPending && updateMutation.variables?.key === setting.key}
        />
      ))}
    </ul>
  );
}

function SettingRow({ setting, onSave, pending }: { setting: PlatformSettingSummary; onSave: (value: string) => void; pending: boolean }) {
  const [value, setValue] = useState(setting.value);
  const dirty = value !== setting.value;

  return (
    <li className="rounded-xl border border-line p-4">
      <Label htmlFor={`setting-${setting.key}`}>{setting.key}</Label>
      <div className="mt-2 flex items-center gap-2">
        <Input id={`setting-${setting.key}`} value={value} onChange={(event) => setValue(event.target.value)} className="max-w-[10rem]" />
        <Button type="button" size="sm" className="min-h-11" disabled={!dirty || pending} onClick={() => onSave(value)}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </li>
  );
}
