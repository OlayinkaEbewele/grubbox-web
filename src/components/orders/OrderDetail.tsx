"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReviewDialog } from "@/components/orders/ReviewDialog";
import { OrderDetailSkeleton } from "@/components/orders/OrderSkeletons";
import { StarRating } from "@/components/orders/StarRating";
import { useCart } from "@/lib/cart";
import { useOrder, useOrdersHydrated } from "@/lib/orders";
import { useReviews } from "@/lib/reviews";
import { formatNaira, pluralize } from "@/lib/format";
import { PAYMENT_METHODS, DEFAULT_ADDRESS } from "@/lib/data";
import { cn } from "@/lib/cn";

/** Same clock-based rule the order list uses: active until the ETA passes. */
function isActive(placedAt: string, etaMinutes: number, status: string): boolean {
  if (status === "delivered") return false;
  return (Date.now() - new Date(placedAt).getTime()) / 60_000 < etaMinutes;
}

function formatPlacedAt(placedAt: string): string {
  const date = new Date(placedAt);
  return `${date.toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })} · ${date
    .toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(/\b(am|pm)\b/i, (m) => m.toUpperCase())}`;
}

export function OrderDetail({ orderId }: { orderId: string }) {
  const router = useRouter();
  const order = useOrder(orderId);
  const hydrated = useOrdersHydrated();
  const { replaceWith } = useCart();
  const { reviewFor, hydrated: reviewsHydrated } = useReviews();
  const [reviewOpen, setReviewOpen] = useState(false);

  if (!hydrated || !reviewsHydrated) {
    return (
      <div className="shell max-w-narrow pt-page-top pb-page-bottom">
        <OrderDetailSkeleton />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="shell max-w-narrow pt-page-top pb-page-bottom">
        <EmptyState
          variant="orders"
          title="We can't find that order"
          description="It may have been placed on another device, or the link is off by a character."
          action={<ButtonLink href="/orders">Your orders</ButtonLink>}
        />
      </div>
    );
  }

  const active = isActive(order.placedAt, order.etaMinutes, order.status);
  const review = reviewFor(order.id);
  const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  const payment =
    PAYMENT_METHODS.find((m) => m.id === order.paymentMethodId) ?? null;

  const rows: [string, string][] = [
    ["Subtotal", formatNaira(order.totals.subtotal)],
    ...(order.totals.discount > 0
      ? ([[
          order.couponCode ? `Discount · ${order.couponCode}` : "Discount",
          `−${formatNaira(order.totals.discount)}`,
        ]] as [string, string][])
      : []),
    [
      order.fulfillment === "delivery" ? "Delivery fee" : "Pickup",
      order.totals.deliveryFee === 0 ? "Free" : formatNaira(order.totals.deliveryFee),
    ],
    ["Service fee", formatNaira(order.totals.serviceFee)],
    ...(order.totals.tip > 0
      ? ([["Rider tip", formatNaira(order.totals.tip)]] as [string, string][])
      : []),
  ];

  return (
    <div className="shell max-w-narrow flex-1 pt-page-top pb-page-bottom">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-fg mb-1.5 text-[32px]">
            Order #{order.id}
          </h1>
          <p className="text-fg-subtle text-sm">
            {formatPlacedAt(order.placedAt)} · {itemCount}{" "}
            {pluralize(itemCount, "item")}
          </p>
        </div>

        <span
          className={cn(
            "flex-none rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold",
            active
              ? "bg-surface-alt text-primary"
              : "bg-[rgba(74,222,128,0.15)] text-success",
          )}
        >
          {active ? "On the way" : "Delivered"}
        </span>
      </div>

      {/* Restaurant ------------------------------------------------------- */}
      <section className="border-hairline bg-surface mb-5 flex items-center gap-4 rounded-3xl border-2 p-5">
        <div className="bg-surface-3 relative size-14 flex-none overflow-hidden rounded-2xl">
          {order.lines[0]?.image && (
            <Image
              src={order.lines[0].image}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-fg mb-0.5 text-base font-extrabold">
            {order.restaurantName}
          </h2>
          <p className="text-fg-subtle truncate text-[12.5px]">
            {order.restaurantAddress}
          </p>
        </div>
        <ButtonLink
          href={`/restaurants/${order.restaurantSlug}`}
          variant="outline"
          size="sm"
          className="flex-none"
        >
          View menu
        </ButtonLink>
      </section>

      {/* Rating ----------------------------------------------------------- */}
      {!active && (
        <section className="border-hairline bg-surface mb-5 rounded-3xl border-2 p-5">
          {review ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-fg mb-1.5 text-[15px] font-extrabold">
                  You rated this order
                </h2>
                <StarRating value={review.rating} readOnly size={18} />
              </div>
              <Button variant="outline" size="sm" onClick={() => setReviewOpen(true)}>
                Edit rating
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-fg mb-0.5 text-[15px] font-extrabold">
                  How was it?
                </h2>
                <p className="text-fg-subtle text-[13px]">
                  Your rating helps other people order well.
                </p>
              </div>
              <Button size="sm" onClick={() => setReviewOpen(true)}>
                Rate order
              </Button>
            </div>
          )}
        </section>
      )}

      {/* Items ------------------------------------------------------------ */}
      <section className="border-hairline bg-surface mb-5 rounded-3xl border-2 p-6">
        <h2 className="text-fg mb-4 text-[15px] font-extrabold">Items</h2>

        <ul className="mb-5 flex flex-col gap-3.5">
          {order.lines.map((line) => (
            <li key={line.itemId} className="flex items-center gap-3.5">
              <span className="bg-surface-3 text-fg-muted flex size-7 flex-none items-center justify-center rounded-lg text-[12px] font-extrabold tabular-nums">
                {line.quantity}
              </span>
              <span className="text-fg min-w-0 flex-1 text-sm font-semibold">
                {line.name}
              </span>
              <span className="text-fg flex-none text-sm font-extrabold tabular-nums">
                {formatNaira(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="bg-hairline mb-4 h-px" />

        <dl className="mb-4 flex flex-col gap-2.5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 text-[13.5px]">
              <dt className="text-fg-subtle">{label}</dt>
              <dd className="text-fg-muted font-bold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="bg-hairline mb-4 h-px" />

        <div className="text-fg flex justify-between text-base font-extrabold">
          <span>Total paid</span>
          <span className="tabular-nums">{formatNaira(order.totals.total)}</span>
        </div>
      </section>

      {/* Delivery + payment ------------------------------------------------ */}
      <section className="border-hairline bg-surface mb-6 grid gap-5 rounded-3xl border-2 p-6 sm:grid-cols-2">
        <div>
          <h2 className="text-fg-subtle mb-1.5 text-xs font-semibold">
            {order.fulfillment === "delivery" ? "Delivered to" : "Collected from"}
          </h2>
          <p className="text-fg text-sm font-bold">
            {order.fulfillment === "delivery"
              ? DEFAULT_ADDRESS.line
              : order.restaurantAddress}
          </p>
          {order.instructions && (
            <p className="text-fg-subtle mt-1.5 text-[12.5px] italic">
              &ldquo;{order.instructions}&rdquo;
            </p>
          )}
        </div>

        <div>
          <h2 className="text-fg-subtle mb-1.5 text-xs font-semibold">Paid with</h2>
          <p className="text-fg text-sm font-bold">
            {payment ? `${payment.icon} ${payment.label}` : order.paymentMethodId}
          </p>
        </div>
      </section>

      {/* Actions ----------------------------------------------------------- */}
      <div className="flex flex-wrap gap-3.5">
        <Button
          size="lg"
          className="min-w-40 flex-1"
          onClick={() => {
            replaceWith(order.restaurantSlug, order.lines);
            router.push("/checkout");
          }}
        >
          Reorder
        </Button>

        {active && (
          <ButtonLink
            href={`/orders/${order.id}/tracking`}
            variant="outline"
            size="lg"
            className="min-w-40 flex-1"
          >
            Track order
          </ButtonLink>
        )}

        <ButtonLink
          href="/help"
          variant="outline"
          size="lg"
          className="min-w-40 flex-1"
        >
          Get help
        </ButtonLink>
      </div>

      <ReviewDialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        order={order}
      />
    </div>
  );
}
