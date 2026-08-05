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
    icon: "/globe.png",
  },
  {
    href: "/",
    label: "Homes",
    icon: "/house.png",
  },
  {
    href: "/experiences",
    label: "Experiences",
    icon: "/ballon.png",
  },
  {
    href: "/services",
    label: "Services",
    icon: "/bell.png",
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
      className="flex items-end justify-center gap-10 pt-6 pb-8 md:gap-14"
    >
      {TABS.map(({ href, label, icon }, index) => {
        const active = index === activeIndex;

        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "group relative flex flex-col items-center",
              "px-2 pt-1",
              "transition-colors duration-200",
              active ? "text-[#222222]" : "text-[#6A6A6A] hover:text-[#222222]",
            )}
          >
            <span className="mb-0.5 block h-10 w-10 overflow-hidden">
              <Image
                src={icon}
                alt=""
                width={36}
                height={36}
                priority
                className={cn(
                  "h-10 w-10 border-0 object-contain outline-none transition-transform duration-200",
                  "group-hover:scale-110",
                  !active && "opacity-70 group-hover:opacity-100",
                )}
              />
            </span>

            <span className="whitespace-nowrap text-sm font-semibold mb-1">
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
                className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-full rounded-full bg-[#222222] mb-0.5"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}