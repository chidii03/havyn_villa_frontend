import Link from "next/link";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Safety", href: "/safety" },
      { label: "Cancellation options", href: "/cancellation-options" },
      { label: "Report a concern", href: "/report-a-concern" },
    ],
  },
  {
    title: "Hosting",
    links: [
      { label: "Become a host", href: "/become-a-host" },
      { label: "Host resources", href: "/host-resources" },
      { label: "Community forum", href: "/community-forum" },
      { label: "Hosting responsibly", href: "/hosting-responsibly" },
    ],
  },
  {
    title: "Havyn Villa",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Newsroom", href: "/newsroom" },
      { label: "Investors", href: "/investors" },
    ],
  },
];

/** frontend/03-ui-and-navigation-spec.md#1.4 — every link real (no href="#"). */
export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-3">
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-ink">{column.title}</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line mb-15 sm:mb-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Havyn Villa · Stay beautiful, live
            better.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
            <Link href="/sitemap" className="hover:text-ink">
              Sitemap
            </Link>
            <span>English (NGN) · NGN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}