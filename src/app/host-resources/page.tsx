import { PageHeader } from "@/components/patterns/page-header";
import { Icon } from "@/components/ui/icon";

const RESOURCES = [
  { icon: "house" as const, title: "Creating your first listing", body: "A step-by-step walkthrough of photos, pricing, and house rules that convert browsers into bookings." },
  { icon: "wallet" as const, title: "Pricing your property", body: "How to set a competitive nightly rate using local demand, seasonality, and your property's amenities." },
  { icon: "calendarCheck" as const, title: "Managing your calendar", body: "Keep availability accurate to avoid double-bookings and maintain a strong response rate." },
  { icon: "chartBar" as const, title: "Understanding your earnings", body: "How payouts, service fees, and taxes are calculated and when funds land in your account." },
  { icon: "shieldCheck" as const, title: "Host protection", body: "What's covered if a guest damages your property or violates your house rules." },
  { icon: "chatCircle" as const, title: "Communicating with guests", body: "Templates and tips for pre-arrival messages, check-in instructions, and handling questions." },
];

export default function HostResourcesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Hosting"
        title="Host resources"
        description="Everything you need to list confidently and run a successful short-let on Havyn Villa."
      />
      <div className="mx-auto max-w-5xl px-6 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {RESOURCES.map((r) => (
          <div key={r.title} className="rounded-2xl border border-line p-5">
            <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Icon name={r.icon} size={20} />
            </div>
            <h3 className="mt-3 font-display text-base font-semibold text-ink">{r.title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}