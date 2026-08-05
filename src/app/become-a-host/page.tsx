"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon-registry";
import { becomeHost } from "@/lib/api/host";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

const VALUE_PROPS: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "calendarCheck",
    title: "You're in control",
    description: "Set your own price, availability, and house rules. Block dates and adjust pricing any time.",
  },
  {
    icon: "shieldCheck",
    title: "Verified guests",
    description: "Every guest goes through Havyn Villa before they can book — no surprises at check-in.",
  },
  {
    icon: "chartBar",
    title: "Track your earnings",
    description: "A dashboard for reservations, payouts, and performance, built for hosts running a real business.",
  },
];


export default function BecomeAHostPage() {
  const { status, user, accessToken, applySession } = useAuth();
  const router = useRouter();
  const isHost = user?.roles.includes("HOST") ?? false;

  const becomeHostMutation = useMutation({
    mutationFn: () => becomeHost(accessToken!),
    onSuccess: (session) => {
      applySession(session);
      toast.success("You're a host now!");
      router.push("/host");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError && error.code === "EMAIL_NOT_VERIFIED"
          ? "Verify your email before you can host — check your inbox for the link."
          : "Couldn't set up hosting. Please try again.",
      );
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 px-6 py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="font-display text-4xl font-semibold text-ink">Host on Havyn Villa</h1>
        <p className="max-w-lg text-lg text-ink-muted">
          Turn your space into an income stream. List short-lets, apartments, or villas and reach
          travelers looking for something better than a hotel.
        </p>

        {status === "authenticated" && isHost && (
          <LinkButton href="/host" size="lg" className="mt-2 px-6">
            Go to dashboard
          </LinkButton>
        )}
        {status === "authenticated" && !isHost && (
          <>
            <Button size="lg" className="mt-2 px-6" onClick={() => becomeHostMutation.mutate()} disabled={becomeHostMutation.isPending}>
              {becomeHostMutation.isPending ? "Setting up…" : "Become a host"}
            </Button>
            <p className="text-xs text-ink-muted">Requires a verified email.</p>
          </>
        )}
        {status !== "authenticated" && (
          <LinkButton href="/signup" size="lg" className="mt-2 px-6">
            Get started
          </LinkButton>
        )}
      </div>

      <div className="grid w-full gap-6 text-left sm:grid-cols-3">
        {VALUE_PROPS.map(({ icon, title, description }) => (
          <div key={title} className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted">
              <Icon name={icon} size={16} weight="duotone" active />
            </span>
            <h2 className="font-semibold text-ink">{title}</h2>
            <p className="text-sm text-ink-muted">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
