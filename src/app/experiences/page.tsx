import { EmptyState } from "@/components/patterns/empty-state";

export default function ExperiencesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Experiences</h1>
      <p className="mt-1 text-sm text-ink-muted">Curated things to do — architecture ready to grow.</p>
      <div className="mt-8">
        <EmptyState icon="sparkle" title="No experiences listed yet" description="Curated experiences are on the roadmap." />
      </div>
    </div>
  );
}
