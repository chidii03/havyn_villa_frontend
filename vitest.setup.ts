import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Without these, DOM from one test (RTL doesn't auto-unmount under Vitest the way it
// does under Jest) and vi.fn() call history both leak into the next test in the same
// file — surfaced as flaky "toHaveBeenCalled" assertions and ghost elements from a
// previous test's render.
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// jsdom doesn't implement matchMedia; framer-motion's useReducedMotion() (used by
// MotionFadeIn) and future prefers-color-scheme checks need it.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom doesn't implement scroll methods (throws "Not implemented") — CardCarousel,
// CategoryChips, CarouselRow, and Gallery's touch/arrow navigation all call these on
// plain elements (not window), so every test that renders them needs a no-op stub.
if (typeof Element !== "undefined") {
  Element.prototype.scrollTo = vi.fn();
  Element.prototype.scrollBy = vi.fn();
}

