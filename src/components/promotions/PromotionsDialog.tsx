"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons";
import { GRUB_PASS, OFFERS } from "@/lib/data/promotions";
import { COUPONS } from "@/lib/data";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";

interface PromotionsDialogProps {
  open: boolean;
  onClose: () => void;
}

/** Grub Pass pitch, the offers on this account, and a promo-code box. */
export function PromotionsDialog({ open, onClose }: PromotionsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // showModal() brings focus trapping, page inertness and Escape with it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      setCode("");
      setNotice(null);
      setCopied(null);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function applyCode(event: React.FormEvent) {
    event.preventDefault();
    const entered = code.trim().toUpperCase();
    const match = COUPONS.find((c) => c.code === entered);

    setNotice(
      match
        ? { ok: true, text: `${match.code} added — ${match.percent}% off at checkout.` }
        : { ok: false, text: `We don't recognise "${entered}".` },
    );
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="promotions-dialog-title"
      className={cn(
        "bg-surface border-hairline text-fg m-auto w-full max-w-[480px] rounded-[28px] border-2 p-7",
        "backdrop:bg-black/60",
        "opacity-0 transition-[opacity,transform,overlay,display] duration-250 ease-[var(--ease-out-strong)]",
        "transition-discrete scale-95 open:scale-100 open:opacity-100",
        "starting:open:scale-95 starting:open:opacity-0",
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2 id="promotions-dialog-title" className="font-display text-2xl">
          Promotions &amp; offers
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-fg-subtle hover:text-fg -mt-1 flex-none text-2xl leading-none transition-colors"
        >
          ×
        </button>
      </div>

      <div className="rail max-h-[65vh] overflow-y-auto pr-1">
        {/* Grub Pass ---------------------------------------------------- */}
        <section className="bg-primary text-canvas mb-6 rounded-[22px] p-6">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[22px]">{GRUB_PASS.name}</h3>
            <span className="text-[13px] font-extrabold tabular-nums">
              {formatNaira(GRUB_PASS.monthlyPrice)}/mo
            </span>
          </div>

          <p className="mb-4 text-[13.5px] leading-relaxed opacity-85">
            {GRUB_PASS.blurb}
          </p>

          <ul className="mb-5 flex flex-col gap-2">
            {GRUB_PASS.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-[13px]">
                <span className="bg-canvas/15 mt-0.5 flex size-4.5 flex-none items-center justify-center rounded-full">
                  <CheckIcon size={10} />
                </span>
                <span className="font-semibold">{perk}</span>
              </li>
            ))}
          </ul>

          <Button
            className="bg-canvas text-fg w-full shadow-none hover:shadow-none active:shadow-none"
            onClick={() =>
              setNotice({
                ok: true,
                text: "Grub Pass starts once billing is connected.",
              })
            }
          >
            Start free month
          </Button>
        </section>

        {/* Offers ------------------------------------------------------- */}
        <section className="mb-6">
          <h3 className="text-fg-subtle mb-3 text-[11.5px] font-extrabold tracking-wide uppercase">
            Your offers
          </h3>

          <ul className="flex flex-col gap-2.5">
            {OFFERS.map((offer) => (
              <li
                key={offer.code}
                className="border-hairline bg-surface-3 flex items-center gap-3 rounded-2xl border-2 p-3.5"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-9 flex-none items-center justify-center rounded-[11px] text-base",
                    offer.tint,
                  )}
                >
                  {offer.icon}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-fg mb-0.5 text-sm font-extrabold">
                    {offer.title}
                  </p>
                  <p className="text-fg-subtle text-[12px]">{offer.detail}</p>
                  <p className="text-fg-subtle mt-1 text-[11.5px] font-semibold">
                    {offer.expires}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCode(offer.code);
                    setCopied(offer.code);
                  }}
                  className="border-hairline text-primary hover:border-primary flex-none rounded-full border-2 px-3.5 py-1.75 text-[12px] font-extrabold transition-colors"
                >
                  {copied === offer.code ? "Added" : offer.code}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Promo code --------------------------------------------------- */}
        <form onSubmit={applyCode}>
          <label className="block">
            <span className="text-fg-muted mb-1.5 block text-[13px] font-bold">
              Have a promo code?
            </span>
            <div className="flex gap-2.5">
              <input
                type="text"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setNotice(null);
                }}
                placeholder="GRUB10"
                className="border-hairline bg-surface-3 text-fg placeholder:text-fg-subtle focus:border-primary min-w-0 flex-1 rounded-[14px] border-2 px-4 py-3 text-sm uppercase outline-none transition-colors duration-150"
              />
              <Button type="submit" disabled={code.trim().length === 0}>
                Apply
              </Button>
            </div>
          </label>

          <p
            aria-live="polite"
            className={cn(
              "text-center text-[12.5px] font-semibold",
              notice ? "mt-3.5" : "sr-only",
              notice?.ok ? "text-success" : "text-danger",
            )}
          >
            {notice?.text ?? ""}
          </p>
        </form>
      </div>
    </dialog>
  );
}
