"use client";

import { Panel } from "@/components/partner/Panel";
import { ButtonLink } from "@/components/ui/Button";
import { MONTH_EARNINGS, PARTNER_PROFILE, PAYOUTS } from "@/lib/data/partner";
import { formatNaira } from "@/lib/format";

export function EarningsView() {
  const maxMonth = Math.max(...MONTH_EARNINGS.map(([, value]) => value));

  return (
    <div>
      <h1 className="font-display mb-5 text-[28px]">Earnings</h1>

      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <Panel className="p-5.5">
          <h2 className="text-fg-subtle mb-2 text-[12.5px] font-bold">
            Available balance
          </h2>
          <p className="text-2xl font-extrabold tabular-nums">
            {formatNaira(PARTNER_PROFILE.availableBalance)}
          </p>
        </Panel>

        <Panel className="p-5.5">
          <h2 className="text-fg-subtle mb-2 text-[12.5px] font-bold">This month</h2>
          <p className="text-2xl font-extrabold tabular-nums">
            {formatNaira(PARTNER_PROFILE.earningsThisMonth)}
          </p>
        </Panel>

        <Panel className="flex flex-col justify-center p-5.5">
          <ButtonLink href="/partner/dashboard/withdraw" className="w-full">
            Withdraw
          </ButtonLink>
        </Panel>
      </div>

      <Panel className="mb-6 p-6">
        <h2 className="mb-4.5 text-sm font-extrabold">Monthly earnings</h2>
        <div className="flex h-35 items-end gap-3.5">
          {MONTH_EARNINGS.map(([month, value]) => (
            <div
              key={month}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                className="bg-primary w-full max-w-9 rounded-t-lg"
                style={{ height: `${Math.round((value / maxMonth) * 100)}%` }}
                role="img"
                aria-label={`${month}: ${value}`}
              />
              <span className="text-fg-subtle text-[11.5px] font-bold">{month}</span>
            </div>
          ))}
        </div>
      </Panel>

      <h2 className="mb-4 text-[17px] font-extrabold">Payout history</h2>
      <Panel className="overflow-hidden">
        <ul>
          {PAYOUTS.map((payout) => (
            <li
              key={payout.date}
              className="flex items-center justify-between gap-4 border-b border-white/6 px-5.5 py-4 last:border-b-0"
            >
              <div>
                <p className="text-[14.5px] font-bold">{payout.date}</p>
                <p className="text-fg-subtle mt-0.5 text-[12.5px]">{payout.bank}</p>
              </div>
              <span className="text-sm font-bold tabular-nums">
                {formatNaira(payout.amount)}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
