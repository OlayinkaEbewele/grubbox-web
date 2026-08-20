import type { Naira } from "@/lib/types";

export interface SavedAddress {
  id: string;
  icon: string;
  label: string;
  type: string;
  detail: string;
}

export interface SavedPayment {
  id: string;
  kind: "card" | "wallet";
  label: string;
  detail: string;
  /** Card network badge text, e.g. VISA. */
  network?: string;
  badgeClass: string;
}

export const PROFILE = {
  name: "Adaeze Okafor",
  initial: "A",
  email: "adaeze.okafor@email.com",
  phone: "+234 802 345 6789",
  tier: "Grub Box Gold Member",
  defaultAddressLabel: "Home",
  ordersToReward: 3,
  totalOrders: 12,
  walletBalance: 12000 as Naira,
  rewardsAvailable: 3,
};

export const SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: "home",
    icon: "🏠",
    label: "Home",
    type: "House",
    detail: "12 Admiralty Way, Lekki Phase 1, Lagos",
  },
  {
    id: "work",
    icon: "💼",
    label: "Work",
    type: "Office",
    detail: "5 Herbert Macaulay Way, Abuja",
  },
];

export const SAVED_PAYMENTS: SavedPayment[] = [
  {
    id: "visa",
    kind: "card",
    label: "Visa ending in 4242",
    detail: "Expires 08/28",
    network: "VISA",
    badgeClass: "bg-[#1A4FA0] text-white",
  },
  {
    id: "mastercard",
    kind: "card",
    label: "Mastercard ending in 8871",
    detail: "Expires 03/27",
    network: "MC",
    badgeClass: "bg-fg text-canvas",
  },
  {
    id: "wallet",
    kind: "wallet",
    label: "Grub Box Wallet",
    detail: "Balance: ₦12,000",
    badgeClass: "bg-surface-alt",
  },
];

/**
 * `action` rows open a dialog instead of navigating. Promotions is one screen
 * that never warranted a route of its own.
 */
export const PROFILE_SETTINGS: {
  icon: string;
  label: string;
  href?: string;
  action?: "promotions";
}[] = [
  { icon: "🔔", label: "Notification preferences", href: "/settings/notifications" },
  { icon: "🔒", label: "Privacy & security", href: "/settings/privacy" },
  { icon: "🎟️", label: "Promotions & offers", action: "promotions" },
  { icon: "❓", label: "Help center", href: "/help" },
];

/**
 * Preset avatars. There's no upload pipeline behind this yet, so the picker
 * offers a fixed set rather than pretending a file input would go anywhere.
 */
export const AVATAR_PRESETS = [
  "🧑‍🍳", "🍜", "🌶️", "🥑", "🍕", "🧋", "🍰", "🥘", "🍤", "🧁", "🥗", "🍩",
] as const;

/** Every Nth completed order earns free delivery on the next one. */
export const FREE_DELIVERY_EVERY = 5;

export const FREE_DELIVERY_CAVEAT =
  "Covers the delivery fee only, on orders over ₦2,000. Service fees and tips still apply.";

export function freeDeliveryProgress(totalOrders: number) {
  const into = totalOrders % FREE_DELIVERY_EVERY;
  // Landing exactly on the boundary means the reward is banked, not pending.
  const remaining = into === 0 ? 0 : FREE_DELIVERY_EVERY - into;
  return { into, remaining, earned: remaining === 0 };
}
