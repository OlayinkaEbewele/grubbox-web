"use client";

import { useState } from "react";
import { AddressDialog } from "@/components/AddressDialog";
import { ChevronDownIcon, PinIcon } from "@/components/icons";
import { useLocation } from "@/lib/location";

/** The "Delivery to …" control in the app header. Opens the address picker. */
export function DeliveryAddressButton() {
  const [open, setOpen] = useState(false);
  const { detail } = useLocation();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="hover:bg-surface flex min-w-0 items-center gap-2.5 rounded-2xl px-2.5 py-1.5 text-left transition-colors duration-150"
      >
        <PinIcon size={18} className="text-primary flex-none" />

        <span className="min-w-0">
          <span className="text-fg-subtle block text-[10.5px] font-extrabold tracking-[0.08em] uppercase">
            Delivery to
          </span>
          <span className="text-fg block max-w-45 truncate text-sm font-bold">
            {detail}
          </span>
        </span>

        <ChevronDownIcon size={14} className="text-fg-subtle flex-none" />
      </button>

      <AddressDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
