"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  {
    href: "/",
    label: "All",
    icon: "/globe.jpeg",
  },
  {
    href: "/",
    label: "Homes",
    icon: "/house.jpeg",
  },
  {
    href: "/experiences",
    label: "Experiences",
    icon: "/ballon.jpeg",
  },
  {
    href: "/services",
    label: "Services",
    icon: "/bell.jpeg",
  },
];

export function CategoryTabs({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const activeIndex = TABS.findIndex((tab) => tab.href === pathname);

  return (
    <nav
      aria-label="Primary"
      className="flex items-end justify-center gap-12 py-5"
    >
      {TABS.map(({ href, label, icon }, index) => {
        const active = index === activeIndex;

        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "group relative flex flex-col items-center",
              "pt-1 pb-4 px-2",
              "transition-all duration-200",
              active ? "text-[#222222]" : "text-[#6A6A6A] hover:text-[#222222]",
            )}
          >
            <Image
              src={icon}
              alt=""
              width={34}
              height={34}
              priority
              className="mb-3 h-8.5 w-8.5 object-contain transition-transform duration-200 group-hover:scale-105"
            />

            <span
              className={cn(
                "text-sm font-medium whitespace-nowrap",
                active && "font-semibold",
              )}
            >
              {label}
            </span>

            {active && (
              <motion.span
                layoutId={`underline-${variant}`}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }
                }
                className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-full rounded-full bg-[#222222]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
