"use client";

import { createPersistentStore, useHydrated, useStore } from "@/lib/store";
import type {
  CartLine,
  Fulfillment,
  OrderStatus,
  OrderTotals,
} from "@/lib/types";

const STORAGE_KEY = "grubbox.orders.v1";

export interface Order {
  id: string;
  restaurantSlug: string;
  restaurantName: string;
  restaurantAddress: string;
  lines: CartLine[];
  totals: OrderTotals;
  fulfillment: Fulfillment;
  paymentMethodId: string;
  couponCode: string | null;
  instructions: string;
  /** ISO timestamp of when the order was placed. */
  placedAt: string;
  /** Minutes from `placedAt` until the promised handover. */
  etaMinutes: number;
  status: OrderStatus;
}

const NO_ORDERS: Order[] = [];

function isOrderList(value: unknown): value is Order[] {
  return Array.isArray(value);
}

const orderStore = createPersistentStore(STORAGE_KEY, NO_ORDERS, isOrderList);

/** Short, human-readable, and unique enough for a mock backend. */
function generateOrderId(): string {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GB-${random}`;
}

export function createOrder(
  draft: Omit<Order, "id" | "placedAt" | "status">,
): Order {
  const order: Order = {
    ...draft,
    id: generateOrderId(),
    placedAt: new Date().toISOString(),
    status: "confirmed",
  };

  orderStore.update((orders) => [order, ...orders]);
  return order;
}

/** Newest first. Empty during hydration — pair with `useOrdersHydrated`. */
export function useOrders(): Order[] {
  return useStore(orderStore);
}

export function useOrder(id: string): Order | null {
  const orders = useStore(orderStore);
  return orders.find((order) => order.id === id) ?? null;
}

export const useOrdersHydrated = useHydrated;
