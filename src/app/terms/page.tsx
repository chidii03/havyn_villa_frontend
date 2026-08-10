import { PageHeader } from "@/components/patterns/page-header";
import { LegalSection } from "@/components/patterns/legal-section";

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="The terms that govern your use of Havyn Villa."
      />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-xs text-ink-muted">Last updated: January 2026</p>

        <LegalSection title="1. Acceptance of terms">
          <p>
            By creating an account or using Havyn Villa, you agree to these Terms of Service and our Privacy
            Policy. If you do not agree, please do not use the platform.
          </p>
        </LegalSection>

        <LegalSection title="2. Who can use Havyn Villa">
          <p>
            You must be at least 18 years old and able to form a legally binding contract to book a stay or list a
            property. By using the platform you confirm that all information you provide is accurate and that you
            will keep it up to date.
          </p>
        </LegalSection>

        <LegalSection title="3. Bookings and payments">
          <p>
            When you reserve a property, your dates are held while payment is processed through our secure
            checkout. A booking is confirmed once payment succeeds, at which point a confirmation email with your
            booking reference is sent to you. Prices, fees, and taxes shown at checkout are final unless the host
            or platform issues an adjustment.
          </p>
        </LegalSection>

        <LegalSection title="4. Cancellations and refunds">
          <p>
            Cancellation terms are set per listing and shown before you complete a booking. Refund eligibility
            depends on the applicable cancellation policy and how close to check-in the cancellation is made. See
            our{" "}
            <a href="/cancellation-options" className="text-brand hover:underline">
              Cancellation options
            </a>{" "}
            page for details.
          </p>
        </LegalSection>

        <LegalSection title="5. Host responsibilities">
          <p>
            Hosts are responsible for the accuracy of their listings, maintaining the property in the condition
            described, and complying with local short-let and hosting regulations. Havyn Villa reserves the right
            to suspend or remove listings that violate these terms or our hosting standards.
          </p>
        </LegalSection>

        <LegalSection title="6. Guest conduct">
          <p>
            Guests are expected to treat properties and hosts with respect, follow house rules, and report any
            issues promptly through Havyn Villa rather than resolving disputes outside the platform, so we can help
            protect both parties.
          </p>
        </LegalSection>

        <LegalSection title="7. Platform role">
          <p>
            Havyn Villa provides the platform connecting guests and hosts and facilitates payments, but is not a
            party to the rental agreement between guest and host. We are not responsible for the condition of a
            property beyond what is reasonably verifiable through our listing standards.
          </p>
        </LegalSection>

        <LegalSection title="8. Limitation of liability">
          <p>
            To the maximum extent permitted by law, Havyn Villa is not liable for indirect, incidental, or
            consequential damages arising from your use of the platform, beyond amounts you have paid to us for
            the relevant booking.
          </p>
        </LegalSection>

        <LegalSection title="9. Changes to these terms">
          <p>
            We may update these terms periodically. Continued use of Havyn Villa after changes take effect
            constitutes acceptance of the revised terms.
          </p>
        </LegalSection>

        <LegalSection title="10. Contact us">
          <p>For questions about these terms, contact havynvilla@gmail.com.</p>
        </LegalSection>
      </div>
    </div>
  );
}