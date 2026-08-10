import { PageHeader } from "@/components/patterns/page-header";

const POLICIES = [
  {
    name: "Flexible",
    detail: "Full refund up to 24 hours before check-in. After that, the first night is non-refundable.",
  },
  {
    name: "Moderate",
    detail: "Full refund up to 5 days before check-in. Cancellations within 5 days receive a 50% refund of remaining nights.",
  },
  {
    name: "Strict",
    detail: "50% refund up to 7 days before check-in. No refund for cancellations within 7 days of check-in.",
  },
  {
    name: "Non-refundable",
    detail: "Listings booked at a discounted non-refundable rate are not eligible for a refund, except where required by law.",
  },
];

export default function CancellationOptionsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Bookings"
        title="Cancellation options"
        description="Every listing on Havyn Villa uses one of the policies below, shown clearly before you book."
      />
      <div className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        {POLICIES.map((policy) => (
          <div key={policy.name} className="rounded-2xl border border-line p-5">
            <h2 className="font-display text-base font-semibold text-ink">{policy.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">{policy.detail}</p>
          </div>
        ))}

        <div className="rounded-2xl bg-muted/40 p-5 text-sm text-ink-muted">
          <p>
            To cancel a booking, go to <a href="/trips" className="text-brand hover:underline">Trips</a>, select the
            reservation, and choose Cancel booking. Refunds are issued to your original payment method and can take
            5–10 business days to appear, depending on your bank.
          </p>
        </div>
      </div>
    </div>
  );
}