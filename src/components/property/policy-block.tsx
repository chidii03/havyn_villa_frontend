const CANCELLATION_LABELS: Record<string, string> = {
  FLEXIBLE: "Flexible — full refund up to 24 hours before check-in.",
  MODERATE: "Moderate — full refund up to 5 days before check-in.",
  STRICT: "Strict — 50% refund up to 7 days before check-in.",
};

export function PolicyBlock({
  houseRules,
  cancellationPolicy,
}: {
  houseRules: string | null;
  cancellationPolicy: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-ink">House rules</h3>
        <p className="mt-1 text-sm whitespace-pre-line text-ink-muted">
          {houseRules ?? "This host hasn't listed any house rules."}
        </p>
      </div>
      <div>
        <h3 className="font-medium text-ink">Cancellation policy</h3>
        <p className="mt-1 text-sm text-ink-muted">
          {CANCELLATION_LABELS[cancellationPolicy] ?? cancellationPolicy}
        </p>
      </div>
    </div>
  );
}
