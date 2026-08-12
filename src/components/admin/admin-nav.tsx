"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/properties", label: "Listings" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/emails", label: "Emails" },
  { href: "/admin/support-tickets", label: "Support" },
  { href: "/admin/verification-requests", label: "KYC" },
  { href: "/admin/disputes", label: "Disputes" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/audit-log", label: "Audit log" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin platform" className="flex flex-wrap gap-1 border-b border-line">
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(link.href);
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
