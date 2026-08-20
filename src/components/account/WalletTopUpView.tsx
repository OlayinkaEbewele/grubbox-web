"use client";

import { useState } from "react";
import { AccountScreen, AccountForm } from "@/components/account/AccountScreen";
import { Field } from "@/components/ui/Field";
import { Chip } from "@/components/ui/Chip";
import { useWallet, TOP_UP_PRESETS } from "@/lib/account";
import { PAYMENT_METHODS } from "@/lib/data";
import { formatNaira } from "@/lib/format";

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Your profile", href: "/profile" },
  { label: "Top up wallet" },
];

export function WalletTopUpView() {
  const { balance, topUp, hydrated } = useWallet();
  const [amount, setAmount] = useState<number>(TOP_UP_PRESETS[1]);
  const [custom, setCustom] = useState("");
  const [saved, setSaved] = useState(false);

  const entered = Number(custom.replace(/[^\d]/g, ""));
  const finalAmount = custom.trim() ? entered : amount;

  return (
    <AccountScreen
      title="Top up wallet"
      description="Wallet credit is spent before your card at checkout."
      crumbs={CRUMBS}
      ready={hydrated}
    >
      <div className="bg-primary text-canvas mb-6 rounded-3xl p-6">
        <p className="mb-1 text-[12.5px] font-bold opacity-80">Current balance</p>
        <p className="text-[32px] leading-none font-extrabold tabular-nums">
          {formatNaira(balance)}
        </p>
      </div>

      <AccountForm
        submitLabel={
          finalAmount > 0 ? `Top up ${formatNaira(finalAmount)}` : "Choose an amount"
        }
        saved={saved}
        onSubmit={(event) => {
          event.preventDefault();
          if (finalAmount <= 0) return;
          topUp(finalAmount);
          setCustom("");
          setSaved(true);
        }}
      >
        <fieldset>
          <legend className="text-fg-muted mb-2.5 text-[13px] font-bold">
            Amount
          </legend>
          <div className="flex flex-wrap gap-2">
            {TOP_UP_PRESETS.map((preset) => (
              <Chip
                key={preset}
                active={!custom.trim() && amount === preset}
                onClick={() => {
                  setAmount(preset);
                  setCustom("");
                  setSaved(false);
                }}
              >
                {formatNaira(preset)}
              </Chip>
            ))}
          </div>
        </fieldset>

        <Field
          label="Or enter another amount"
          name="custom"
          inputMode="numeric"
          placeholder="₦ 7,500"
          value={custom}
          onChange={(event) => {
            setCustom(event.target.value);
            setSaved(false);
          }}
        />

        <div>
          <p className="text-fg-muted mb-2 text-[13px] font-bold">Pay with</p>
          <ul className="flex flex-col gap-2">
            {PAYMENT_METHODS.filter((m) => m.id !== "wallet").map((method) => (
              <li
                key={method.id}
                className="border-hairline bg-surface-3 flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-semibold"
              >
                <span aria-hidden="true">{method.icon}</span>
                {method.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-fg-subtle text-[12.5px] leading-relaxed">
          No payment provider is connected — topping up adds credit locally so you
          can see how the balance behaves.
        </p>
      </AccountForm>
    </AccountScreen>
  );
}
