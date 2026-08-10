import { PageHeader } from "@/components/patterns/page-header";

export default function InvestorsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Investors"
        title="Investor relations"
        description="Information for current and prospective investors in Havyn Villa."
      />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm leading-relaxed text-ink-muted">
          Havyn Villa is building the trusted layer for short-let hospitality across Nigeria. For investor
          inquiries, partnership opportunities, or to request our latest company overview, please reach out to
          havynvilla@gmail.com.
        </p>
      </div>
    </div>
  );
}