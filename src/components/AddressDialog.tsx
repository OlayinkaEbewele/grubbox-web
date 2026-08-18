"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PinIcon, SearchIcon } from "@/components/icons";
import { DELIVERY_AREAS, useLocation, type DeliveryArea } from "@/lib/location";
import { cn } from "@/lib/cn";

interface AddressDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Address picker: type a street, search the areas we serve, reuse a recent
 * address, or hand it to the browser's geolocation.
 */
export function AddressDialog({ open, onClose }: AddressDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { history, choose, detect, status, error } = useLocation();

  const [query, setQuery] = useState("");
  const [street, setStreet] = useState("");
  const [selected, setSelected] = useState<DeliveryArea | null>(null);

  // showModal() brings focus trapping, page inertness and Escape with it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      setQuery("");
      setStreet("");
      setSelected(null);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DELIVERY_AREAS;
    return DELIVERY_AREAS.filter(
      (area) =>
        area.name.toLowerCase().includes(q) ||
        area.city.toLowerCase().includes(q),
    );
  }, [query]);

  function confirm(area: DeliveryArea) {
    const line = street.trim();
    choose({
      area: area.name,
      city: area.city,
      lat: area.lat,
      lng: area.lng,
      line: line ? `${line}, ${area.name}, ${area.city}` : undefined,
      outsideServiceArea: false,
    });
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="address-dialog-title"
      className={cn(
        "bg-surface border-hairline text-fg m-auto w-full max-w-[520px] rounded-[28px] border-2 p-7",
        "backdrop:bg-black/60",
        "opacity-0 transition-[opacity,transform,overlay,display] duration-250 ease-[var(--ease-out-strong)]",
        "transition-discrete scale-95 open:scale-100 open:opacity-100",
        "starting:open:scale-95 starting:open:opacity-0",
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="address-dialog-title" className="font-display mb-1 text-2xl">
            Delivery address
          </h2>
          <p className="text-fg-subtle text-sm">
            Where should we bring your order?
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-fg-subtle hover:text-fg -mt-1 text-2xl leading-none transition-colors"
        >
          ×
        </button>
      </div>

      <label className="mb-3 block">
        <span className="text-fg-muted mb-1.5 block text-[13px] font-bold">
          Street address
        </span>
        <input
          type="text"
          value={street}
          onChange={(event) => setStreet(event.target.value)}
          placeholder="e.g. 12 Admiralty Way"
          className="border-hairline bg-surface-3 text-fg placeholder:text-fg-subtle focus:border-primary w-full rounded-[14px] border-2 px-4 py-3.25 text-sm outline-none transition-colors duration-150"
        />
      </label>

      <div className="border-hairline bg-surface-3 mb-2 flex items-center gap-2.5 rounded-full border-2 px-4 py-2.5">
        <SearchIcon size={16} className="text-fg-subtle flex-none" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search area or city"
          aria-label="Search delivery areas"
          className="text-fg placeholder:text-fg-subtle w-full bg-transparent text-sm outline-none"
        />
      </div>

      <button
        type="button"
        onClick={detect}
        disabled={status === "locating"}
        className="text-primary hover:text-primary-light mb-4 flex items-center gap-2 text-[13px] font-bold transition-colors disabled:cursor-progress"
      >
        <PinIcon size={14} />
        {status === "locating" ? "Finding you…" : "Use my current location"}
      </button>

      {error && (
        <p className="text-danger mb-3 text-xs font-semibold">{error}</p>
      )}

      {history.length > 0 && !query && (
        <section className="mb-4">
          <h3 className="text-fg-subtle mb-2 text-[11.5px] font-extrabold tracking-wide uppercase">
            Recent addresses
          </h3>
          <ul className="flex flex-col gap-1.5">
            {history.map((entry) => (
              <li key={`${entry.area}-${entry.line ?? ""}-${entry.detectedAt}`}>
                <button
                  type="button"
                  onClick={() => {
                    choose(entry);
                    onClose();
                  }}
                  className="hover:bg-surface-3 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-150"
                >
                  <span className="bg-surface-alt text-primary flex size-8 flex-none items-center justify-center rounded-[10px]">
                    <PinIcon size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="text-fg block truncate text-sm font-bold">
                      {entry.line ?? entry.area}
                    </span>
                    <span className="text-fg-subtle block text-xs">
                      {entry.area}, {entry.city}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="text-fg-subtle mb-2 text-[11.5px] font-extrabold tracking-wide uppercase">
          Areas we deliver to
        </h3>

        {matches.length > 0 ? (
          <ul className="rail flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-1">
            {matches.map((area) => {
              const isSelected = selected?.name === area.name;
              return (
                <li key={area.name}>
                  <button
                    type="button"
                    onClick={() => setSelected(area)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left transition-colors duration-150",
                      isSelected
                        ? "border-primary bg-surface-3"
                        : "border-transparent hover:bg-surface-3",
                    )}
                  >
                    <span className="bg-surface-alt text-primary flex size-8 flex-none items-center justify-center rounded-[10px]">
                      <PinIcon size={15} />
                    </span>
                    <span>
                      <span className="text-fg block text-sm font-bold">
                        {area.name}
                      </span>
                      <span className="text-fg-subtle block text-xs">
                        {area.city}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-fg-subtle py-6 text-center text-sm">
            We don&rsquo;t deliver to &ldquo;{query}&rdquo; yet.
          </p>
        )}
      </section>

      <Button
        onClick={() => selected && confirm(selected)}
        disabled={!selected}
        size="lg"
        className="mt-5 w-full"
      >
        {selected ? `Deliver to ${selected.name}` : "Select an area"}
      </Button>
    </dialog>
  );
}
