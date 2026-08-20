"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, SelectField } from "@/components/ui/Field";
import { useAddresses, ADDRESS_TYPES, ADDRESS_ICONS } from "@/lib/account";
import { cn } from "@/lib/cn";

/**
 * Add or edit a saved address.
 *
 * Named `SavedAddressDialog` to keep it distinct from the existing
 * `AddressDialog`, which picks where the *current* order goes rather than
 * managing the addresses on the account.
 */
interface SavedAddressDialogProps {
  /** Null closes it; a string edits that address; "new" adds one. */
  editing: string | "new" | null;
  onClose: () => void;
}

export function SavedAddressDialog({ editing, onClose }: SavedAddressDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { find, add, update, remove, setDefault, defaultId } = useAddresses();

  const open = editing !== null;
  const isNew = editing === "new";
  const existing = open && !isNew ? find(editing) : null;

  const [label, setLabel] = useState("");
  const [type, setType] = useState<string>(ADDRESS_TYPES[0]);
  const [detail, setDetail] = useState("");
  const [icon, setIcon] = useState<string>(ADDRESS_ICONS[0]);

  // showModal() brings focus trapping, page inertness and Escape with it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      // Seed from the address being edited, or clear for a new one.
      setLabel(existing?.label ?? "");
      setType(existing?.type ?? ADDRESS_TYPES[0]);
      setDetail(existing?.detail ?? "");
      setIcon(existing?.icon ?? ADDRESS_ICONS[0]);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, existing]);

  function save(event: React.FormEvent) {
    event.preventDefault();
    const draft = { label, type, detail, icon };
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
      aria-labelledby="address-form-title"
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
          <h2 id="address-form-title" className="font-display mb-1 text-2xl">
            {existing ? "Edit address" : "Add an address"}
          </h2>
          <p className="text-fg-subtle text-sm">
            Riders see this exactly as you write it.
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
        <Field
          label="Label"
          name="label"
          required
          placeholder="Home"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
        />

        <SelectField
          label="Type"
          name="type"
          value={type}
          options={ADDRESS_TYPES}
          onChange={(event) => setType(event.target.value)}
        />

        <Field
          label="Full address"
          name="detail"
          required
          placeholder="12 Admiralty Way, Lekki Phase 1, Lagos"
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
        />

        <fieldset>
          <legend className="text-fg-muted mb-2 text-[13px] font-bold">Icon</legend>
          <div className="flex flex-wrap gap-2">
            {ADDRESS_ICONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setIcon(option)}
                aria-pressed={icon === option}
                aria-label={`Use ${option} as the icon`}
                className={cn(
                  "bg-surface-3 flex size-11 items-center justify-center rounded-[14px] border-2 text-lg transition-colors duration-150",
                  icon === option
                    ? "border-primary"
                    : "border-hairline hover:border-primary",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        {existing && defaultId !== existing.id && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setDefault(existing.id)}
          >
            Make this my default address
          </Button>
        )}

        <div className="mt-1 flex gap-3">
          <Button type="submit" size="lg" className="flex-1">
            {existing ? "Save address" : "Add address"}
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
            Delete this address
          </button>
        )}
      </form>
    </dialog>
  );
}
