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
      className="
        grid
        w-full
        max-w-full
        grid-cols-4
        items-end
        overflow-hidden
        px-0
        pt-4
        pb-5
        sm:pt-5
        sm:pb-6
        md:pt-6
        md:pb-8
      "
    >
      {TABS.map(({ href, label, icon }, index) => {
        const active = index === activeIndex;

        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "group relative flex min-w-0 w-full flex-col items-center justify-end",
              "px-0 py-1",
              "transition-colors duration-200",
              active
                ? "text-[#222222]"
                : "text-[#6A6A6A] hover:text-[#222222]",
            )}
          >
            {/* Icon */}
            <span
              className="
                mb-0.5
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                overflow-hidden
                sm:h-9
                sm:w-9
                md:h-10
                md:w-10
              "
            >
              <Image
                src={icon}
                alt=""
                width={36}
                height={36}
                priority
                className={cn(
                  "h-8 w-8 border-0 object-contain outline-none",
                  "transition-transform duration-200",
                  "sm:h-9 sm:w-9",
                  "md:h-10 md:w-10",
                  "group-hover:scale-110",
                  !active && "opacity-70 group-hover:opacity-100",
                )}
              />
            </span>

            {/* Label */}
            <span
              className="
                mb-1
                max-w-full
                truncate
                whitespace-nowrap
                px-0.5
                text-[11px]
                font-semibold
                leading-tight
                sm:text-xs
                md:text-sm
              "
            >
              {label}
            </span>

            {/* Active indicator */}
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
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-0.5
                  w-[calc(100%-8px)]
                  -translate-x-1/2
                  rounded-full
                  bg-[#222222]
                  sm:w-[calc(100%-12px)]
                  md:w-[calc(100%-16px)]
                "
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}