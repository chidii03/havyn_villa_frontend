import { PageHeader } from "@/components/patterns/page-header";
import { LegalSection } from "@/components/patterns/legal-section";

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Havyn Villa collects, uses, and protects your information."
      />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-xs text-ink-muted">Last updated: January 2026</p>

        <LegalSection title="1. Information we collect">
          <p>
            When you create a Havyn Villa account, search for stays, make a booking, or list a property as a host,
            we collect information you provide directly — such as your name, email address, phone number, payment
            details, government ID (for host verification), and messages exchanged with hosts, guests, or our
            support team.
          </p>
          <p>
            We also automatically collect certain data when you use the platform, including device information,
            IP address, browser type, pages visited, and approximate location, to help us secure the platform and
            improve your experience.
          </p>
        </LegalSection>

        <LegalSection title="2. How we use your information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Process bookings, payments, and refunds</li>
            <li>Verify host and guest identities and prevent fraud</li>
            <li>Send booking confirmations, receipts, and important account updates</li>
            <li>Provide customer support, including through our AI assistant</li>
            <li>Improve search relevance, pricing, and platform performance</li>
            <li>Comply with legal obligations in the jurisdictions we operate in</li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Sharing your information">
          <p>
            We share limited booking details (such as your name, check-in dates, and number of guests) with the
            host of a property you book, and share host details with you once a booking is confirmed. We share
            payment information only with our payment processing partners, who are contractually required to keep
            it secure. We do not sell your personal data to third parties.
          </p>
        </LegalSection>

        <LegalSection title="4. Data retention">
          <p>
            We retain booking and payment records for as long as required by tax and financial regulations in the
            relevant jurisdiction, typically up to 7 years. Account information is retained for as long as your
            account is active, and deleted or anonymized within a reasonable period after account closure, subject
            to legal retention requirements.
          </p>
        </LegalSection>

        <LegalSection title="5. Your rights">
          <p>
            Depending on where you live, you may have the right to access, correct, export, or delete your personal
            data, and to object to certain uses of it. To exercise these rights, contact us through the Help Center
            or email privacy@havynvilla.com.
          </p>
        </LegalSection>

        <LegalSection title="6. Security">
          <p>
            We use industry-standard encryption for data in transit and at rest, restrict internal access to
            personal data on a need-to-know basis, and regularly review our systems for vulnerabilities. No system
            is completely secure, and we encourage you to use a strong, unique password for your account.
          </p>
        </LegalSection>

        <LegalSection title="7. Changes to this policy">
          <p>
            We may update this policy from time to time. Material changes will be communicated by email or through
            an in-app notice before they take effect.
          </p>
        </LegalSection>

        <LegalSection title="8. Contact us">
          <p>Questions about this policy can be sent to havynvilla@gmail.com.</p>
        </LegalSection>
      </div>
    </div>
  );
}