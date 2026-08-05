"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Fades + slides content in on mount. Honors prefers-reduced-motion (CLAUDE.md#3) by
 * dropping straight to the resting state instead of animating.
 */
export function MotionFadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
