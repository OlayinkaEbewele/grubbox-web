"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PARTNER_PROFILE } from "@/lib/data/partner";

export function SettingsView() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-[520px]">
      <h1 className="font-display mb-5 text-[28px]">Settings</h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
        className="flex flex-col gap-4"
      >
        <Field
          label="Restaurant name"
          name="name"
          defaultValue={PARTNER_PROFILE.name}
        />
        <Field
          label="Address"
          name="address"
          defaultValue={PARTNER_PROFILE.address}
        />

        <div className="flex gap-3.5">
          <Field
            label="Opens"
            name="opens"
            defaultValue={PARTNER_PROFILE.opens}
            className="flex-1"
          />
          <Field
            label="Closes"
            name="closes"
            defaultValue={PARTNER_PROFILE.closes}
            className="flex-1"
          />
        </div>

        <Field
          label="Payout bank account"
          name="bank"
          defaultValue={PARTNER_PROFILE.bank}
        />

        <div className="mt-1.5 flex items-center gap-4">
          <Button type="submit" className="self-start">
            Save changes
          </Button>
          {/* Announced politely so the confirmation isn't purely visual. */}
          <p aria-live="polite" className="text-success text-[13px] font-bold">
            {saved ? "Changes saved" : ""}
          </p>
        </div>
      </form>
    </div>
  );
}

interface FieldProps extends React.ComponentProps<"input"> {
  label: string;
  className?: string;
}

function Field({ label, className, ...props }: FieldProps) {
  return (
    <label className={className}>
      <span className="text-fg-muted mb-1.5 block text-[13px] font-bold">
        {label}
      </span>
      <input
        type="text"
        className="border-hairline bg-surface-3 text-fg focus:border-primary w-full rounded-[14px] border-2 px-4 py-3.25 text-sm outline-none transition-colors duration-150"
        {...props}
      />
    </label>
  );
}
