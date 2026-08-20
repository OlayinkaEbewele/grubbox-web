import type { ReactNode } from "react";
import { PinIcon, ScooterIcon } from "@/components/icons";

/**
 * A phone shell holding one screen of the rider app.
 *
 * Everything inside the bezel is `aria-hidden`: it is a picture of software,
 * not software. Without that, screen readers would announce a row of Accept
 * and Navigate "buttons" that do nothing. The caption carries the meaning.
 */
function PhoneFrame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="flex flex-none flex-col items-center gap-4">
      <div className="bg-surface-2 h-[460px] w-[228px] rounded-[36px] p-2.5 shadow-[0_28px_56px_-24px_rgba(0,0,0,0.75)]">
        <div
          aria-hidden="true"
          className="bg-canvas relative h-full w-full overflow-hidden rounded-[28px]"
        >
          {/* Notch */}
          <span className="bg-surface-2 absolute top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full" />
          {children}
        </div>
      </div>
      <figcaption className="text-fg-muted text-[13px] font-bold">
        {caption}
      </figcaption>
    </figure>
  );
}

function StatusRow({ trailing }: { trailing: string }) {
  return (
    <div className="mb-3 flex items-center justify-between pt-5">
      <span className="text-success flex items-center gap-1.5 rounded-full bg-[rgba(74,222,128,0.15)] px-2.5 py-1 text-[9px] font-extrabold">
        <span className="bg-success size-1.5 rounded-full" />
        Online
      </span>
      <span className="text-fg-subtle text-[9px] font-bold tabular-nums">
        {trailing}
      </span>
    </div>
  );
}

/** Offer screen — the payout is the first thing on it, deliberately. */
function OfferScreen() {
  return (
    <div className="flex h-full flex-col px-3.5 pb-3.5">
      <StatusRow trailing="Today ₦8,400" />

      <div className="border-hairline bg-surface rounded-[18px] border-2 p-3.5">
        <p className="text-fg-subtle mb-1 text-[8.5px] font-bold tracking-wider uppercase">
          New delivery
        </p>
        <p className="text-primary mb-1 text-[26px] leading-none font-extrabold tabular-nums">
          ₦1,250
        </p>
        <p className="text-fg-subtle mb-4 text-[9.5px] font-semibold">
          4.6 km · about 18 min
        </p>

        <div className="flex gap-2.5">
          <div className="flex flex-none flex-col items-center pt-1">
            <span className="bg-primary size-2 rounded-full" />
            <span className="bg-hairline my-1 w-0.5 flex-1" />
            <span className="border-primary size-2 rounded-full border-2" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3.5">
            <div>
              <p className="text-fg text-[10.5px] leading-tight font-extrabold">
                Mama Cass Kitchen
              </p>
              <p className="text-fg-subtle text-[9px]">Pickup · 1.2 km away</p>
            </div>
            <div>
              <p className="text-fg text-[10.5px] leading-tight font-extrabold">
                18 Admiralty Way
              </p>
              <p className="text-fg-subtle text-[9px]">Drop-off · Lekki Phase 1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-3">
        <span className="bg-primary text-canvas flex items-center justify-center rounded-full py-2.5 text-[11px] font-extrabold shadow-[0_4px_0_var(--color-primary-deep)]">
          Accept · 12s
        </span>
        <span className="text-fg-subtle flex items-center justify-center py-1 text-[10px] font-bold">
          Decline
        </span>
      </div>
    </div>
  );
}

/** Active delivery — map on top, the sheet you actually act from underneath. */
function NavigationScreen() {
  return (
    <div className="flex h-full flex-col">
      <div className="bg-surface-alt relative flex-1 overflow-hidden">
        <svg
          viewBox="0 0 228 260"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* Street grid, kept faint so the route reads on top of it. */}
          <g stroke="rgba(255,255,255,0.05)" strokeWidth="10">
            <path d="M-10 70h248M-10 170h248M60 -10v280M170 -10v280" />
          </g>
          <path
            d="M40 220 L40 170 L110 170 L110 70 L186 70"
            stroke="var(--color-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="186" cy="70" r="6" fill="var(--color-accent)" />
        </svg>

        <span className="bg-primary text-canvas absolute bottom-8 left-6 flex size-8 -translate-x-1/2 items-center justify-center rounded-full shadow-[0_6px_14px_-4px_rgba(0,0,0,0.6)]">
          <ScooterIcon size={16} />
        </span>

        <span className="text-canvas absolute top-8 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[9.5px] font-extrabold whitespace-nowrap">
          <PinIcon size={11} />
          Arriving in 6 min
        </span>
      </div>

      <div className="border-hairline bg-surface rounded-t-[22px] border-t-2 p-3.5">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="bg-surface-3 text-fg flex size-8 flex-none items-center justify-center rounded-full text-[11px] font-extrabold">
            A
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-fg text-[10.5px] leading-tight font-extrabold">
              Adaeze O.
            </p>
            <p className="text-fg-subtle truncate text-[9px]">
              18 Admiralty Way, Lekki
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="bg-primary text-canvas flex flex-1 items-center justify-center rounded-full py-2 text-[10.5px] font-extrabold">
            Navigate
          </span>
          <span className="border-hairline text-fg-muted flex flex-1 items-center justify-center rounded-full border-2 py-2 text-[10.5px] font-extrabold">
            Message
          </span>
        </div>
      </div>
    </div>
  );
}

const WEEK = [
  ["M", 40],
  ["T", 62],
  ["W", 48],
  ["T", 78],
  ["F", 96],
  ["S", 70],
  ["S", 34],
] as const;

/** Earnings — the number, how it got there, and when it lands. */
function EarningsScreen() {
  return (
    <div className="flex h-full flex-col px-3.5 pb-3.5">
      <StatusRow trailing="Week 32" />

      <p className="text-fg-subtle mb-1 text-[8.5px] font-bold tracking-wider uppercase">
        This week
      </p>
      <p className="text-fg mb-1 text-[28px] leading-none font-extrabold tabular-nums">
        ₦48,500
      </p>
      <p className="text-success mb-4 text-[9.5px] font-bold">▲ 12% vs last week</p>

      <div className="flex h-24 items-end gap-1.5">
        {WEEK.map(([day, height], index) => (
          <div
            key={index}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span
              className={index === 4 ? "bg-primary w-full rounded-t-sm" : "bg-surface-3 w-full rounded-t-sm"}
              style={{ height: `${height}%` }}
            />
            <span className="text-fg-subtle text-[7.5px] font-bold">{day}</span>
          </div>
        ))}
      </div>

      <div className="border-hairline bg-surface mt-auto rounded-[16px] border-2 p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-fg-subtle text-[9px] font-bold">Next payout</span>
          <span className="text-fg text-[10.5px] font-extrabold tabular-nums">
            Fri · ₦48,500
          </span>
        </div>
        <span className="bg-surface-3 text-primary flex items-center justify-center rounded-full py-2 text-[10px] font-extrabold">
          Cash out early
        </span>
      </div>
    </div>
  );
}

/**
 * The three screens a rider actually spends their shift in. Scrolls sideways on
 * narrow viewports rather than shrinking the phones past legibility.
 */
export function RiderAppScreens() {
  return (
    <div className="rail-clean -mx-6 flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-2 lg:mx-0 lg:justify-center lg:px-0">
      <div className="snap-center">
        <PhoneFrame caption="See the offer before you accept">
          <OfferScreen />
        </PhoneFrame>
      </div>
      <div className="snap-center">
        <PhoneFrame caption="Navigate without leaving the app">
          <NavigationScreen />
        </PhoneFrame>
      </div>
      <div className="snap-center">
        <PhoneFrame caption="Watch your earnings add up">
          <EarningsScreen />
        </PhoneFrame>
      </div>
    </div>
  );
}
