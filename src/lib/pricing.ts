import { SERVICE_FEE } from "@/lib/data";
import type { Coupon, Fulfillment, Naira, OrderTotals } from "@/lib/types";

interface PricingInput {
  subtotal: Naira;
  coupon: Coupon | null;
  fulfillment: Fulfillment;
  /** Restaurant's delivery fee. Waived entirely on pickup. */
  deliveryFee: Naira;
  tipPercent: number;
}

export function calculateTotals({
  subtotal,
  coupon,
  fulfillment,
  deliveryFee,
  tipPercent,
}: PricingInput): OrderTotals {
  const discount = coupon
    ? Math.min(coupon.cap, Math.round((subtotal * coupon.percent) / 100))
    : 0;

  const appliedDelivery = fulfillment === "delivery" ? deliveryFee : 0;
  // Tip is a percentage of the food, not of fees — tipping someone on the
  // service fee would be quietly wrong.
  const tip = Math.round((subtotal * tipPercent) / 100);
  const serviceFee = SERVICE_FEE;

  return {
    subtotal,
    discount,
    deliveryFee: appliedDelivery,
    serviceFee,
    tip,
    total: Math.max(0, subtotal - discount + appliedDelivery + serviceFee + tip),
  };
}

/** Picks the coupon that saves the most on this particular subtotal. */
export function bestCoupon(coupons: Coupon[], subtotal: Naira): Coupon | null {
  if (coupons.length === 0) return null;

  return coupons.reduce((best, candidate) => {
    const bestSaving = Math.min(best.cap, (subtotal * best.percent) / 100);
    const candidateSaving = Math.min(
      candidate.cap,
      (subtotal * candidate.percent) / 100,
    );
    return candidateSaving > bestSaving ? candidate : best;
  });
}

export function discountFor(coupon: Coupon, subtotal: Naira): Naira {
  return Math.min(coupon.cap, Math.round((subtotal * coupon.percent) / 100));
}
