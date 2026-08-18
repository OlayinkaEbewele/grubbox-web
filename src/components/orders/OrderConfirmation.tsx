"use client";

import { ButtonLink } from "@/components/ui/Button";
import { useOrder, useOrdersHydrated } from "@/lib/orders";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";

const STAGES = ["Order placed", "Preparing", "On the way", "Delivered"];

export function OrderConfirmation({ orderId }: { orderId: string }) {
  // Orders live in localStorage for now, so they only resolve on the client.
  const order = useOrder(orderId);
  const hydrated = useOrdersHydrated();

  if (!hydrated) return <div className="min-h-[60vh]" />;

  if (!order) {
    return (
      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <h1 className="font-display text-fg mb-3 text-3xl">
          We can&rsquo;t find that order
        </h1>
        <p className="text-fg-subtle mb-8 text-[15px]">
          It may have been placed on another device.
        </p>
        <ButtonLink href="/browse" size="lg">
          Browse food
        </ButtonLink>
      </main>
    );
  }

  const eta = order.fulfillment === "delivery" ? "25–35 min" : "10–15 min";

  return (
    <>
      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center px-6 pt-6 pb-24 text-center">
        <div className="pop-in mb-7 flex size-24 items-center justify-center rounded-full bg-[rgba(74,222,128,0.15)]">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 6 9 17l-5-5"
              stroke="var(--color-success)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="draw-check"
            />
          </svg>
        </div>

        <h1 className="font-display mb-2.5 text-[32px]">Order confirmed!</h1>
        <p className="text-fg-subtle mb-8 max-w-[400px] text-[15px] leading-relaxed">
          {order.restaurantName} is preparing your order. We&rsquo;ll notify you the
          moment it&rsquo;s on its way.
        </p>

        <section className="border-hairline bg-surface mb-6 w-full rounded-3xl border-2 p-6 text-left">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-fg-subtle mb-0.5 text-xs font-semibold">
                Order number
              </h2>
              <p className="text-fg text-base font-extrabold">#{order.id}</p>
            </div>
            <div className="text-right">
              <h2 className="text-fg-subtle mb-0.5 text-xs font-semibold">
                Estimated arrival
              </h2>
              <p className="text-primary text-base font-extrabold">{eta}</p>
            </div>
          </div>

          <ol className="mb-5 flex items-center gap-1.5" aria-label="Order progress">
            {STAGES.map((stage, index) => (
              <li
                key={stage}
                aria-current={index === 0 ? "step" : undefined}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  index === 0 ? "bg-primary" : "bg-hairline",
                )}
              >
                <span className="sr-only">{stage}</span>
              </li>
            ))}
          </ol>

          <div
            aria-hidden="true"
            className="text-fg-subtle mb-6 flex justify-between text-[11.5px] font-bold"
          >
            {STAGES.map((stage, index) => (
              <span key={stage} className={index === 0 ? "text-primary" : undefined}>
                {stage}
              </span>
            ))}
          </div>

          <div className="bg-hairline mb-5 h-px" />

          <ul className="text-fg-muted mb-4 flex flex-col gap-2.5 text-[13.5px]">
            {order.lines.map((line) => (
              <li key={line.itemId} className="flex justify-between gap-3">
                <span className="min-w-0">
                  {line.quantity}× {line.name}
                </span>
                <span className="text-fg flex-none font-bold tabular-nums">
                  {formatNaira(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="bg-hairline mb-4 h-px" />

          <div className="text-fg flex justify-between text-base font-extrabold">
            <span>Total paid</span>
            <span className="tabular-nums">{formatNaira(order.totals.total)}</span>
          </div>
        </section>

        <div className="flex w-full gap-3.5">
          <ButtonLink
            href={`/orders/${order.id}/tracking`}
            size="lg"
            className="flex-1"
          >
            Track Order
          </ButtonLink>
          <ButtonLink href="/orders" variant="outline" size="lg" className="flex-1">
            My Orders
          </ButtonLink>
        </div>
      </main>
    </>
  );
}
