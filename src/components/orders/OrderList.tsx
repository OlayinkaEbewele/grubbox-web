"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderListSkeleton } from "@/components/orders/OrderSkeletons";
import { SignInPrompt } from "@/components/auth/SignInPrompt";
import { HeartIcon } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useFavourites } from "@/lib/favourites";
import { useReviews } from "@/lib/reviews";
import { ReviewDialog } from "@/components/orders/ReviewDialog";
import { StarRating } from "@/components/orders/StarRating";
import { useOrders, useOrdersHydrated, type Order } from "@/lib/orders";
import { formatNaira, pluralize } from "@/lib/format";
import { cn } from "@/lib/cn";

const TABS = ["All orders", "Active"] as const;

/**
 * Nothing moves orders along in a mock backend, so progress is simulated from
 * the clock: an order is active until its promised ETA passes.
 */
function isActive(order: Order): boolean {
  if (order.status === "delivered") return false;
  const elapsedMinutes =
    (Date.now() - new Date(order.placedAt).getTime()) / 60_000;
  return elapsedMinutes < order.etaMinutes;
}

function formatPlacedAt(placedAt: string): string {
  const date = new Date(placedAt);
  const time = date
    .toLocaleTimeString("en-NG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\b(am|pm)\b/i, (m) => m.toUpperCase());

  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  if (sameDay) return `Today, ${time}`;

  return `${date.toLocaleDateString("en-NG", { month: "short", day: "numeric" })}, ${time}`;
}

interface OrderListProps {
  /** slug → cover image, so each row can show the restaurant rather than a dish. */
  covers: Record<string, string>;
}

export function OrderList({ covers }: OrderListProps) {
  const router = useRouter();
  const orders = useOrders();
  const hydrated = useOrdersHydrated();
  const { session, hydrated: authHydrated } = useAuth();
  const { replaceWith } = useCart();
  const [tab, setTab] = useState(0);
  const { isFavourite, toggle } = useFavourites();
  const { reviewFor } = useReviews();
  const [reviewing, setReviewing] = useState<Order | null>(null);

  if (!hydrated || !authHydrated) return <OrderListSkeleton />;

  if (!session) {
    return (
      <SignInPrompt
        title="Sign in to see your orders"
        description="Your order history and live tracking are tied to your account."
      />
    );
  }

  const visible = tab === 1 ? orders.filter(isActive) : orders;

  function reorder(order: Order) {
    replaceWith(order.restaurantSlug, order.lines);
    router.push("/checkout");
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        variant="orders"
        title="No orders yet"
        description="Your past orders will show up here once you place one."
        action={<ButtonLink href="/browse">Start an order</ButtonLink>}
      />
    );
  }

  return (
    <>
      <div className="mb-6 flex gap-2.5">
        {TABS.map((label, index) => (
          <Chip
            key={label}
            active={tab === index}
            onClick={() => setTab(index)}
          >
            {label}
          </Chip>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          variant="notifications"
          title="Nothing in flight"
          description="All your orders have been delivered."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((order) => {
            const active = isActive(order);
            const itemCount = order.lines.reduce(
              (sum, l) => sum + l.quantity,
              0,
            );
            const cover = covers[order.restaurantSlug] ?? order.lines[0]?.image;

            return (
              <li
                key={order.id}
                className="border-hairline bg-surface rounded-3xl border-2 px-5.5 py-5"
              >
                <div className="mb-3.5 flex items-center gap-4">
                  {cover && (
                    <div className="relative size-14 flex-none overflow-hidden rounded-2xl">
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="text-fg mb-0.75 text-base font-extrabold">
                      {order.restaurantName}
                    </h2>
                    <p className="text-fg-subtle text-[12.5px]">
                      {formatPlacedAt(order.placedAt)} · {itemCount}{" "}
                      {pluralize(itemCount, "item")} · #{order.id}
                    </p>
                  </div>

                  <div className="flex-none text-right">
                    <p className="text-fg mb-1 text-[15px] font-extrabold tabular-nums">
                      {formatNaira(order.totals.total)}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2.75 py-1 text-[11.5px] font-extrabold",
                        active
                          ? "bg-surface-alt text-primary"
                          : "bg-[rgba(74,222,128,0.15)] text-success",
                      )}
                    >
                      {active ? "On the way" : "Delivered"}
                    </span>
                  </div>
                </div>

                <div className="border-hairline flex gap-2.5 border-t pt-3.5">
                  <button
                    type="button"
                    onClick={() => reorder(order)}
                    className="press bg-primary text-canvas flex-1 rounded-full py-2.75 text-[13.5px] font-extrabold shadow-[0_4px_0_var(--color-primary-deep)] hover:shadow-[0_2px_0_var(--color-primary-deep)]"
                  >
                    Reorder
                  </button>

                  {!active &&
                    (reviewFor(order.id) ? (
                      <span
                        className="border-hairline flex flex-none items-center gap-1.5 rounded-full border-2 px-3 py-2"
                        title={`You rated this ${reviewFor(order.id)!.rating} out of 5`}
                      >
                        <StarRating
                          value={reviewFor(order.id)!.rating}
                          readOnly
                          size={13}
                        />
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setReviewing(order)}
                        className="border-hairline bg-surface text-fg-muted hover:border-primary hover:text-fg flex-none rounded-full border-2 px-4 py-2.25 text-[13.5px] font-extrabold transition-colors duration-150"
                      >
                        Rate
                      </button>
                    ))}

                  <Link
                    href={`/orders/${order.id}`}
                    className="border-hairline bg-surface text-fg-muted hover:border-primary hover:text-fg flex-1 rounded-full border-2 py-2.25 text-center text-[13.5px] font-extrabold transition-colors duration-150"
                  >
                    View details
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggle(order.restaurantSlug)}
                    aria-pressed={isFavourite(order.restaurantSlug)}
                    aria-label={
                      isFavourite(order.restaurantSlug)
                        ? `Remove ${order.restaurantName} from favourites`
                        : `Save ${order.restaurantName} to favourites`
                    }
                    className="bg-surface-3 text-primary flex size-10.5 flex-none items-center justify-center rounded-full transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-90"
                  >
                    <HeartIcon
                      size={17}
                      filled={isFavourite(order.restaurantSlug)}
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {reviewing && (
        <ReviewDialog
          open
          onClose={() => setReviewing(null)}
          order={reviewing}
        />
      )}
    </>
  );
}
