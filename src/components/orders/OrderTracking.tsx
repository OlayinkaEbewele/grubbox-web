"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { OrderTrackingSkeleton } from "@/components/orders/OrderSkeletons";
import { CheckIcon, ScooterIcon } from "@/components/icons";
import { DEFAULT_ADDRESS } from "@/lib/data";
import { useOrder, useOrdersHydrated } from "@/lib/orders";
import { cn } from "@/lib/cn";

const RIDER = {
  name: "Tunde A.",
  rating: "4.9",
  vehicle: "Honda · ABJ 442 KL",
  minutesAway: 8,
};

type MapView = "driver" | "route";

function clockAt(placedAt: string, offsetMinutes: number) {
  const time = new Date(placedAt);
  time.setMinutes(time.getMinutes() + offsetMinutes);
  // en-NG defaults to a 24-hour clock, which renders midnight as "0:07".
  // The designed timeline reads "12:04 PM", so ask for 12-hour explicitly.
  return time
    .toLocaleTimeString("en-NG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\b(am|pm)\b/i, (meridiem) => meridiem.toUpperCase());
}

export function OrderTracking({ orderId }: { orderId: string }) {
  const order = useOrder(orderId);
  const hydrated = useOrdersHydrated();
  const [view, setView] = useState<MapView>("route");

  if (!hydrated) {
    return (
      <div className="shell max-w-app pt-page-top pb-page-bottom">
        <OrderTrackingSkeleton />
      </div>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto flex w-full max-w-focus flex-1 flex-col items-center justify-center px-6 py-section text-center">
        <h1 className="font-display text-fg mb-3 text-3xl">
          We can&rsquo;t find that order
        </h1>
        <ButtonLink href="/browse" size="lg">
          Browse food
        </ButtonLink>
      </main>
    );
  }

  const timeline = [
    { label: "Order placed", time: clockAt(order.placedAt, 0), done: true },
    { label: "Restaurant preparing", time: clockAt(order.placedAt, 3), done: true },
    { label: "Rider picked up order", time: clockAt(order.placedAt, 18), done: true },
    {
      label: `On the way — ${RIDER.minutesAway} mins`,
      time: `Arriving ~${clockAt(order.placedAt, order.etaMinutes)}`,
      done: false,
    },
  ];

  return (
    <>
      <main className="shell max-w-app flex flex-1 flex-col items-start gap-8 pt-page-top pb-page-bottom lg:flex-row">
        {/* Map ------------------------------------------------------------- */}
        <div className="w-full min-w-0 flex-1">
          <div className="bg-surface-alt relative h-[520px] overflow-hidden rounded-[28px]">
            <div
              role="radiogroup"
              aria-label="Map view"
              className="absolute top-4 left-4 z-5 inline-flex rounded-full bg-white/95 p-1.25 shadow-[0_6px_16px_-8px_rgba(0,0,0,0.4)]"
            >
              {(
                [
                  { value: "driver", label: "📍 Driver view" },
                  { value: "route", label: "🗺️ Full route" },
                ] as const
              ).map((option) => {
                const selected = view === option.value;
                return (
                  <button
                    key={option.value}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setView(option.value)}
                    className={cn(
                      "rounded-full px-4.5 py-2.25 text-[13.5px] font-extrabold whitespace-nowrap transition-colors duration-200",
                      selected ? "bg-primary text-canvas" : "text-fg-subtle",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {/* Stylised map. Zooming the whole layer keeps the markers pinned
                to the streets instead of drifting. */}
            <div
              className="absolute inset-0 origin-[50%_55.5%] transition-transform duration-500 ease-[var(--ease-in-out-strong)]"
              style={{ transform: view === "driver" ? "scale(2.3)" : "scale(1)" }}
            >
              <svg
                viewBox="0 0 600 360"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <line x1="0" y1="80" x2="600" y2="70" stroke="#26262C" strokeWidth="4" />
                <line x1="0" y1="220" x2="600" y2="230" stroke="#26262C" strokeWidth="4" />
                <line x1="140" y1="0" x2="120" y2="360" stroke="#26262C" strokeWidth="4" />
                <line x1="420" y1="0" x2="440" y2="360" stroke="#26262C" strokeWidth="4" />
                <path
                  d="M120 320 Q 300 200 460 90"
                  stroke="var(--color-primary)"
                  strokeWidth="4"
                  strokeDasharray="10 8"
                  fill="none"
                />
              </svg>

              {/* Restaurant */}
              <div className="absolute top-[85.5%] left-[20%] -translate-x-1/2 -translate-y-1/2">
                <div className="bg-fg text-canvas flex size-8.5 rotate-[-45deg] items-center justify-center rounded-[10px_10px_10px_2px] shadow-[0_4px_10px_-2px_rgba(0,0,0,0.4)]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="rotate-45"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 21h18M6 21V10l6-6 6 6v11"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path d="M10 21v-6h4v6" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </div>
              </div>

              {/* Rider */}
              <div className="rider-pulse absolute top-[55.5%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex size-12.5 rotate-[-45deg] items-center justify-center rounded-[50%_50%_50%_4px] border-[3px] border-white bg-[linear-gradient(145deg,#FF8354,#C9A3FF)] shadow-[0_8px_18px_-4px_rgba(0,0,0,0.6)]">
                  <ScooterIcon size={24} className="rotate-45 text-white" />
                </div>
              </div>

              {/* Destination */}
              <div className="absolute top-[25%] left-[76.7%] -translate-x-1/2 -translate-y-full">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 22s7-7.58 7-13A7 7 0 0 0 5 9c0 5.42 7 13 7 13Z"
                    fill="var(--color-fg)"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="9" r="2.6" fill="var(--color-canvas)" />
                </svg>
              </div>
            </div>

            <p className="text-canvas absolute right-4 bottom-25 rounded-full bg-white/95 px-3.5 py-2 text-[13px] font-extrabold whitespace-nowrap shadow-[0_6px_16px_-8px_rgba(0,0,0,0.4)]">
              🛵 {RIDER.name.split(" ")[0]} is {RIDER.minutesAway} mins away
            </p>

            <div className="bg-surface absolute inset-x-5 bottom-5 flex items-center gap-4 rounded-[20px] p-4.5 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)]">
              <span
                aria-hidden="true"
                className="bg-surface-alt flex size-13 flex-none items-center justify-center rounded-full text-[22px]"
              >
                🧑🏾
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-extrabold">{RIDER.name}</p>
                <p className="text-fg-subtle text-[12.5px]">
                  ★ {RIDER.rating} · Rider · {RIDER.vehicle}
                </p>
              </div>
              <Link
                href={`/orders/${order.id}/call`}
                aria-label={`Call ${RIDER.name}`}
                className="bg-surface-2 flex size-10.5 flex-none items-center justify-center rounded-full transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-95"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z"
                    stroke="#fff"
                    strokeWidth="1.7"
                  />
                </svg>
              </Link>
              <Link
                href={`/orders/${order.id}/message`}
                aria-label={`Message ${RIDER.name}`}
                className="bg-surface-3 flex size-10.5 flex-none items-center justify-center rounded-full transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-95"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="var(--color-fg)"
                    strokeWidth="1.7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Status ----------------------------------------------------------- */}
        <aside className="border-hairline bg-surface w-full flex-none rounded-3xl border-2 p-6 lg:sticky lg:top-6 lg:w-75">
          <h2 className="mb-4.5 text-[15px] font-extrabold">Order status</h2>

          <ol className="mb-5">
            {timeline.map((entry, index) => (
              <li key={entry.label} className="flex gap-4">
                <div className="flex flex-none flex-col items-center">
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full text-white",
                      entry.done ? "bg-success" : "bg-primary",
                    )}
                  >
                    {entry.done && <CheckIcon size={14} />}
                  </span>
                  {index < timeline.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "my-1 min-h-6 w-0.5 flex-1",
                        index < timeline.length - 2 ? "bg-success" : "bg-hairline",
                      )}
                    />
                  )}
                </div>
                <div className="pb-5">
                  <p
                    className={cn(
                      "text-[14.5px] font-extrabold",
                      entry.done ? "text-fg" : "text-primary",
                    )}
                  >
                    {entry.label}
                  </p>
                  <p className="text-fg-subtle text-[12.5px]">{entry.time}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href={`/orders/${order.id}/share`}
            className="bg-surface-3 text-fg hover:bg-surface-alt mb-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-[13.5px] font-extrabold transition-colors duration-150 active:scale-98"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            Share Live Tracking
          </Link>

          <div className="bg-hairline mb-5 h-px" />

          <p className="text-fg-subtle text-[13px] leading-relaxed">
            {order.fulfillment === "delivery" ? "Deliver to " : "Pick up from "}
            <strong className="text-fg">
              {order.fulfillment === "delivery"
                ? DEFAULT_ADDRESS.line
                : order.restaurantAddress}
            </strong>
          </p>
        </aside>
      </main>
    </>
  );
}
