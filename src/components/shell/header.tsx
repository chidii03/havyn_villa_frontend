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
    let frame = 0;

    function onScroll() {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const nextScrolled = window.scrollY > 24;
        setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
      });
    }

    setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const isHome = pathname === "/";
  const showExpandedSearch = isHome && !scrolled;

  return (
    <header className="sticky top-0 z-1200 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" aria-label="Havyn Villa home" className="shrink-0">
          <Logo />
        </Link>

        {isHome && (
          <div
            aria-hidden={!showExpandedSearch}
            className={[
              "hidden origin-center lg:block",
              "transition-[opacity,transform,width] duration-200 ease-out",
              showExpandedSearch ? "w-auto scale-100 opacity-100" : "w-0 scale-95 overflow-hidden opacity-0",
            ].join(" ")}
          >
            <CategoryTabs />
          </div>
        )}

        <div
          aria-hidden={showExpandedSearch}
          className={[
            "hidden min-w-0 justify-center overflow-hidden md:flex",
            "transition-[opacity,transform,flex-basis] duration-200 ease-out",
            showExpandedSearch
              ? "pointer-events-none basis-0 flex-none -translate-y-1 opacity-0"
              : "basis-auto flex-1 translate-y-0 opacity-100",
          ].join(" ")}
        >
          <div className="w-full max-w-lg">
            <SearchBar variant="compact" />
          </div>
        </div>

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

      {isHome && (
        <div
          aria-hidden={!showExpandedSearch}
          className={[
            "mx-auto hidden max-w-6xl justify-center overflow-hidden px-4 md:flex",
            "transition-[max-height,opacity,transform,padding-bottom] duration-200 ease-out",
            showExpandedSearch ? "max-h-24 translate-y-0 pb-5 opacity-100" : "pointer-events-none max-h-0 -translate-y-2 pb-0 opacity-0",
          ].join(" ")}
        >
          <div className="w-full max-w-3xl">
            <SearchBar variant="expanded" />
          </div>
        </div>
      )}

      {isHome && (
        <div
          aria-hidden={!showExpandedSearch}
          className={[
            "overflow-hidden border-t border-line lg:hidden",
            "transition-[max-height,opacity,transform] duration-200 ease-out",
            showExpandedSearch ? "max-h-32 translate-y-0 opacity-100" : "pointer-events-none max-h-0 -translate-y-2 opacity-0",
          ].join(" ")}
        >
          <div className="mx-auto flex max-w-6xl justify-center px-2">
            <CategoryTabs variant="mobile" />
          </div>
        </div>
      )}
    </header>
  );
}
