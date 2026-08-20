import type { Naira } from "@/lib/types";

export interface Offer {
  code: string;
  title: string;
  detail: string;
  /** Human-readable expiry — placeholder until a server owns the clock. */
  expires: string;
  tint: string;
  icon: string;
}

export const OFFERS: Offer[] = [
  {
    code: "GRUB10",
    title: "10% off your next order",
    detail: "Up to ₦800 off. Minimum order ₦2,000.",
    expires: "Expires Sunday",
    tint: "bg-[rgba(201,163,255,0.15)] text-primary",
    icon: "🎟️",
  },
  {
    code: "BESTPRICE",
    title: "8% off at selected kitchens",
    detail: "Up to ₦1,000 off across 40+ restaurants.",
    expires: "Expires in 5 days",
    tint: "bg-[rgba(247,200,115,0.15)] text-accent",
    icon: "🔥",
  },
  {
    code: "WELCOME5",
    title: "5% off — welcome back",
    detail: "Up to ₦1,500 off your first order this month.",
    expires: "Expires end of month",
    tint: "bg-[rgba(74,222,128,0.15)] text-success",
    icon: "👋",
  },
];

export const GRUB_PASS = {
  name: "Grub Pass",
  monthlyPrice: 2500 as Naira,
  blurb: "Free delivery on every order over ₦2,000, from any Grub Pass kitchen.",
  perks: [
    "Free delivery on orders over ₦2,000",
    "Priority support when something goes wrong",
    "Member-only discounts every week",
    "Cancel any time — no lock-in",
  ],
};
