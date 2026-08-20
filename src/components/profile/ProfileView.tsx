"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SignInPrompt } from "@/components/auth/SignInPrompt";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { useAuth } from "@/lib/auth";
import { PromotionsDialog } from "@/components/promotions/PromotionsDialog";
import {
  PROFILE,
  PROFILE_SETTINGS,
  FREE_DELIVERY_EVERY,
  FREE_DELIVERY_CAVEAT,
  freeDeliveryProgress,
} from "@/lib/data/profile";
import { Avatar } from "@/components/account/Avatar";
import { SavedAddressDialog } from "@/components/account/SavedAddressDialog";
import { PaymentMethodDialog } from "@/components/account/PaymentMethodDialog";
import { useAddresses, usePayments, useWallet } from "@/lib/account";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";

export function ProfileView() {
  const { session, hydrated, signOut } = useAuth();
  const [promotionsOpen, setPromotionsOpen] = useState(false);
  // Null closed, "new" adds, an id edits — one bit of state per dialog.
  const [addressDialog, setAddressDialog] = useState<string | "new" | null>(null);
  const [paymentDialog, setPaymentDialog] = useState<string | "new" | null>(null);
  const {
    addresses: SAVED_ADDRESSES,
    defaultId: defaultAddressId,
    setDefault: setDefaultAddressId,
    hydrated: addressesHydrated,
  } = useAddresses();
  const { payments: SAVED_PAYMENTS, hydrated: paymentsHydrated } = usePayments();
  const { balance: walletBalance } = useWallet();

  // Hold the layout until the persisted session is readable, so a signed-in
  // visitor never sees the sign-in prompt flash first.
  if (!hydrated || !addressesHydrated || !paymentsHydrated)
    return <ProfileSkeleton />;

  if (!session) {
    return (
      <SignInPrompt
        variant="notifications"
        title="Sign in to see your profile"
        description="Your addresses, payment methods, and rewards live in your account."
      />
    );
  }

  const defaultAddress =
    SAVED_ADDRESSES.find((address) => address.id === defaultAddressId) ?? null;

  const reward = freeDeliveryProgress(PROFILE.totalOrders);

  return (
    <>
      {/* Identity --------------------------------------------------------- */}
      <div className="mb-5 flex flex-wrap items-start gap-4.5">
        <div className="relative flex-none">
          <Avatar
            avatar={session.avatar}
            initial={session.initial}
            className="size-19"
          />
          <Link
            href="/profile/edit"
            aria-label="Change your profile picture"
            className="bg-surface border-hairline text-fg-muted hover:text-fg absolute -right-0.5 -bottom-0.5 flex size-6.5 items-center justify-center rounded-full border-2 transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 8h3l2-3h6l2 3h3v11H4z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="13"
                r="3.2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </Link>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-[28px]">{session.name}</h1>
            <span className="bg-surface-2 text-accent rounded-full px-3 py-1.25 text-[11.5px] font-extrabold whitespace-nowrap">
              🏅 {PROFILE.tier}
            </span>
          </div>

          <p className="text-fg-subtle mb-2 text-sm">
            {session.email} · {PROFILE.phone}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {defaultAddress && (
              <span className="bg-surface-3 text-fg-muted rounded-full px-3 py-1.25 text-xs font-bold">
                📍 Default address: {defaultAddress.label}
              </span>
            )}

          </div>
        </div>

        <ButtonLink
          href="/profile/edit"
          variant="outline"
          className="flex-none"
        >
          Edit profile
        </ButtonLink>
      </div>

      {/* Wallet ----------------------------------------------------------- */}
      <div className="bg-primary text-canvas mb-4 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
        <div>
          <p className="mb-1 text-[12.5px] font-bold opacity-80">
            Wallet balance
          </p>
          <p className="text-[34px] leading-none font-extrabold tabular-nums">
            {formatNaira(walletBalance)}
          </p>
        </div>

        <ButtonLink
          href="/profile/wallet/top-up"
          className="bg-canvas text-fg flex-none shadow-none hover:shadow-none active:shadow-none"
        >
          Top up
        </ButtonLink>
      </div>

      {/* Orders + reward progress ------------------------------------------ */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="border-hairline bg-surface rounded-[20px] border-2 px-5 py-4.5">
          <div className="mb-3.5 flex items-center gap-3.5">
            <span
              aria-hidden="true"
              className="bg-surface-3 flex size-10 flex-none items-center justify-center rounded-xl text-lg"
            >
              🧾
            </span>
            <div>
              <p className="text-fg text-lg font-extrabold tabular-nums">
                {PROFILE.totalOrders}
              </p>
              <p className="text-fg-subtle text-xs font-semibold">Total orders</p>
            </div>
          </div>

          {/* Progress toward the next free delivery, in the same tile as the
              count it's derived from. */}
          <p
            className={cn(
              "mb-2 text-[12.5px] font-bold",
              reward.earned ? "text-success" : "text-primary",
            )}
          >
            {reward.earned
              ? "Your next delivery is free 🎉"
              : `${reward.remaining} more ${
                  reward.remaining === 1 ? "order" : "orders"
                } until free delivery`}
          </p>

          <div
            role="progressbar"
            aria-valuenow={reward.into}
            aria-valuemin={0}
            aria-valuemax={FREE_DELIVERY_EVERY}
            aria-label="Progress to your next free delivery"
            className="bg-hairline mb-2 flex h-1.5 gap-1 overflow-hidden rounded-full"
          >
            {Array.from({ length: FREE_DELIVERY_EVERY }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "flex-1 rounded-full",
                  reward.earned || i < reward.into
                    ? reward.earned
                      ? "bg-success"
                      : "bg-primary"
                    : "bg-transparent",
                )}
              />
            ))}
          </div>

          <p className="text-fg-subtle text-[11.5px] leading-relaxed">
            {FREE_DELIVERY_CAVEAT}
          </p>
        </div>

        <div className="border-hairline bg-surface flex items-center gap-3.5 rounded-[20px] border-2 px-5 py-4.5">
          <span
            aria-hidden="true"
            className="bg-surface-3 flex size-10 flex-none items-center justify-center rounded-xl text-lg"
          >
            🎟️
          </span>
          <div>
            <p className="text-fg text-lg font-extrabold tabular-nums">
              {PROFILE.rewardsAvailable}
            </p>
            <p className="text-fg-subtle text-xs font-semibold">
              Rewards available
            </p>
          </div>
        </div>
      </div>

      {/* Addresses + payments --------------------------------------------- */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <section className="border-hairline bg-surface rounded-3xl border-2 p-6">
          <div className="mb-4.5 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold">Saved addresses</h2>
            <button
              type="button"
              onClick={() => setAddressDialog("new")}
              className="text-primary hover:text-primary-light text-[13px] font-bold transition-colors"
            >
              + Add new
            </button>
          </div>

          {SAVED_ADDRESSES.length === 0 ? (
            <EmptyState
              variant="address"
              frame="bare"
              as="h3"
              title="No saved addresses"
              description="Save an address and it will be ready to pick at checkout."
              action={
                <Button size="sm" onClick={() => setAddressDialog("new")}>
                  Add an address
                </Button>
              }
            />
          ) : (
            <ul className="flex flex-col gap-3.5">
              {SAVED_ADDRESSES.map((address) => {
                const isDefault = address.id === defaultAddressId;
                return (
                  <li
                    key={address.id}
                    className="bg-surface-3 flex items-start gap-3 rounded-2xl p-3.5"
                  >
                    <button
                      type="button"
                      onClick={() => setDefaultAddressId(address.id)}
                      aria-pressed={isDefault}
                      aria-label={
                        isDefault
                          ? `${address.label} is your default address`
                          : `Make ${address.label} your default address`
                      }
                      className={cn(
                        "mt-0.5 flex size-5.5 flex-none items-center justify-center rounded-full border-2 text-xs transition-colors duration-150",
                        isDefault
                          ? "border-primary bg-primary text-canvas"
                          : "border-hairline bg-surface text-fg-subtle hover:border-primary",
                      )}
                    >
                      ★
                    </button>

                    <span
                      aria-hidden="true"
                      className="bg-surface flex size-9 flex-none items-center justify-center rounded-[10px] text-base"
                    >
                      {address.icon}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center gap-2">
                        <span className="text-sm font-extrabold">
                          {address.label}
                        </span>
                        <span className="bg-surface text-fg-subtle rounded-full px-2 py-0.5 text-[10.5px] font-bold">
                          {address.type}
                        </span>
                      </div>
                      <p className="text-fg-subtle text-[12.5px]">
                        {address.detail}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAddressDialog(address.id)}
                      className="text-primary hover:text-primary-light flex-none text-[12.5px] font-bold transition-colors"
                    >
                      Edit
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="border-hairline bg-surface rounded-3xl border-2 p-6">
          <div className="mb-4.5 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold">Payment methods</h2>
            <button
              type="button"
              onClick={() => setPaymentDialog("new")}
              className="text-primary hover:text-primary-light text-[13px] font-bold transition-colors"
            >
              + Add new
            </button>
          </div>

          {SAVED_PAYMENTS.length === 0 ? (
            <EmptyState
              variant="payment"
              frame="bare"
              as="h3"
              title="No payment methods"
              description="Add a card or top up your wallet to check out faster next time."
              action={
                <Button size="sm" onClick={() => setPaymentDialog("new")}>
                  Add a payment method
                </Button>
              }
            />
          ) : (
            <ul className="flex flex-col gap-3.5">
              {SAVED_PAYMENTS.map((payment) => (
                <li
                  key={payment.id}
                  className="bg-surface-3 flex items-center gap-3 rounded-2xl p-3.5"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative flex h-7.5 w-11 flex-none items-center justify-center overflow-hidden rounded-md",
                      payment.badgeClass,
                    )}
                  >
                    {payment.kind === "card" ? (
                      <>
                        <span className="absolute top-1.5 left-1.5 h-1.75 w-2.5 rounded-sm bg-white/50" />
                        <span className="text-[9px] font-extrabold tracking-wide italic">
                          {payment.network}
                        </span>
                      </>
                    ) : (
                      <span className="text-base">👛</span>
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-sm font-extrabold">
                      {payment.label}
                    </p>
                    <p className="text-fg-subtle text-[12.5px]">
                      {payment.detail}
                    </p>
                  </div>

                  {payment.kind === "wallet" ? (
                    <Link
                      href="/profile/wallet/top-up"
                      className="bg-primary text-canvas flex-none rounded-full px-3.5 py-1.75 text-xs font-extrabold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-95"
                    >
                      + Top Up
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPaymentDialog(payment.id)}
                      className="text-primary hover:text-primary-light flex-none text-[12.5px] font-bold transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Settings --------------------------------------------------------- */}
      <nav
        aria-label="Account settings"
        className="border-hairline bg-surface overflow-hidden rounded-3xl border-2"
      >
        {PROFILE_SETTINGS.map((item) => {
          const rowClass =
            "border-hairline hover:bg-surface-3 flex w-full items-center gap-3.5 border-b px-5.5 py-4.5 text-left transition-colors duration-150";
          const rowBody = (
            <>
              <span
                aria-hidden="true"
                className="bg-surface-3 flex size-9 flex-none items-center justify-center rounded-[10px] text-base"
              >
                {item.icon}
              </span>
              <span className="text-fg flex-1 text-[14.5px] font-bold">
                {item.label}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 6l6 6-6 6"
                  stroke="var(--color-fg-subtle)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          );

          return item.action === "promotions" ? (
            <button
              key={item.label}
              type="button"
              onClick={() => setPromotionsOpen(true)}
              className={rowClass}
            >
              {rowBody}
            </button>
          ) : (
            <Link key={item.label} href={item.href ?? "#"} className={rowClass}>
              {rowBody}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={signOut}
          className="text-primary hover:bg-surface-3 flex w-full items-center gap-3.5 px-5.5 py-4.5 text-left transition-colors duration-150"
        >
          <span
            aria-hidden="true"
            className="bg-surface-alt flex size-9 flex-none items-center justify-center rounded-[10px] text-base"
          >
            🚪
          </span>
          <span className="text-[14.5px] font-extrabold">Log out</span>
        </button>
      </nav>

      <PromotionsDialog
        open={promotionsOpen}
        onClose={() => setPromotionsOpen(false)}
      />

      <SavedAddressDialog
        editing={addressDialog}
        onClose={() => setAddressDialog(null)}
      />

      <PaymentMethodDialog
        editing={paymentDialog}
        onClose={() => setPaymentDialog(null)}
      />
    </>
  );
}
