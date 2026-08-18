/** Money is kept in whole naira. Nigeria has no circulating subunit, so there
 *  is no minor-unit conversion to get wrong. */
export type Naira = number;

export type PriceLevel = "₦" | "₦₦" | "₦₦₦";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: Naira;
  image: string;
}

export interface MenuSection {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface Restaurant {
  slug: string;
  name: string;
  cuisine: string;
  /** First word of `cuisine`, used to pick the card's ambient gradient. */
  cuisineKey: string;
  rating: number;
  reviewCount: string;
  deliveryTime: string;
  deliveryFee: Naira;
  minimumOrder: Naira;
  openHours: string;
  address: string;
  promo?: string;
  /** Whether the kitchen offers collection as well as delivery. */
  pickup: boolean;
  /** 24-hour opening window, used by the "Open now" filter. */
  opensAt: number;
  closesAt: number;
  priceLevel: PriceLevel;
  image: string;
  cover: string;
  menu: MenuSection[];
  /** Cross-sell rail on the detail page. */
  pairings: MenuItem[];
}

export interface CartLine {
  itemId: string;
  name: string;
  price: Naira;
  image: string;
  quantity: number;
}

export interface Cart {
  restaurantSlug: string | null;
  lines: CartLine[];
}

export type Fulfillment = "delivery" | "pickup";

export interface Coupon {
  code: string;
  /** Percentage off the subtotal. */
  percent: number;
  /** Maximum naira the coupon will ever take off. */
  cap: Naira;
}

export interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
}

export type OrderStatus =
  | "confirmed"
  | "preparing"
  | "picked-up"
  | "delivered";

export interface OrderTotals {
  subtotal: Naira;
  discount: Naira;
  deliveryFee: Naira;
  serviceFee: Naira;
  tip: Naira;
  total: Naira;
}
