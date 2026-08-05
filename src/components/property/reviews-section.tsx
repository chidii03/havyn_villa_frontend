import { Icon } from "@/components/ui/icon";

export function ReviewsSection({ ratingAvg, ratingCount }: { ratingAvg: number; ratingCount: number }) {
  if (ratingCount === 0) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-dashed border-line p-4">
        <Icon name="star" size={20} className="mt-0.5 shrink-0 text-ink-muted" />
        <div>
          <p className="font-medium text-ink">No reviews yet</p>
          <p className="text-sm text-ink-muted">This listing hasn&apos;t had a completed stay to review yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-ink">
      <Icon name="star" size={20} weight="fill" />
      <span className="text-lg font-semibold tabular-nums">{ratingAvg.toFixed(1)}</span>
      <span className="text-ink-muted">
        · {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
      </span>
    </div>
  );
}
