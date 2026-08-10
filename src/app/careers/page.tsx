import { PageHeader } from "@/components/patterns/page-header";
import { Button } from "@/components/ui/button";

const OPENINGS = [
  { role: "Senior Frontend Engineer", team: "Product", location: "Remote / Lagos" },
  { role: "Backend Engineer, Payments", team: "Product", location: "Lagos" },
  { role: "Product Designer", team: "Product", location: "Remote / Lagos" },
  { role: "Trust & Safety Specialist", team: "Operations", location: "Lagos" },
  { role: "Host Success Manager", team: "Growth", location: "Abuja" },
  { role: "Guest Experience Associate", team: "Operations", location: "Lagos" },
  { role: "Marketing Manager", team: "Growth", location: "Lagos" },
  { role: "Data Analyst", team: "Product", location: "Remote" },
  { role: "Customer Support Lead", team: "Operations", location: "Remote / Lagos" },
  { role: "Finance & Payments Associate", team: "Operations", location: "Lagos" },
];


export default function CareersPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Careers"
        title="Build the future of short-lets with us"
        description="We're a small, fast-moving team working on trust, hospitality, and technology together."
      />
      <div className="mx-auto max-w-3xl px-6 py-10 space-y-3">
        {OPENINGS.map((job) => (
          <div key={job.role} className="flex items-center justify-between rounded-2xl border border-line p-4">
            <div>
              <p className="text-sm font-medium text-ink">{job.role}</p>
              <p className="text-xs text-ink-muted">{job.team} · {job.location}</p>
            </div>
            <Button variant="outline" size="sm" className="min-h-11">
              Apply
            </Button>
          </div>
        ))}
        <p className="pt-4 text-center text-sm text-ink-muted">
          Don't see a fit? Reach out anyway at havynvilla@gmail.com.
        </p>
      </div>
    </div>
  );
}