import { PageHeader } from "@/components/patterns/page-header";
import { Icon } from "@/components/ui/icon";

const SAFETY_ITEMS = [
  {
    icon: "shieldCheck" as const,
    title: "Verified hosts and listings",
    body: "Every host completes identity verification before their first listing goes live, and listings are reviewed against our quality and safety standards.",
  },
  {
    icon: "lifebuoy" as const,
    title: "24/7 support",
    body: "Our support team and AI assistant are available around the clock to help with urgent issues during a stay, from lockouts to safety concerns.",
  },
  {
    icon: "wallet" as const,
    title: "Secure payments",
    body: "All payments are processed through encrypted, PCI-compliant checkout. Never pay a host directly outside the Havyn Villa platform.",
  },
  {
    icon: "chatCircle" as const,
    title: "In-platform messaging",
    body: "Keep booking-related conversations on Havyn Villa so there's a record we can refer to if a dispute or safety concern comes up.",
  },
];

export default function SafetyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Trust & Safety"
        title="Safety at Havyn Villa"
        description="We build safeguards into every step of booking and hosting, from verification to 24/7 support."
      />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {SAFETY_ITEMS.map((item) => (
            <div key={item.title} className="rounded-2xl border border-line p-5">
              <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon name={item.icon} size={20} />
              </div>
              <h3 className="mt-3 font-display text-base font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-muted/40 p-6">
          <h2 className="font-display text-lg font-semibold text-ink">In an emergency</h2>
          <p className="mt-2 text-sm text-ink-muted">
            If you or someone else is in immediate danger, contact local emergency services first. Once you're
            safe, let us know through{" "}
            <a href="/report-a-concern" className="text-brand hover:underline">
              Report a concern
            </a>{" "}
            so we can follow up and take any necessary action on the listing or account involved.
          </p>
        </div>
      </div>
    </div>
  );
}