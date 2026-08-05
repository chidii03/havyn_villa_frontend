import Link from "next/link";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Safety", href: "/help" },
      { label: "Cancellation options", href: "/help" },
      { label: "Report a concern", href: "/help" },
    ],
  },
  {
    title: "Hosting",
    links: [
      { label: "Become a host", href: "/become-a-host" },
      { label: "Host resources", href: "/help" },
      { label: "Community forum", href: "/help" },
      { label: "Hosting responsibly", href: "/help" },
    ],
  },
  {
    title: "Havyn Villa",
    links: [
      { label: "About", href: "/help" },
      { label: "Careers", href: "/help" },
      { label: "Newsroom", href: "/help" },
      { label: "Investors", href: "/help" },
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
                  <Link href={link.href} className="text-sm text-ink-muted transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Havyn Villa · Stay beautiful, live better.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/help" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/help" className="hover:text-ink">
              Terms
            </Link>
            <Link href="/help" className="hover:text-ink">
              Sitemap
            </Link>
            <span>English (NGN) · NGN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
