"use client";

import { useState } from "react";
import { PageHeader } from "@/components/patterns/page-header";
import { Button } from "@/components/ui/button";

const CONCERN_TYPES = [
  "Listing doesn't match description",
  "Safety or security issue",
  "Host or guest behavior",
  "Payment or refund problem",
  "Suspected fraud or scam",
  "Something else",
];

export default function ReportAConcernPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <PageHeader
        eyebrow="Trust & Safety"
        title="Report a concern"
        description="Let us know what happened and our team will follow up, usually within 24 hours."
      />
      <div className="mx-auto max-w-2xl px-6 py-10">
        {submitted ? (
          <div className="rounded-2xl border border-line p-6 text-center">
            <h2 className="font-display text-lg font-semibold text-ink">Thanks — we've got it</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Our team will review your report and reach out if we need more information.
            </p>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div>
              <label className="block text-sm font-medium text-ink" htmlFor="concern-type">
                Type of concern
              </label>
              <select id="concern-type" required className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm">
                {CONCERN_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink" htmlFor="booking-ref">
                Booking reference (if applicable)
              </label>
              <input
                id="booking-ref"
                type="text"
                placeholder="e.g. HV-2026-000482"
                className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink" htmlFor="details">
                What happened?
              </label>
              <textarea
                id="details"
                required
                rows={5}
                className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm"
                placeholder="Share as much detail as you can."
              />
            </div>
            <Button type="submit" className="w-full">
              Submit report
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}