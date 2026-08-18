import type { Naira } from "./types";

/** ₦3,200 — grouped, no decimals. */
export function formatNaira(amount: Naira): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

/** 3,200 — for places where the ₦ is already rendered separately. */
export function formatAmount(amount: Naira): string {
  return amount.toLocaleString("en-NG");
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
