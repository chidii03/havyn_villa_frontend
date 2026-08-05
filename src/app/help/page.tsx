import { EmptyState } from "@/components/patterns/empty-state";

/** Placeholder target for the footer/profile-menu links that reference it (spec §1.4/§1.1). */
export default function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="sr-only">Help Center</h1>
      <EmptyState icon="lifebuoy" title="Help Center is coming soon" description="In the meantime, reach us through your booking or account page." />
    </div>
  );
}
