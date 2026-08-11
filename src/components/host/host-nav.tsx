"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/host", label: "Overview" },
  { href: "/host/listings", label: "Listings" },
  { href: "/host/reservations", label: "Reservations" },
  { href: "/host/earnings", label: "Earnings" },
] as const;

export function HostNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Host dashboard" className="flex flex-wrap gap-1 border-b border-line">
      {LINKS.map((link) => {
        const active = link.href === "/host" ? pathname === "/host" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "min-h-11 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "border-brand text-brand" : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
