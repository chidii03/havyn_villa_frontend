/** `en-NG` renders NGN as "₦50,000" — no manual symbol concatenation (which is what causes the cramped "N0"-looking renders CLAUDE.md warns about elsewhere). */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
