"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/patterns/page-header";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon-registry";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const CATEGORIES: { name: string; icon: IconName; description: string; href: string }[] = [
  { name: "Booking a stay", icon: "calendarCheck", description: "Search, reserve, and manage your trips.", href: "/trips" },
  { name: "Payments & receipts", icon: "wallet", description: "Charges, refunds, and payment methods.", href: "/help#payments" },
  { name: "Cancellations", icon: "close", description: "Policies and how to cancel a booking.", href: "/cancellation-options" },
  { name: "Safety & trust", icon: "shieldCheck", description: "Verification, security, and safe hosting.", href: "/safety" },
  { name: "Hosting", icon: "house", description: "Listing your property and managing bookings.", href: "/host-resources" },
  { name: "Account", icon: "user", description: "Login, profile, and notification settings.", href: "/help#account" },
];

const FAQS: FaqItem[] = [
  {
    category: "Booking a stay",
    question: "How do I book a property on Havyn Villa?",
    answer:
      "Search for a location and dates, open a listing, choose your check-in and check-out dates and guest count, then select Reserve. Your dates are held while secure checkout opens — once payment succeeds, you'll get a confirmation email with your booking reference.",
  },
  {
    category: "Booking a stay",
    question: "Where can I see my upcoming and past trips?",
    answer: "Go to the Trips page from the main menu to see all your bookings, including dates, host details, and booking reference numbers.",
  },
  {
    category: "Payments & receipts",
    question: "What payment methods are accepted?",
    answer: "Havyn Villa accepts major debit and credit cards, and bank transfer where available, through our secure checkout partner.",
  },
  {
    category: "Payments & receipts",
    question: "When will I get my booking receipt?",
    answer: "A receipt with your full payment breakdown is emailed automatically the moment your booking is confirmed, along with your unique booking reference number.",
  },
  {
    category: "Payments & receipts",
    question: "How long do refunds take?",
    answer: "Approved refunds are issued to your original payment method and typically appear within 5–10 business days, depending on your bank.",
  },
  {
    category: "Cancellations",
    question: "How do I cancel a booking?",
    answer: "Open Trips, select the booking, and choose Cancel booking. Your refund amount depends on the listing's cancellation policy and how close to check-in you cancel.",
  },
  {
    category: "Safety & trust",
    question: "How are hosts verified?",
    answer: "Every host completes identity verification before their first listing can go live, and listings are reviewed against our quality and safety standards before appearing in search.",
  },
  {
    category: "Safety & trust",
    question: "What should I do if something feels wrong during a stay?",
    answer: "Use Report a concern to flag it to our team right away. For anything urgent involving immediate danger, contact local emergency services first.",
  },
  {
    category: "Hosting",
    question: "How do I list my property?",
    answer: "Select Become a host from the main menu, then follow the guided steps to add photos, pricing, availability, and house rules for your listing.",
  },
  {
    category: "Hosting",
    question: "When do hosts get paid?",
    answer: "Payouts are released after a guest checks in, following the payout schedule shown in your Host Dashboard under Earnings.",
  },
  {
    category: "Account",
    question: "How do I reset my password?",
    answer: "From the login screen, select Forgot password and follow the link sent to your registered email address.",
  },
  {
    category: "Account",
    question: "Can I change the email on my account?",
    answer: "Yes — go to your account settings and update your email. You'll need to verify the new address before it becomes active.",
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return FAQS;
    const q = query.toLowerCase();
    return FAQS.filter((faq) => faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <PageHeader
        eyebrow="Support"
        title="Help Center"
        description="Search for an answer, browse a topic, or reach our team directly."
      />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="relative">
          <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for help, e.g. 'refund' or 'cancel booking'"
            className="w-full rounded-full border border-line py-3 pl-11 pr-4 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex items-start gap-3 rounded-2xl border border-line p-4 transition-colors hover:border-brand/40 hover:bg-brand/5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon name={cat.icon} size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{cat.name}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="font-display text-lg font-semibold text-ink">
            {query.trim() ? `Results for "${query}"` : "Frequently asked questions"}
          </h2>

          {filteredFaqs.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">
              No matches found. Try a different search, or contact support below.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-medium text-ink">{faq.question}</span>
                      <Icon
                        name="chevronRight"
                        size={16}
                        className={`shrink-0 text-ink-muted transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4">
                        <p className="text-sm leading-relaxed text-ink-muted">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-muted/40 p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Still need help?</h2>
          <p className="mt-1 text-sm text-ink-muted">Our team and AI assistant are available to help directly.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/messages"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
            >
              <Icon name="guests" size={16} className="text-white" />
              Chat with support
            </Link>
            <Link
              href="/report-a-concern"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-muted"
            >
              <Icon name="warning" size={16} />
              Report a concern
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}