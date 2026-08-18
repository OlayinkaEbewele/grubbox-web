"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import {
  PROFILE,
  PROFILE_SETTINGS,
  SAVED_ADDRESSES,
  SAVED_PAYMENTS,
} from "@/lib/data/profile";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";

export function ProfileView() {
  const [defaultAddressId, setDefaultAddressId] = useState(SAVED_ADDRESSES[0].id);

  const stats = [
    { icon: "🧾", value: String(PROFILE.totalOrders), label: "Total orders" },
    { icon: "👛", value: formatNaira(PROFILE.walletBalance), label: "Wallet balance" },
    { icon: "🎟️", value: String(PROFILE.rewardsAvailable), label: "Rewards available" },
  ];

  return (
    <>
      {/* Identity --------------------------------------------------------- */}
      <div className="mb-5 flex flex-wrap items-start gap-4.5">
        <div className="relative flex-none">
          <span className="flex size-19 items-center justify-center rounded-full bg-[linear-gradient(145deg,#F7C873,#C9A3FF)] text-[28px] font-bold text-white shadow-[0_6px_16px_-6px_rgba(201,163,255,0.5)]">
            {PROFILE.initial}
          </span>
          <button
            type="button"
            aria-label="Upload a profile photo"
            className="bg-surface border-hairline text-fg-muted hover:text-fg absolute -right-0.5 -bottom-0.5 flex size-6.5 items-center justify-center rounded-full border-2 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 8h3l2-3h6l2 3h3v11H4z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-[28px]">{PROFILE.name}</h1>
            <span className="bg-surface-2 text-accent rounded-full px-3 py-1.25 text-[11.5px] font-extrabold whitespace-nowrap">
              🏅 {PROFILE.tier}
            </span>
          </div>

          <p className="text-fg-subtle mb-2 text-sm">
            {PROFILE.email} · {PROFILE.phone}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-surface-3 text-fg-muted rounded-full px-3 py-1.25 text-xs font-bold">
              📍 Default address: {
                SAVED_ADDRESSES.find((a) => a.id === defaultAddressId)?.label
              }
            </span>
            <span className="text-primary text-xs font-bold">
              {PROFILE.ordersToReward} orders away from free delivery for a month
            </span>
          </div>
        </div>

        <ButtonLink href="/profile/edit" variant="outline" className="flex-none">
          Edit profile
        </ButtonLink>
      </div>

      {/* Stats ------------------------------------------------------------ */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-hairline bg-surface flex items-center gap-3.5 rounded-[20px] border-2 px-5 py-4.5"
          >
            <span
              aria-hidden="true"
              className="bg-surface-3 flex size-10 flex-none items-center justify-center rounded-xl text-lg"
            >
              {stat.icon}
            </span>
            <div>
              <p className="text-fg text-lg font-extrabold tabular-nums">{stat.value}</p>
              <p className="text-fg-subtle text-xs font-semibold">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Addresses + payments --------------------------------------------- */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <section className="border-hairline bg-surface rounded-3xl border-2 p-6">
          <div className="mb-4.5 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold">Saved addresses</h2>
            <Link
              href="/profile/addresses/new"
              className="text-primary hover:text-primary-light text-[13px] font-bold transition-colors"
            >
              + Add new
            </Link>
          </div>

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
                      <span className="text-sm font-extrabold">{address.label}</span>
                      <span className="bg-surface text-fg-subtle rounded-full px-2 py-0.5 text-[10.5px] font-bold">
                        {address.type}
                      </span>
                    </div>
                    <p className="text-fg-subtle text-[12.5px]">{address.detail}</p>
                  </div>

                  <Link
                    href={`/profile/addresses/${address.id}`}
                    className="text-primary hover:text-primary-light flex-none text-[12.5px] font-bold transition-colors"
                  >
                    Edit
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="border-hairline bg-surface rounded-3xl border-2 p-6">
          <div className="mb-4.5 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold">Payment methods</h2>
            <Link
              href="/profile/payments/new"
              className="text-primary hover:text-primary-light text-[13px] font-bold transition-colors"
            >
              + Add new
            </Link>
          </div>

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
                  <p className="mb-0.5 text-sm font-extrabold">{payment.label}</p>
                  <p className="text-fg-subtle text-[12.5px]">{payment.detail}</p>
                </div>

                {payment.kind === "wallet" ? (
                  <Link
                    href="/profile/wallet/top-up"
                    className="bg-primary text-canvas flex-none rounded-full px-3.5 py-1.75 text-xs font-extrabold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-95"
                  >
                    + Top Up
                  </Link>
                ) : (
                  <Link
                    href={`/profile/payments/${payment.id}`}
                    className="text-primary hover:text-primary-light flex-none text-[12.5px] font-bold transition-colors"
                  >
                    Edit
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Settings --------------------------------------------------------- */}
      <nav
        aria-label="Account settings"
        className="border-hairline bg-surface overflow-hidden rounded-3xl border-2"
      >
        {PROFILE_SETTINGS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="border-hairline hover:bg-surface-3 flex items-center gap-3.5 border-b px-5.5 py-4.5 transition-colors duration-150"
          >
            <span
              aria-hidden="true"
              className="bg-surface-3 flex size-9 flex-none items-center justify-center rounded-[10px] text-base"
            >
              {item.icon}
            </span>
            <span className="text-fg flex-1 text-[14.5px] font-bold">{item.label}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                stroke="var(--color-fg-subtle)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        ))}

        <Link
          href="/"
          className="text-primary hover:bg-surface-3 flex items-center gap-3.5 px-5.5 py-4.5 transition-colors duration-150"
        >
          <span
            aria-hidden="true"
            className="bg-surface-alt flex size-9 flex-none items-center justify-center rounded-[10px] text-base"
          >
            🚪
          </span>
          <span className="text-[14.5px] font-extrabold">Log out</span>
        </Link>
      </nav>
    </>
  );
}
