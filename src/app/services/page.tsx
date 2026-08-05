import { EmptyState } from "@/components/patterns/empty-state";

export default function ServicesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Services</h1>
      <p className="mt-1 text-sm text-ink-muted">Curated services to help you grow.</p>
      <div className="mt-8">
        <EmptyState icon="sparkle" title="No services listed yet" description="Curated services are on the roadmap." />
      </div>
    </div>
  );
}
