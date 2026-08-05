import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Havyn Villa logomark + typeset wordmark.
 *
 * brand/logo-wordmark.svg is NOT used here: it's a leftover export from the
 * superseded green palette (brand/brand-colors.md — "Supersedes the earlier green
 * concept") and would render off-brand. brand/logo.png is the approved Havyn Blue
 * mark, but the source file is a full square lockup (icon + "HAVYN VILLA" wordmark +
 * tagline baked into the same PNG, on a glowing vignette background) with no
 * transparent icon-only export. Rendering that whole square next to a *separately
 * coded* wordmark duplicated the text and read as a stray blur/gap once shrunk small.
 * `/logo-icon.png` is a crop of that same approved asset — just the house/palm/wave
 * glyph, no re-drawn marks — isolating the icon so it can sit at a legible size next
 * to one real wordmark. Brand + naming are DONE per CLAUDE.md; this doesn't invent a
 * new mark, only crops the existing approved one down to its icon.
 */
// logo-icon.png's actual crop dimensions (413x239) — used to keep the aspect ratio
// correct at any render size instead of forcing it into a square and stretching it.
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
