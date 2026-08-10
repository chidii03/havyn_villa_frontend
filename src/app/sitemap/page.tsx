import Link from "next/link";
import { PageHeader } from "@/components/patterns/page-header";

const SECTIONS = [
  { title: "Explore", links: [{ label: "Search stays", href: "/" }, { label: "Wishlist", href: "/wishlist" }, { label: "Trips", href: "/trips" }] },
  { title: "Support", links: [{ label: "Help Center", href: "/help" }, { label: "Safety", href: "/safety" }, { label: "Cancellation options", href: "/cancellation-options" }, { label: "Report a concern", href: "/report-a-concern" }] },
  { title: "Hosting", links: [{ label: "Become a host", href: "/host/listings" }, { label: "Host resources", href: "/host-resources" }, { label: "Community forum", href: "/community-forum" }, { label: "Hosting responsibly", href: "/hosting-responsibly" }] },
  { title: "Havyn Villa", links: [{ label: "About", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Newsroom", href: "/newsroom" }, { label: "Investors", href: "/investors" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
];

export default function SitemapPage() {
  return (
    <div>
      <PageHeader eyebrow="Havyn Villa" title="Sitemap" description="Every page on Havyn Villa, in one place." />
      <div className="mx-auto max-w-5xl px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-sm font-semibold text-ink">{section.title}</h2>
            <ul className="mt-3 space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-muted hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}