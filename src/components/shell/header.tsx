"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { SearchBar } from "@/components/search/search-bar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CategoryTabs } from "./category-tabs";
import { ProfileMenu } from "./profile-menu";

/**
 * Sticky, condenses on scroll — frontend/03-ui-and-navigation-spec.md#1.1. On the
 * home route at the top of the page it shows the full expanded search bar under the
 * tabs; scrolling (or any other route) condenses it into the compact pill in the
 * header row. Mobile gets a search icon that opens the full search in a bottom sheet.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      const nextScrolled = window.scrollY > 24;
      setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showExpandedSearch = pathname === "/" && !scrolled;

  return (
    <header className="sticky top-0 z-1200 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" aria-label="Havyn Villa home" className="shrink-0">
          <Logo />
        </Link>

        {showExpandedSearch && (
          <div className="hidden lg:block">
            <CategoryTabs />
          </div>
        )}

        {!showExpandedSearch && (
          <div className="hidden min-w-0 flex-1 justify-center md:flex">
            <div className="w-full max-w-lg">
              <SearchBar variant="compact" />
            </div>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/become-a-host"
            className="hidden min-h-11 items-center px-2 text-sm font-medium text-ink transition-colors hover:text-brand md:flex"
          >
            Become a host
          </Link>

          <Sheet>
            <SheetTrigger
              render={<Button variant="outline" size="icon" className="rounded-full md:hidden" aria-label="Search" />}
            >
              <Icon name="search" size={16} />
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Search stays</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <SearchBar variant="expanded" />
              </div>
            </SheetContent>
          </Sheet>

          <ProfileMenu />
        </div>
      </div>

      {showExpandedSearch && (
        <div className="mx-auto hidden max-w-6xl justify-center px-4 pb-5 md:flex">
          <div className="w-full max-w-3xl">
            <SearchBar variant="expanded" />
          </div>
        </div>
      )}

      {showExpandedSearch && (
        <div className="border-t border-line lg:hidden">
          <div className="mx-auto flex max-w-6xl justify-center px-2">
            <CategoryTabs variant="mobile" />
          </div>
        </div>
      )}
    </header>
  );
}
