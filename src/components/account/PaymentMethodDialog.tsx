"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, SelectField } from "@/components/ui/Field";
import { usePayments, CARD_NETWORKS, type CardNetwork } from "@/lib/account";
import { cn } from "@/lib/cn";

const NETWORKS = Object.keys(CARD_NETWORKS) as CardNetwork[];

interface PaymentMethodDialogProps {
  /** Null closes it; a string edits that card; "new" adds one. */
  editing: string | "new" | null;
  onClose: () => void;
}

export function PaymentMethodDialog({
  editing,
  onClose,
}: PaymentMethodDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { find, add, update, remove } = usePayments();

  const open = editing !== null;
  const isNew = editing === "new";
  const found = open && !isNew ? find(editing) : null;
  // The wallet isn't a card and has nothing editable, so it never opens here.
  const existing = found?.kind === "card" ? found : null;

  const [label, setLabel] = useState("");
  const [detail, setDetail] = useState("");
  const [network, setNetwork] = useState<CardNetwork>(NETWORKS[0]);

  // showModal() brings focus trapping, page inertness and Escape with it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      setLabel(existing?.label ?? "");
      setDetail(existing?.detail ?? "");
      setNetwork((existing?.network as CardNetwork) ?? NETWORKS[0]);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, existing]);

  function save(event: React.FormEvent) {
    event.preventDefault();
    const draft = { label, detail, network };
    if (existing) update(existing.id, draft);
    else add(draft);
    onClose();
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
      aria-labelledby="payment-form-title"
      className={cn(
        "bg-surface border-hairline text-fg m-auto w-full max-w-[460px] rounded-[28px] border-2 p-7",
        "backdrop:bg-black/60",
        "opacity-0 transition-[opacity,transform,overlay,display] duration-250 ease-[var(--ease-out-strong)]",
        "transition-discrete scale-95 open:scale-100 open:opacity-100",
        "starting:open:scale-95 starting:open:opacity-0",
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="payment-form-title" className="font-display mb-1 text-2xl">
            {existing ? "Edit card" : "Add a card"}
          </h2>
          <p className="text-fg-subtle text-sm">
            Placeholder details only — nothing is stored or sent.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-fg-subtle hover:text-fg -mt-1 flex-none text-2xl leading-none transition-colors"
        >
          ×
        </button>
      </div>

      <form onSubmit={save} className="flex flex-col gap-4.5">
        <SelectField
          label="Card network"
          name="network"
          value={network}
          options={NETWORKS}
          onChange={(event) => setNetwork(event.target.value as CardNetwork)}
        />

        <Field
          label="Card label"
          name="label"
          required
          placeholder="Visa ending in 4242"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
        />

        <Field
          label="Expiry"
          name="detail"
          required
          placeholder="Expires 08/28"
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
        />

        <p className="text-fg-subtle text-[12.5px] leading-relaxed">
          Never enter a real card number here. There is no payment provider
          behind this screen.
        </p>

        <div className="mt-1 flex gap-3">
          <Button type="submit" size="lg" className="flex-1">
            {existing ? "Save card" : "Add card"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={onClose}>
            Cancel
          </Button>
        </div>

        {existing && (
          <button
            type="button"
            onClick={() => {
              remove(existing.id);
              onClose();
            }}
            className="text-danger hover:text-fg mt-1 text-[13px] font-bold transition-colors"
          >
            Remove this card
          </button>
        )}
      </form>
    </dialog>
  );
}
