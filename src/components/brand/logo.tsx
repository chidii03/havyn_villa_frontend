import Image from "next/image";
import { cn } from "@/lib/utils";

const ICON_ASPECT_RATIO = 413 / 239;

export function Logo({ className, size = 32  }: { className?: string; size?: number }) {
  const width = Math.round(size * ICON_ASPECT_RATIO);

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Image
        src="/logo-icon.png"
        alt=""
        height={size}
        width={width}
        style={{ height: size, width }}
        priority
      />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className="font-display text-xl font-bold text-ink">Havyn</span>
        <span className="text-xs font-bold tracking-[0.2em] text-ink-muted uppercase">
          Villa
        </span>
      </span>
    </span>
  );
}
