import { PageHeader } from "@/components/patterns/page-header";
import { LegalSection } from "@/components/patterns/legal-section";

export default function HostingResponsiblyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Hosting"
        title="Hosting responsibly"
        description="Guidance to help you host safely, legally, and in a way that's good for your guests and your neighborhood."
      />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <LegalSection title="Know your local regulations">
          <p>
            Short-let and vacation-rental rules vary by city and state. Before listing, check local requirements for
            permits, registration, and any caps on rental duration or number of guests.
          </p>
        </LegalSection>
        <LegalSection title="Be upfront in your listing">
          <p>
            Accurate photos, honest descriptions, and clear house rules set expectations and reduce disputes.
            Disclose anything a guest would reasonably want to know before booking.
          </p>
        </LegalSection>
        <LegalSection title="Respect your neighbors">
          <p>
            Set clear quiet hours, guest limits, and parking guidance in your house rules to keep your property a
            good neighbor to the surrounding community.
          </p>
        </LegalSection>
        <LegalSection title="Keep your property safe">
          <p>
            Working smoke and carbon monoxide detectors, clearly marked exits, and a basic first-aid kit go a long
            way. Consider host liability insurance in addition to Havyn Villa's host protection.
          </p>
        </LegalSection>
        <LegalSection title="Pay your taxes">
          <p>
            Hosting income is generally taxable. Keep records of your earnings and consult a tax professional about
            obligations in your area.
          </p>
        </LegalSection>
      </div>
    </div>
  );
}