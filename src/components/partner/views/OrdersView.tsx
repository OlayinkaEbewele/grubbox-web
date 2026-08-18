"use client";

import { useState } from "react";
import { Panel, StatusBadge } from "@/components/partner/Panel";
import { Chip } from "@/components/ui/Chip";
import {
  courierLabel,
  summarizeItems,
  type PartnerOrder,
  type PartnerOrderStatus,
} from "@/lib/data/partner";
import { formatNaira } from "@/lib/format";

const TABS: { label: string; status: PartnerOrderStatus | null }[] = [
  { label: "All", status: null },
  { label: "New", status: "new" },
  { label: "Preparing", status: "preparing" },
  { label: "Delivered", status: "delivered" },
  { label: "Cancelled", status: "cancelled" },
];

export function OrdersView({ orders }: { orders: PartnerOrder[] }) {
  const [tab, setTab] = useState(0);

  const filter = TABS[tab].status;
  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div>
      <h1 className="font-display mb-5 text-[28px]">Orders</h1>

      <div className="rail-clean mb-5 flex gap-2.5 overflow-x-auto pb-1">
        {TABS.map((entry, index) => (
          <Chip
            key={entry.label}
            active={tab === index}
            onClick={() => setTab(index)}
          >
            {entry.label}
          </Chip>
        ))}
      </div>

      <Panel className="overflow-hidden">
        {filtered.length > 0 ? (
          <ul>
            {filtered.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-4 border-b border-white/6 px-5.5 py-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="text-[14.5px] font-bold">
                    #{order.id} · {summarizeItems(order.items)}
                  </p>
                  <p className="text-fg-subtle mt-0.5 text-[12.5px]">
                    {order.time ?? "just now"} · {courierLabel(order)}
                  </p>
                </div>
                <div className="flex flex-none items-center gap-5">
                  <span className="text-sm font-bold tabular-nums">
                    {formatNaira(order.total)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-fg-subtle p-12 text-center text-sm">
            No orders in this category.
          </p>
        )}
      </Panel>
    </div>
  );
}
