"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { CheckIcon, PinIcon, RefreshIcon } from "@/components/icons";
import {
  CHECKOUT_ADDONS,
  COUPONS,
  DEFAULT_ADDRESS,
  DROPOFF_PRESETS,
  PAYMENT_METHODS,
  TIP_OPTIONS,
} from "@/lib/data";
import { useCart } from "@/lib/cart";
import { useLocation } from "@/lib/location";
import { createOrder } from "@/lib/orders";
import { calculateTotals, discountFor } from "@/lib/pricing";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Fulfillment, Restaurant } from "@/lib/types";

const STEPS = ["Your Order", "Delivery", "Payment"] as const;

interface CheckoutFlowProps {
  restaurants: Restaurant[];
}

export function CheckoutFlow({ restaurants }: CheckoutFlowProps) {
  const router = useRouter();
  const { cart, lines, subtotal, setQuantity, add, quantityOf, clear, hydrated } =
    useCart();
  const {
    location: detected,
    status: locationStatus,
    error: locationError,
    detect: detectLocation,
  } = useLocation();
  const locating = locationStatus === "locating";

  const [step, setStep] = useState(0);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [couponIndex, setCouponIndex] = useState(0);
  const [paymentIndex, setPaymentIndex] = useState(0);
  const [dropoffIndex, setDropoffIndex] = useState<number | null>(null);
  const [instructions, setInstructions] = useState("");
  const [tipPercent, setTipPercent] = useState(10);
  const [placing, setPlacing] = useState(false);

  const restaurant = useMemo(
    () => restaurants.find((r) => r.slug === cart.restaurantSlug) ?? null,
    [restaurants, cart.restaurantSlug],
  );

  const coupon = COUPONS[couponIndex];
  const totals = calculateTotals({
    subtotal,
    coupon,
    fulfillment,
    deliveryFee: restaurant?.deliveryFee ?? 0,
    tipPercent,
  });

  // Before hydration the cart is empty by definition, so hold the layout
  // rather than flashing the empty state at everyone.
  if (!hydrated) {
    return <div className="min-h-[60vh]" />;
  }

  if (lines.length === 0 || !restaurant) {
    return (
      <main className="mx-auto flex w-full max-w-[600px] flex-1 flex-col justify-center px-6 py-24">
        <EmptyState
          variant="cart"
          title="Your cart is empty"
          description="Add dishes from a restaurant to get started."
          action={
            <ButtonLink href="/browse" size="lg">
              Browse food
            </ButtonLink>
          }
        />
      </main>
    );
  }

  function placeOrder() {
    if (!restaurant) return;
    setPlacing(true);

    const order = createOrder({
      restaurantSlug: restaurant.slug,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      lines,
      totals,
      fulfillment,
      paymentMethodId: PAYMENT_METHODS[paymentIndex].id,
      couponCode: coupon.code,
      instructions,
      etaMinutes: fulfillment === "delivery" ? 25 : 10,
    });

    clear();
    router.push(`/orders/${order.id}/confirmation`);
  }

  const isDelivery = fulfillment === "delivery";

  return (
    <>
      {/* Fulfillment ------------------------------------------------------- */}
      <div className="mx-auto flex w-full max-w-[1100px] justify-center px-6 lg:px-14">
        <div
          role="radiogroup"
          aria-label="Fulfillment method"
          className="border-hairline bg-surface inline-flex rounded-full border-2 p-1.25"
        >
          {(
            [
              { value: "delivery", label: "🛵 Delivery", eta: "25 min" },
              { value: "pickup", label: "🏃 Pickup", eta: "10 min" },
            ] as const
          ).map((option) => {
            const selected = fulfillment === option.value;
            return (
              <button
                key={option.value}
                role="radio"
                aria-checked={selected}
                onClick={() => setFulfillment(option.value)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold whitespace-nowrap",
                  "transition-colors duration-200 ease-[var(--ease-out-strong)]",
                  selected ? "bg-primary text-canvas" : "text-fg-muted hover:text-fg",
                )}
              >
                <span>{option.label}</span>
                <span className="font-semibold opacity-85">· {option.eta}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress ---------------------------------------------------------- */}
      <ol className="mx-auto flex w-full max-w-[1100px] items-center gap-2 px-6 pt-5 lg:px-14">
        {STEPS.map((label, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => index <= step && setStep(index)}
                disabled={index > step}
                aria-current={current ? "step" : undefined}
                className="flex items-center gap-2.5 px-1 py-2 disabled:cursor-default"
              >
                <span
                  className={cn(
                    "flex size-7 flex-none items-center justify-center rounded-full text-[13px] font-extrabold",
                    done && "bg-success text-white",
                    current && "bg-primary text-canvas",
                    !done && !current && "bg-hairline text-fg-subtle",
                  )}
                >
                  {done ? <CheckIcon size={13} /> : index + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-[14.5px] font-extrabold sm:inline",
                    current ? "text-fg" : "text-fg-subtle",
                  )}
                >
                  {label}
                </span>
              </button>
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 max-w-15 flex-1 transition-colors duration-300",
                    done ? "bg-success" : "bg-hairline",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-start gap-12 px-6 pt-6 pb-24 lg:flex-row lg:px-14">
        <div className="min-w-0 flex-1">
          {/* Step 1 — the order --------------------------------------------- */}
          {step === 0 && (
            <section>
              <h1 className="font-display mb-1.5 text-3xl">Your order</h1>
              <p className="text-fg-subtle mb-6 text-sm">
                From {restaurant.name} · {restaurant.address}
              </p>

              <ul className="mb-5 flex flex-col gap-4">
                {lines.map((line) => (
                  <li
                    key={line.itemId}
                    className="border-hairline bg-surface flex items-center gap-4 rounded-[20px] border-2 p-4"
                  >
                    <div className="relative size-18 flex-none overflow-hidden rounded-2xl">
                      <Image
                        src={line.image}
                        alt=""
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-fg mb-1 text-[15px] font-extrabold">
                        {line.name}
                      </h2>
                      <p className="text-primary text-sm font-bold">
                        {formatNaira(line.price)}
                      </p>
                    </div>
                    <QuantityStepper
                      quantity={line.quantity}
                      label={line.name}
                      onIncrement={() =>
                        setQuantity(line.itemId, line.quantity + 1)
                      }
                      onDecrement={() =>
                        setQuantity(line.itemId, line.quantity - 1)
                      }
                    />
                  </li>
                ))}
              </ul>

              <div className="border-success-soft flex items-center gap-3 rounded-2xl border-2 bg-[rgba(74,222,128,0.15)] px-4.5 py-3.5">
                <span className="bg-success flex size-8 flex-none items-center justify-center rounded-full text-white">
                  <CheckIcon size={16} />
                </span>
                <div className="flex-1">
                  {/* The source design put dark green on a light panel; on this
                      dark canvas the same values fall well under 4.5:1, so the
                      greens are lightened instead. */}
                  <p className="text-success text-[13.5px] font-extrabold">
                    Best coupon auto-applied · {coupon.code}
                  </p>
                  <p className="text-success-soft text-[12.5px]">
                    You saved {formatNaira(discountFor(coupon, subtotal))} on this order
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCouponIndex((i) => (i + 1) % COUPONS.length)}
                  title="Switch coupon"
                  aria-label="Try a different coupon"
                  className="border-success-soft text-success bg-surface flex size-8.5 flex-none items-center justify-center rounded-full border-2 transition-transform duration-200 ease-[var(--ease-out-strong)] hover-fine:rotate-90"
                >
                  <RefreshIcon />
                </button>
              </div>
            </section>
          )}

          {/* Step 2 — delivery ---------------------------------------------- */}
          {step === 1 && (
            <section>
              <h1 className="font-display mb-6 text-3xl">
                {isDelivery ? "Delivery" : "Pickup"}
              </h1>

              {isDelivery ? (
                <>
                  <div className="mb-6">
                    <div className="mb-3.5 flex items-center justify-between">
                      <h2 className="text-[15px] font-extrabold">Delivery address</h2>
                      <button
                        type="button"
                        onClick={detectLocation}
                        disabled={locating}
                        className="text-primary hover:text-primary-light text-[13px] font-bold transition-colors disabled:cursor-progress"
                      >
                        {locating ? "Locating…" : "Use current location"}
                      </button>
                    </div>

                    <div className="border-hairline bg-surface overflow-hidden rounded-[20px] border-2">
                      {/* Stylised street grid — a real map goes here once the
                          geocoding provider is wired up. */}
                      <div className="bg-surface-alt relative h-35">
                        <svg
                          viewBox="0 0 400 140"
                          preserveAspectRatio="none"
                          className="absolute inset-0 h-full w-full"
                          aria-hidden="true"
                        >
                          <line x1="0" y1="35" x2="400" y2="30" stroke="#26262C" strokeWidth="3" />
                          <line x1="0" y1="90" x2="400" y2="95" stroke="#26262C" strokeWidth="3" />
                          <line x1="90" y1="0" x2="80" y2="140" stroke="#26262C" strokeWidth="3" />
                          <line x1="290" y1="0" x2="300" y2="140" stroke="#26262C" strokeWidth="3" />
                        </svg>
                        <span className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                          <PinIcon size={30} />
                        </span>
                      </div>

                      <div className="flex items-start gap-3.5 p-4.5">
                        <span className="bg-surface-alt text-primary flex size-10 flex-none items-center justify-center rounded-xl">
                          <PinIcon size={19} />
                        </span>
                        <div>
                          <p className="mb-0.75 text-[14.5px] font-extrabold">
                            {detected
                              ? `Current location · ${detected.area}`
                              : DEFAULT_ADDRESS.label}
                          </p>
                          <p className="text-fg-subtle text-[13.5px]">
                            {detected
                              ? `${detected.area}, ${detected.city} · ${detected.lat.toFixed(4)}, ${detected.lng.toFixed(4)}`
                              : DEFAULT_ADDRESS.line}
                          </p>
                        </div>
                      </div>
                    </div>

                    {locationError && (
                      <p className="text-danger mt-2 text-xs font-semibold">
                        {locationError}
                      </p>
                    )}
                  </div>

                  <div>
                    <h2 className="mb-3.5 text-[15px] font-extrabold">
                      Drop-off instructions
                    </h2>
                    <div className="mb-3.5 flex flex-wrap gap-2.5">
                      {DROPOFF_PRESETS.map((preset, index) => (
                        <Chip
                          key={preset.label}
                          active={dropoffIndex === index}
                          onClick={() => {
                            setDropoffIndex(index);
                            setInstructions(preset.text);
                          }}
                        >
                          <span aria-hidden="true">{preset.emoji}</span>
                          {preset.label}
                        </Chip>
                      ))}
                    </div>
                    <textarea
                      rows={3}
                      value={instructions}
                      onChange={(event) => {
                        setInstructions(event.target.value);
                        setDropoffIndex(null);
                      }}
                      placeholder="Add more details (gate code, landmark…)"
                      aria-label="Drop-off instructions"
                      className="border-hairline bg-surface text-fg placeholder:text-fg-subtle w-full resize-none rounded-[20px] border-2 p-4 text-sm outline-none"
                    />
                  </div>
                </>
              ) : (
                <div className="border-hairline bg-surface rounded-[20px] border-2 p-5">
                  <h2 className="mb-1.5 text-[14.5px] font-extrabold">
                    Pickup location
                  </h2>
                  <p className="text-fg-subtle mb-1 text-[13.5px]">
                    {restaurant.name} · {restaurant.address}
                  </p>
                  <p className="text-fg-subtle text-[13.5px]">
                    Ready for pickup in ~10 minutes
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Step 3 — payment ------------------------------------------------ */}
          {step === 2 && (
            <section>
              <h1 className="font-display mb-6 text-3xl">Payment</h1>

              <div
                role="radiogroup"
                aria-label="Payment method"
                className="mb-7 flex flex-col gap-2.5"
              >
                {PAYMENT_METHODS.map((method, index) => {
                  const selected = paymentIndex === index;
                  return (
                    <button
                      key={method.id}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setPaymentIndex(index)}
                      className={cn(
                        "flex items-center gap-3.5 rounded-2xl border-2 p-4 text-left",
                        "transition-colors duration-150",
                        selected
                          ? "border-primary bg-surface-3"
                          : "border-hairline bg-surface hover:border-primary",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="bg-surface-3 flex size-10 flex-none items-center justify-center rounded-xl text-lg"
                      >
                        {method.icon}
                      </span>
                      <span className="text-fg flex-1 text-[14.5px] font-bold">
                        {method.label}
                      </span>
                      <span
                        className={cn(
                          "flex size-5 flex-none items-center justify-center rounded-full text-white",
                          selected ? "bg-primary" : "bg-hairline",
                        )}
                      >
                        {selected && <CheckIcon size={11} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mb-7">
                <h2 className="mb-3.5 text-[15px] font-extrabold">
                  Add a tip for your rider
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {TIP_OPTIONS.map((tip) => (
                    <Chip
                      key={tip.label}
                      active={tipPercent === tip.percent}
                      onClick={() => setTipPercent(tip.percent)}
                    >
                      {tip.label}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-1 text-[15px] font-extrabold">
                  Add something extra?
                </h2>
                <p className="text-fg-subtle mb-3.5 text-[13px]">
                  Popular last-minute additions
                </p>
                <ul className="rail flex gap-3.5 overflow-x-auto pb-2">
                  {CHECKOUT_ADDONS.map((addon) => {
                    const quantity = quantityOf(addon.id);
                    const item = {
                      id: addon.id,
                      name: addon.name,
                      description: "",
                      price: addon.price,
                      image: restaurant.image,
                    };
                    return (
                      <li
                        key={addon.id}
                        className="border-hairline bg-surface w-35 flex-none rounded-[18px] border-2 p-3.5"
                      >
                        <p className="text-primary mb-2 text-[10.5px] font-extrabold tracking-wide uppercase">
                          {addon.category}
                        </p>
                        <h3 className="text-fg mb-1.5 text-[13.5px] leading-snug font-extrabold">
                          {addon.name}
                        </h3>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-fg-muted text-[13px] font-extrabold">
                            {formatNaira(addon.price)}
                          </span>
                          {quantity > 0 ? (
                            <QuantityStepper
                              size="sm"
                              quantity={quantity}
                              label={addon.name}
                              onIncrement={() => add(restaurant.slug, item)}
                              onDecrement={() =>
                                setQuantity(addon.id, quantity - 1)
                              }
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => add(restaurant.slug, item)}
                              aria-label={`Add ${addon.name} to cart`}
                              className="bg-surface-3 text-primary size-6.5 rounded-full text-base font-extrabold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-90"
                            >
                              +
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          )}

          <div className="mt-8 flex justify-between gap-4">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <span />
            )}

            {step < 2 ? (
              <Button size="lg" onClick={() => setStep(step + 1)}>
                {step === 0 ? "Continue to Delivery" : "Continue to Payment"}
              </Button>
            ) : (
              <Button size="lg" onClick={placeOrder} disabled={placing}>
                {placing ? "Placing order…" : "Place Order"}
              </Button>
            )}
          </div>
        </div>

        {/* Summary ---------------------------------------------------------- */}
        <aside className="border-hairline bg-surface w-full flex-none rounded-3xl border-2 p-6 lg:sticky lg:top-6 lg:w-80">
          <h2 className="mb-4 text-[15px] font-extrabold">Order summary</h2>

          <ul className="text-fg-muted mb-4 flex flex-col gap-2.5 text-[13.5px]">
            {lines.map((line) => (
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

          <dl className="text-fg-muted mb-4 flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="text-fg font-bold tabular-nums">
                {formatNaira(totals.subtotal)}
              </dd>
            </div>
            {totals.discount > 0 && (
              <div className="text-success flex justify-between">
                <dt>{coupon.code}</dt>
                <dd className="font-bold tabular-nums">
                  −{formatNaira(totals.discount)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>{isDelivery ? "Delivery fee" : "Pickup"}</dt>
              <dd className="text-fg font-bold tabular-nums">
                {isDelivery ? formatNaira(totals.deliveryFee) : "Free"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Service fee</dt>
              <dd className="text-fg font-bold tabular-nums">
                {formatNaira(totals.serviceFee)}
              </dd>
            </div>
            {totals.tip > 0 && (
              <div className="flex justify-between">
                <dt>Rider tip</dt>
                <dd className="text-fg font-bold tabular-nums">
                  {formatNaira(totals.tip)}
                </dd>
              </div>
            )}
          </dl>

          <div className="bg-hairline mb-4 h-px" />

          <div className="text-fg flex justify-between text-[17px] font-extrabold">
            <span>Total</span>
            <span className="tabular-nums">{formatNaira(totals.total)}</span>
          </div>
        </aside>
      </div>
    </>
  );
}
