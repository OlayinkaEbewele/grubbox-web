"use client";

import Link from "next/link";
import { useState } from "react";
import { Panel, StatCard, StatusBadge } from "@/components/partner/Panel";
import { Toggle } from "@/components/ui/Toggle";
import { ChevronDownIcon, ClockIcon } from "@/components/icons";
import {
  allItemsAvailable,
  courierLabel,
  formatCountdown,
  KITCHEN_STATUS,
  LAST_WEEK_ORDERS,
  PARTNER_PROFILE,
  SPARKLINE_EARNINGS,
  SPARKLINE_ORDERS,
  summarizeItems,
  WEEK_ORDERS,
  type KitchenStatus,
  type PartnerMenuItem,
  type PartnerOrder,
} from "@/lib/data/partner";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";

const BAR_WIDTH = 28;
const GAP = (280 - BAR_WIDTH * 7) / 6;
const CHART_HEIGHT = 110;
const BASELINE = 130;

interface DashboardViewProps {
  orders: PartnerOrder[];
  menu: PartnerMenuItem[];
  kitchenStatus: KitchenStatus;
  onKitchenStatusChange: (status: KitchenStatus) => void;
  autoAccept: boolean;
  onAutoAcceptChange: (value: boolean) => void;
  soldOut: Record<string, boolean>;
  onSoldOutChange: (name: string, value: boolean) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export function DashboardView({
  orders,
  menu,
  kitchenStatus,
  onKitchenStatusChange,
  autoAccept,
  onAutoAcceptChange,
  soldOut,
  onSoldOutChange,
  onAccept,
  onReject,
}: DashboardViewProps) {
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const live = orders.filter(
    (order) => order.status === "new" || order.status === "preparing",
  );
  const recent = orders.filter(
    (order) => order.status === "delivered" || order.status === "cancelled",
  );

  const status = KITCHEN_STATUS[kitchenStatus];
  const maxWeek = Math.max(...WEEK_ORDERS.map(([, value]) => value));
  const maxLastWeek = Math.max(...LAST_WEEK_ORDERS);

  const lastWeekPoints = LAST_WEEK_ORDERS.map(
    (value, index) =>
      `${index * (BAR_WIDTH + GAP) + BAR_WIDTH / 2},${
        BASELINE - Math.round((value / maxLastWeek) * CHART_HEIGHT)
      }`,
  ).join(" ");

  return (
    <div>
      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display mb-1 text-[28px]">
            Welcome, {PARTNER_PROFILE.name}
          </h1>
          <p className="text-fg-subtle text-sm">
            Here&rsquo;s how your restaurant is doing this week
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setStatusMenuOpen((open) => !open)}
            aria-expanded={statusMenuOpen}
            aria-haspopup="menu"
            className={cn(
              "flex items-center gap-2.5 rounded-full px-4 py-2.25 text-[13px] font-extrabold",
              status.tone,
            )}
          >
            <span className={cn("size-2 rounded-full", status.dot)} />
            {status.label}
            <ChevronDownIcon />
          </button>

          {statusMenuOpen && (
            <>
              {/* Click-away catcher. Sits under the menu, over everything else. */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setStatusMenuOpen(false)}
                aria-hidden="true"
              />
              <div
                role="menu"
                className="bg-surface border-hairline absolute top-11 right-0 z-20 w-70 rounded-2xl border-2 p-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.4)]"
              >
                {(Object.keys(KITCHEN_STATUS) as KitchenStatus[]).map((key) => {
                  const option = KITCHEN_STATUS[key];
                  return (
                    <button
                      key={key}
                      role="menuitem"
                      onClick={() => {
                        onKitchenStatusChange(key);
                        setStatusMenuOpen(false);
                      }}
                      className="hover:bg-surface-3 flex w-full items-start gap-2.5 rounded-xl p-3 text-left transition-colors duration-150"
                    >
                      <span
                        className={cn("mt-1 size-2.25 flex-none rounded-full", option.dot)}
                      />
                      <span>
                        <span className="text-fg block text-[13.5px] font-extrabold">
                          {option.short}
                        </span>
                        <span className="text-fg-subtle block text-xs">
                          {option.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats ------------------------------------------------------------- */}
      <div className="mb-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Orders this week"
          value={String(PARTNER_PROFILE.ordersThisWeek)}
          delta={PARTNER_PROFILE.ordersDelta}
        >
          <Sparkline points={SPARKLINE_ORDERS} className="stroke-primary" />
        </StatCard>

        <StatCard
          label="Earnings this week"
          value={formatNaira(PARTNER_PROFILE.earningsThisWeek)}
          delta={PARTNER_PROFILE.earningsDelta}
        >
          <Sparkline points={SPARKLINE_EARNINGS} className="stroke-success" />
        </StatCard>

        <StatCard
          label="Rating"
          value={`${PARTNER_PROFILE.rating} ★`}
          caption={`${PARTNER_PROFILE.reviews} reviews`}
        />

        <StatCard
          label="Menu items"
          value={String(PARTNER_PROFILE.totalMenuItems)}
          caption={`${menu.filter((item) => item.available).length} available`}
        />
      </div>

      {/* Live feed ---------------------------------------------------------- */}
      <div className="mb-3.5 flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="mb-1 text-[17px] font-extrabold">Live order feed</h2>
          <p className="text-fg-subtle text-[13px]">
            New and in-progress orders needing attention
          </p>
        </div>
        <div className="bg-surface-alt border-hairline flex flex-none items-center rounded-full border-2 py-2 pr-2 pl-4">
          <Toggle
            checked={autoAccept}
            onChange={onAutoAcceptChange}
            label="Auto-accept orders with items in stock"
            showLabel
          />
        </div>
      </div>

      <ul className="mb-8 flex flex-col gap-3">
        {live.map((order) => {
          const isNew = order.status === "new";
          const autoAccepting =
            isNew && autoAccept && allItemsAvailable(order, menu);

          return (
            <li
              key={order.id}
              className={cn(
                "bg-surface-alt flex flex-wrap items-center gap-5 rounded-[18px] border-2 p-4.5 px-5.5",
                isNew ? "border-primary" : "border-hairline",
              )}
            >
              {isNew && (
                <span
                  aria-hidden="true"
                  className="soundwave flex flex-none items-center gap-0.75"
                >
                  <span className="bg-primary block h-4 w-1 rounded-sm" />
                  <span className="bg-primary block h-4 w-1 rounded-sm" />
                  <span className="bg-primary block h-4 w-1 rounded-sm" />
                </span>
              )}

              <div className="min-w-40 flex-1">
                <p className="text-[15px] font-extrabold">
                  #{order.id} · {summarizeItems(order.items)}
                </p>
                <p className="text-fg-subtle mt-0.5 text-[12.5px]">
                  {formatNaira(order.total)} · {courierLabel(order)}
                </p>
              </div>

              {isNew && !autoAccepting && (
                <div className="flex flex-none gap-2.5">
                  <button
                    type="button"
                    onClick={() => onReject(order.id)}
                    className="bg-surface-3 text-danger rounded-full border-2 border-[rgba(248,113,113,0.35)] px-4.5 py-2.5 text-[13px] font-extrabold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-97"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => onAccept(order.id)}
                    className="bg-success text-canvas rounded-full px-5 py-2.5 text-[13px] font-extrabold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-97"
                  >
                    Accept order
                  </button>
                </div>
              )}

              {autoAccepting && (
                <p className="text-success flex flex-none items-center gap-2 rounded-full bg-[rgba(74,222,128,0.12)] px-4 py-2 text-[13px] font-extrabold">
                  ✓ Auto-accepting — all items in stock
                </p>
              )}

              {!isNew && (
                <p
                  className={cn(
                    "flex flex-none items-center gap-2 rounded-full px-4 py-2 text-[13px] font-extrabold tabular-nums",
                    prepTone(order.prepSeconds),
                  )}
                >
                  ⏳{" "}
                  {order.prepSeconds != null
                    ? formatCountdown(order.prepSeconds)
                    : "—"}{" "}
                  remaining
                </p>
              )}
            </li>
          );
        })}

        {live.length === 0 && (
          <li className="bg-surface-alt border-hairline text-fg-subtle rounded-[18px] border-2 p-8 text-center text-[13.5px]">
            No active orders right now.
          </li>
        )}
      </ul>

      {/* Chart + quick 86 ---------------------------------------------------- */}
      <div className="mb-8 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <Panel className="p-6">
          <h2 className="mb-1 text-sm font-extrabold">Orders — last 7 days</h2>
          <p className="text-fg-subtle mb-4.5 text-xs">
            Solid = this week · dotted = last week
          </p>

          <svg
            viewBox="0 0 280 150"
            preserveAspectRatio="none"
            className="mb-1.5 h-37.5 w-full"
            role="img"
            aria-label={`Orders per day this week: ${WEEK_ORDERS.map(([day, value]) => `${day} ${value}`).join(", ")}`}
          >
            <polyline
              points={lastWeekPoints}
              fill="none"
              stroke="#4A3E63"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            {WEEK_ORDERS.map(([day, value], index) => {
              const height = Math.round((value / maxWeek) * CHART_HEIGHT);
              const x = index * (BAR_WIDTH + GAP);
              const isLatest = index === WEEK_ORDERS.length - 1;
              return (
                <g key={day}>
                  <rect
                    x={x}
                    y={BASELINE - height}
                    width={BAR_WIDTH}
                    height={height}
                    rx="5"
                    fill={isLatest ? "var(--color-primary)" : "#4A3E63"}
                  />
                  <text
                    x={x + BAR_WIDTH / 2}
                    y={BASELINE - height - 8}
                    fill="var(--color-fg-muted)"
                    fontSize="10"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {value}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mb-3.5 flex justify-between px-0.5">
            {WEEK_ORDERS.map(([day]) => (
              <span
                key={day}
                className="text-fg-subtle flex-1 text-center text-[11.5px] font-bold"
              >
                {day}
              </span>
            ))}
          </div>

          <p className="text-primary flex items-center gap-2 rounded-xl bg-[rgba(201,163,255,0.1)] px-3.5 py-2.5 text-[12.5px] font-bold">
            <ClockIcon size={14} className="flex-none" />
            Peak traffic expected 1:00 PM – 2:30 PM
          </p>
        </Panel>

        <Panel className="p-6">
          <h2 className="mb-4.5 text-sm font-extrabold">
            Quick 86 — mark sold out today
          </h2>
          <ul className="flex flex-col gap-2.5">
            {Object.keys(soldOut).map((name) => (
              <li
                key={name}
                className="bg-surface-3 flex items-center justify-between gap-3 rounded-xl p-3 px-3.5"
              >
                <span
                  className={cn(
                    "text-[13.5px] font-bold",
                    soldOut[name] ? "text-fg-subtle line-through" : "text-fg",
                  )}
                >
                  {name}
                </span>
                <Toggle
                  checked={soldOut[name]}
                  onChange={(value) => onSoldOutChange(name, value)}
                  label={`Mark ${name} sold out`}
                  size="sm"
                  tone="danger"
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Recent ------------------------------------------------------------- */}
      <h2 className="mb-4 text-[17px] font-extrabold">Recent orders</h2>
      <Panel className="overflow-hidden">
        <ul>
          {recent.map((order) => {
            const isOpen = expanded === order.id;
            return (
              <li key={order.id}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 border-b border-white/6 px-5.5 py-4 text-left"
                >
                  <span className="min-w-0">
                    <span className="text-fg block text-[14.5px] font-bold">
                      #{order.id} · {summarizeItems(order.items)}
                    </span>
                    <span className="text-fg-subtle mt-0.5 block text-[12.5px]">
                      {order.time} · {courierLabel(order)}
                    </span>
                  </span>
                  <span className="flex flex-none items-center gap-5">
                    <span className="text-fg text-sm font-bold tabular-nums">
                      {formatNaira(order.total)}
                    </span>
                    <StatusBadge status={order.status} />
                    <ChevronDownIcon
                      size={14}
                      className={cn(
                        "text-fg-subtle transition-transform duration-200 ease-[var(--ease-out-strong)]",
                        isOpen && "rotate-180",
                      )}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div className="bg-canvas border-b border-white/6 px-5.5 pt-1 pb-4.5">
                    <ul>
                      {order.items.map((item) => (
                        <li
                          key={item.name}
                          className="text-fg-muted py-1.25 text-[13.5px]"
                        >
                          {item.quantity}× {item.name}
                          {item.note && ` — ${item.note}`}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/partner/dashboard/orders/${order.id}/receipt`}
                      className="bg-surface-3 border-hairline text-fg mt-2.5 inline-block rounded-full border-2 px-4 py-2 text-[12.5px] font-extrabold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-97"
                    >
                      Print receipt
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

/** Green with time to spare, amber under five minutes, red under two. */
function prepTone(seconds: number | undefined): string {
  if (seconds == null) return "bg-[rgba(74,222,128,0.15)] text-success";
  if (seconds < 120) return "bg-[rgba(248,113,113,0.15)] text-danger";
  if (seconds < 300) return "bg-[rgba(247,200,115,0.15)] text-accent";
  return "bg-[rgba(74,222,128,0.15)] text-success";
}

function Sparkline({ points, className }: { points: string; className: string }) {
  return (
    <svg
      width="70"
      height="30"
      viewBox="0 0 70 30"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="flex-none"
    >
      <polyline
        points={points}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
}
