"use client";

import { useCallback } from "react";
import { createPersistentStore, useHydrated, useStore } from "@/lib/store";

const STORAGE_KEY = "grubbox.notifications.read.v1";

export type NotificationKind = "order" | "promo" | "account";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** Minutes ago, so the list stays plausible without a server clock. */
  minutesAgo: number;
  href?: string;
}

/**
 * Placeholder feed. A real one arrives per-user from the server; what's local
 * is only which ids have been read, so the badge survives a reload.
 */
export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n-1",
    kind: "order",
    title: "Your rider is close",
    body: "Tunde is about 8 minutes away with your Mama Cass Kitchen order.",
    minutesAgo: 4,
    href: "/orders",
  },
  {
    id: "n-2",
    kind: "promo",
    title: "20% off at Mama Cass Kitchen",
    body: "Your favourite spot has a discount running until Sunday.",
    minutesAgo: 90,
    href: "/restaurants/mama-cass-kitchen",
  },
  {
    id: "n-3",
    kind: "order",
    title: "Order delivered",
    body: "How was it? Rate your order and help other people order well.",
    minutesAgo: 180,
    href: "/orders",
  },
  {
    id: "n-4",
    kind: "account",
    title: "You're 3 orders from free delivery",
    body: "Order three more times this month to unlock a month of free delivery.",
    minutesAgo: 1440,
    href: "/profile",
  },
];

export function formatAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  const days = Math.floor(minutes / 1440);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}

type ReadIds = string[];

const NONE: ReadIds = [];

function isReadIds(value: unknown): value is ReadIds {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

const readStore = createPersistentStore(STORAGE_KEY, NONE, isReadIds);

interface NotificationsValue {
  notifications: AppNotification[];
  unreadCount: number;
  hydrated: boolean;
  isRead(id: string): boolean;
  markRead(id: string): void;
  markAllRead(): void;
}

export function useNotifications(): NotificationsValue {
  const readIds = useStore(readStore);
  const hydrated = useHydrated();

  const markRead = useCallback((id: string) => {
    readStore.update((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }, []);

  const markAllRead = useCallback(() => {
    readStore.set(NOTIFICATIONS.map((n) => n.id));
  }, []);

  return {
    notifications: NOTIFICATIONS,
    // Before hydration the count is 0, so the badge never flashes a number the
    // server couldn't have known.
    unreadCount: hydrated
      ? NOTIFICATIONS.filter((n) => !readIds.includes(n.id)).length
      : 0,
    hydrated,
    isRead: (id) => readIds.includes(id),
    markRead,
    markAllRead,
  };
}
