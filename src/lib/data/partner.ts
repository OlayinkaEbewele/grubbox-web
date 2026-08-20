import type { Naira } from "@/lib/types";

export type PartnerOrderStatus = "new" | "preparing" | "delivered" | "cancelled";

export type CourierState =
  | "unassigned"
  | "enroute"
  | "arrived"
  | "delivered"
  | "none";

export interface PartnerOrderItem {
  name: string;
  quantity: number;
  note?: string;
}

export interface PartnerOrder {
  id: string;
  status: PartnerOrderStatus;
  items: PartnerOrderItem[];
  total: Naira;
  courier: CourierState;
  /** Minutes out, when the courier is en route. */
  courierMinutes?: number;
  /** Countdown to handover. Ticks down once accepted. */
  prepSeconds?: number;
  /** Seconds until auto-accept fires, while the toggle is on. */
  autoAcceptIn?: number;
  /** Relative timestamp for completed orders. */
  time?: string;
}

export const MENU_SECTIONS = ["Mains", "Sides", "Drinks", "Desserts"] as const;
export type MenuSectionName = (typeof MENU_SECTIONS)[number];

/**
 * A choice within an option group, priced as a delta on the dish. Zero is a
 * normal value — "Regular" size costs nothing extra but is still a choice.
 */
export interface MenuOptionChoice {
  id: string;
  name: string;
  priceDelta: Naira;
}

/**
 * A modifier group on a dish. `min`/`max` carry the selection rule:
 * min 1 makes the group required, max 1 makes it a radio rather than
 * checkboxes.
 */
export interface MenuOptionGroup {
  id: string;
  name: string;
  min: number;
  max: number;
  choices: MenuOptionChoice[];
}

export interface PartnerMenuItem {
  /** Stable across renames — options and orders reference this, not the name. */
  id: string;
  name: string;
  price: Naira;
  available: boolean;
  section: MenuSectionName;
  description?: string;
  optionGroups: MenuOptionGroup[];
}

export function isRequired(group: MenuOptionGroup): boolean {
  return group.min > 0;
}

/** "Required · pick 1", "Optional · up to 3" — the rule in one line. */
export function optionRuleLabel(group: MenuOptionGroup): string {
  const prefix = isRequired(group) ? "Required" : "Optional";
  if (group.max === 1) return `${prefix} · pick 1`;
  if (group.min === group.max) return `${prefix} · pick ${group.min}`;
  return `${prefix} · up to ${group.max}`;
}

export interface Payout {
  date: string;
  bank: string;
  amount: Naira;
}

export const INITIAL_PARTNER_ORDERS: PartnerOrder[] = [
  {
    id: "GB-4821",
    status: "new",
    items: [
      { name: "Jollof Rice & Chicken", quantity: 2 },
      { name: "Fried Plantain", quantity: 1, note: "No onions" },
    ],
    total: 6200,
    courier: "unassigned",
  },
  {
    id: "GB-4819",
    status: "preparing",
    items: [{ name: "Suya Skewers", quantity: 3 }],
    total: 3400,
    courier: "enroute",
    courierMinutes: 4,
    prepSeconds: 260,
  },
  {
    id: "GB-4815",
    status: "preparing",
    items: [
      { name: "Egusi Soup & Pounded Yam", quantity: 2 },
      { name: "Chapman", quantity: 2 },
    ],
    total: 11800,
    courier: "arrived",
    prepSeconds: 70,
  },
  {
    id: "GB-4810",
    status: "delivered",
    items: [
      { name: "Jollof Rice & Chicken", quantity: 1 },
      { name: "Chapman", quantity: 1 },
    ],
    total: 5600,
    courier: "delivered",
    time: "1 hr ago",
  },
  {
    id: "GB-4807",
    status: "delivered",
    items: [
      { name: "Pepper Soup", quantity: 1 },
      { name: "Fried Plantain", quantity: 2 },
    ],
    total: 8900,
    courier: "delivered",
    time: "2 hr ago",
  },
  {
    id: "GB-4802",
    status: "cancelled",
    items: [{ name: "Suya Skewers", quantity: 1 }],
    total: 2700,
    courier: "none",
    time: "3 hr ago",
  },
];

export const INITIAL_PARTNER_MENU: PartnerMenuItem[] = [
  {
    id: "dish-jollof",
    name: "Jollof Rice & Chicken",
    price: 3200,
    available: true,
    section: "Mains",
    description: "Smoky party jollof with grilled chicken.",
    optionGroups: [
      {
        id: "grp-jollof-size",
        name: "Size",
        min: 1,
        max: 1,
        choices: [
          { id: "opt-regular", name: "Regular", priceDelta: 0 },
          { id: "opt-large", name: "Large", priceDelta: 800 },
        ],
      },
      {
        id: "grp-jollof-addons",
        name: "Add-ons",
        min: 0,
        max: 3,
        choices: [
          { id: "opt-extra-chicken", name: "Extra chicken", priceDelta: 1200 },
          { id: "opt-plantain", name: "Fried plantain", priceDelta: 800 },
          { id: "opt-moimoi", name: "Moi moi", priceDelta: 600 },
        ],
      },
    ],
  },
  {
    id: "dish-plantain",
    name: "Fried Plantain",
    price: 800,
    available: true,
    section: "Sides",
    optionGroups: [],
  },
  {
    id: "dish-suya",
    name: "Suya Skewers",
    price: 2500,
    available: true,
    section: "Mains",
    description: "Beef skewers rolled in yaji spice.",
    optionGroups: [
      {
        id: "grp-suya-heat",
        name: "Heat",
        min: 1,
        max: 1,
        choices: [
          { id: "opt-mild", name: "Mild", priceDelta: 0 },
          { id: "opt-medium", name: "Medium", priceDelta: 0 },
          { id: "opt-hot", name: "Hot", priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: "dish-pepper-soup",
    name: "Pepper Soup",
    price: 3800,
    available: false,
    section: "Mains",
    optionGroups: [],
  },
  {
    id: "dish-chapman",
    name: "Chapman",
    price: 1500,
    available: true,
    section: "Drinks",
    optionGroups: [],
  },
  {
    id: "dish-egusi",
    name: "Egusi Soup & Pounded Yam",
    price: 4200,
    available: true,
    section: "Mains",
    optionGroups: [],
  },
];

/**
 * The short list a kitchen is most likely to 86 mid-service, by dish id — not
 * name, so renaming a dish in the editor can't quietly detach it from here.
 */
export const QUICK_86_IDS = ["dish-jollof", "dish-suya", "dish-chapman", "dish-egusi"];

export const PAYOUTS: Payout[] = [
  { date: "Aug 1, 2026", bank: "GTBank · 0123456789", amount: 1840200 },
  { date: "Jul 1, 2026", bank: "GTBank · 0123456789", amount: 1620000 },
  { date: "Jun 1, 2026", bank: "GTBank · 0123456789", amount: 1910450 },
];

export const WEEK_ORDERS: [day: string, count: number][] = [
  ["Mon", 60],
  ["Tue", 75],
  ["Wed", 50],
  ["Thu", 90],
  ["Fri", 100],
  ["Sat", 120],
  ["Sun", 85],
];

export const LAST_WEEK_ORDERS = [55, 68, 58, 80, 88, 105, 78];

export const MONTH_EARNINGS: [month: string, value: number][] = [
  ["Mar", 70],
  ["Apr", 85],
  ["May", 60],
  ["Jun", 95],
  ["Jul", 78],
  ["Aug", 100],
];

export const SPARKLINE_ORDERS = "0,26 12,20 24,22 36,14 48,16 60,8 70,4";
export const SPARKLINE_EARNINGS = "0,24 12,22 24,16 36,18 48,10 60,12 70,4";

export type KitchenStatus = "open" | "busy" | "paused";

export const KITCHEN_STATUS: Record<
  KitchenStatus,
  { label: string; short: string; description: string; tone: string; dot: string }
> = {
  open: {
    label: "Open for orders",
    short: "Open",
    description: "Accepting orders normally",
    tone: "bg-[rgba(74,222,128,0.15)] text-success",
    dot: "bg-success",
  },
  busy: {
    label: "Busy · +15 min prep",
    short: "Busy",
    description: "+15 min added to prep time on all items",
    tone: "bg-[rgba(247,200,115,0.15)] text-accent",
    dot: "bg-accent",
  },
  paused: {
    label: "Paused for 30 min",
    short: "Pause orders — 30 min",
    description: "Kitchen overwhelmed? Stop new orders temporarily",
    tone: "bg-[rgba(248,113,113,0.15)] text-danger",
    dot: "bg-danger",
  },
};

export const PARTNER_PROFILE = {
  name: "Bukka Hut",
  address: "14 Admiralty Way, Lekki Phase 1",
  opens: "9:00 AM",
  closes: "10:00 PM",
  bank: "GTBank · 0123456789",
  rating: 4.9,
  reviews: 312,
  totalMenuItems: 24,
  ordersThisWeek: 142,
  ordersDelta: "12%",
  earningsThisWeek: 612300,
  earningsDelta: "8%",
  availableBalance: 238900,
  earningsThisMonth: 2140600,
};

export function summarizeItems(items: PartnerOrderItem[]): string {
  return items.map((item) => `${item.quantity}× ${item.name}`).join(", ");
}

export function formatCountdown(seconds: number): string {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  return `${String(minutes).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

export function courierLabel(order: PartnerOrder): string {
  switch (order.courier) {
    case "unassigned":
      return "Courier: not assigned yet";
    case "enroute":
      return `Driver: en route (${order.courierMinutes} min away)`;
    case "arrived":
      return "Driver: arrived";
    case "delivered":
      return "Delivered";
    default:
      return "—";
  }
}

/** An order can only auto-accept when every line is still in stock. */
export function allItemsAvailable(
  order: PartnerOrder,
  menu: PartnerMenuItem[],
): boolean {
  // Orders still carry item names (that's what the customer ordered), so the
  // lookup is by name — but the menu's own identity is its id, so a rename
  // only ever affects matching, never which dish a toggle refers to.
  const availability = new Map(menu.map((item) => [item.name, item.available]));
  return order.items.every((item) => availability.get(item.name) !== false);
}
