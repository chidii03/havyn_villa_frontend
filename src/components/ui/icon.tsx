import type { IconWeight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ICON_REGISTRY, type IconName } from "./icon-registry";

export interface IconProps {
  name: IconName;
  size?: number;
  /** "duotone"/"fill" for the premium nav/key-action treatment; "regular" elsewhere. */
  weight?: IconWeight;
  /** Brand-blue when true, ink-muted otherwise — the one active/selected/focus color rule. */
  active?: boolean;
  /** Only set this for icons that convey meaning on their own (not decorating labelled text). */
  title?: string;
  className?: string;
}

/**
 * The only way app code should render an icon — see icon-registry.ts. Decorative by
 * default (aria-hidden); pass `title` for icons that are themselves the accessible
 * name of a control.
 */
export function Icon({ name, size = 20, weight = "regular", active = false, title, className }: IconProps) {
  const PhosphorIcon = ICON_REGISTRY[name];

  return (
    <PhosphorIcon
      size={size}
      weight={weight}
      className={cn(active ? "text-brand" : "text-ink-muted", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
    />
  );
}
