"use client";

import { useCallback, useEffect, useState } from "react";
import { OnboardingDialog } from "./OnboardingDialog";
import { PartnerSidebar, type PartnerView } from "./PartnerSidebar";
import { DashboardView } from "./views/DashboardView";
import { EarningsView } from "./views/EarningsView";
import { MenuView } from "./views/MenuView";
import { OrdersView } from "./views/OrdersView";
import { SettingsView } from "./views/SettingsView";
import { AlertIcon } from "@/components/icons";
import {
  allItemsAvailable,
  INITIAL_PARTNER_MENU,
  INITIAL_PARTNER_ORDERS,
  QUICK_86_ITEMS,
  type KitchenStatus,
  type PartnerMenuItem,
  type PartnerOrder,
} from "@/lib/data/partner";

/** Seconds a new order is held before auto-accept fires. */
const AUTO_ACCEPT_DELAY = 2;
/** Prep window granted when an order is accepted. */
const PREP_WINDOW = 900;

export function PartnerDashboard() {
  const [view, setView] = useState<PartnerView>("dashboard");
  const [orders, setOrders] = useState<PartnerOrder[]>(INITIAL_PARTNER_ORDERS);
  const [menu, setMenu] = useState<PartnerMenuItem[]>(INITIAL_PARTNER_MENU);
  const [kitchenStatus, setKitchenStatus] = useState<KitchenStatus>("open");
  const [autoAccept, setAutoAccept] = useState(false);
  const [soldOut, setSoldOut] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(QUICK_86_ITEMS.map((name) => [name, false])),
  );

  const [onboardingOpen, setOnboardingOpen] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // One second-hand for the whole screen: prep countdowns tick down, and any
  // new order eligible for auto-accept counts itself in.
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((current) =>
        current.map((order) => {
          let next = order;

          if (next.prepSeconds != null && next.prepSeconds > 0) {
            next = { ...next, prepSeconds: next.prepSeconds - 1 };
          }

          if (
            next.status === "new" &&
            autoAccept &&
            allItemsAvailable(next, menu)
          ) {
            const remaining =
              next.autoAcceptIn == null
                ? AUTO_ACCEPT_DELAY
                : next.autoAcceptIn - 1;

            return remaining <= 0
              ? {
                  ...next,
                  status: "preparing",
                  prepSeconds: PREP_WINDOW,
                  courier: "unassigned",
                  autoAcceptIn: undefined,
                }
              : { ...next, autoAcceptIn: remaining };
          }

          // Auto-accept was switched off (or an item sold out) mid-countdown.
          return next.autoAcceptIn != null
            ? { ...next, autoAcceptIn: undefined }
            : next;
        }),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [autoAccept, menu]);

  const accept = useCallback((id: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? {
              ...order,
              status: "preparing",
              prepSeconds: PREP_WINDOW,
              courier: "unassigned",
            }
          : order,
      ),
    );
  }, []);

  const reject = useCallback((id: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? { ...order, status: "cancelled", time: "just now" }
          : order,
      ),
    );
  }, []);

  const toggleMenuItem = useCallback((index: number, available: boolean) => {
    setMenu((current) =>
      current.map((item, i) => (i === index ? { ...item, available } : item)),
    );
  }, []);

  const setItemSoldOut = useCallback((name: string, value: boolean) => {
    setSoldOut((current) => ({ ...current, [name]: value }));
    // The quick-86 list and the menu are the same underlying stock, so keep
    // them in step rather than letting them disagree.
    setMenu((current) =>
      current.map((item) =>
        item.name === name ? { ...item, available: !value } : item,
      ),
    );
  }, []);

  const stepsLeft = 4;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PartnerSidebar view={view} onSelect={setView} />

      <main className="min-w-0 flex-1 px-6 py-6 pb-10 lg:px-10">
        {!onboardingDone && !bannerDismissed && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-[rgba(247,200,115,0.3)] bg-[rgba(247,200,115,0.12)] px-5 py-3.5">
            <p className="flex items-center gap-3 text-[13.5px] font-bold">
              <AlertIcon className="text-accent flex-none" />
              Finish setting up your account — {stepsLeft} steps left
            </p>
            <div className="flex flex-none items-center gap-4">
              <button
                type="button"
                onClick={() => setOnboardingOpen(true)}
                className="bg-accent text-canvas rounded-full px-4.5 py-2.25 text-[13px] font-extrabold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-97"
              >
                Continue setup
              </button>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                aria-label="Dismiss setup reminder"
                className="text-fg-subtle hover:text-fg text-lg leading-none transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {view === "dashboard" && (
          <DashboardView
            orders={orders}
            menu={menu}
            kitchenStatus={kitchenStatus}
            onKitchenStatusChange={setKitchenStatus}
            autoAccept={autoAccept}
            onAutoAcceptChange={setAutoAccept}
            soldOut={soldOut}
            onSoldOutChange={setItemSoldOut}
            onAccept={accept}
            onReject={reject}
          />
        )}
        {view === "orders" && <OrdersView orders={orders} />}
        {view === "menu" && <MenuView menu={menu} onToggle={toggleMenuItem} />}
        {view === "earnings" && <EarningsView />}
        {view === "settings" && <SettingsView />}
      </main>

      <OnboardingDialog
        open={onboardingOpen}
        onComplete={() => {
          setOnboardingOpen(false);
          setOnboardingDone(true);
        }}
        onDismiss={() => setOnboardingOpen(false)}
      />
    </div>
  );
}
