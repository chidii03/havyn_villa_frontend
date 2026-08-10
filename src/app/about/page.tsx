import { PageHeader } from "@/components/patterns/page-header";

const VALUES = [
  { title: "Beautiful stays", body: "We hold every listing to a standard of quality, comfort, and honest presentation." },
  { title: "Trust, built in", body: "Verification, secure payments, and responsive support at every step of a stay." },
  { title: "Rooted locally", body: "Built for the way people travel and host across Nigeria's cities and beyond." },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Havyn Villa"
        title="Stay beautiful, live better."
        description="Havyn Villa connects travelers with beautifully kept short-let homes, and helps hosts turn their properties into a trusted source of income."
      />
      <div className="mx-auto max-w-3xl px-6 py-10 space-y-10">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Our story</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Havyn Villa started with a simple observation: finding a genuinely well-kept, trustworthy short-let
            shouldn't be a gamble. We set out to build a platform where every listing is verified, every booking is
            protected, and every host and guest can trust the process from search to check-out.
          </p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">What we believe</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-line p-4">
                <h3 className="font-display text-sm font-semibold text-ink">{v.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}