"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { CardIcon, CheckIcon, DocumentIcon, ListIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const STEP_COUNT = 4;

const DOCUMENTS = [
  { label: "CAC / business registration", slug: "cac" },
  { label: "Valid ID (owner)", slug: "id" },
  { label: "Food handling permit", slug: "permit" },
];

interface OnboardingDialogProps {
  open: boolean;
  /** Called when the merchant finishes all four steps. */
  onComplete: () => void;
  /** Called on "Do this later", Escape, or backdrop click. */
  onDismiss: () => void;
}

export function OnboardingDialog({
  open,
  onComplete,
  onDismiss,
}: OnboardingDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);

  // showModal() gives focus trapping, inertness of the page behind, and Escape
  // handling — all of which a div-based modal has to reimplement badly.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      setStep(0);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function next() {
    if (step >= STEP_COUNT - 1) {
      onComplete();
      return;
    }
    setStep(step + 1);
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onClick={(event) => {
        // A click that lands on the dialog element itself is the backdrop —
        // the panel inside stops its own clicks from reaching here.
        if (event.target === dialogRef.current) onDismiss();
      }}
      aria-labelledby="onboarding-title"
      className={cn(
        "bg-surface border-hairline text-fg m-auto w-full max-w-[480px] rounded-[28px] border-2 p-9",
        "backdrop:bg-black/60",
        // Modals scale from centre — they aren't anchored to a trigger.
        "opacity-0 transition-[opacity,transform,overlay,display] duration-250 ease-[var(--ease-out-strong)]",
        "transition-discrete scale-95 open:scale-100 open:opacity-100",
        "starting:open:scale-95 starting:open:opacity-0",
      )}
    >
      <ol className="mb-6 flex items-center gap-2" aria-label="Setup progress">
        {Array.from({ length: STEP_COUNT }, (_, index) => (
          <li
            key={index}
            aria-current={index === step ? "step" : undefined}
            className={cn(
              "h-1.25 flex-1 rounded-full transition-colors duration-300",
              index <= step ? "bg-primary" : "bg-white/10",
            )}
          />
        ))}
      </ol>

      {step === 0 && (
        <div>
          <span className="text-primary mb-5 flex size-13 items-center justify-center rounded-[14px] bg-[rgba(201,163,255,0.15)]">
            <DocumentIcon />
          </span>
          <h2 id="onboarding-title" className="font-display mb-2 text-2xl">
            Upload your documents
          </h2>
          <p className="text-fg-subtle mb-6 text-sm leading-relaxed">
            We need these to verify your business before you go live.
          </p>
          <ul className="flex flex-col gap-3">
            {DOCUMENTS.map((document) => (
              <li
                key={document.slug}
                className="bg-surface-3 flex items-center justify-between rounded-[14px] border-2 border-dashed border-white/15 p-4"
              >
                <span className="text-[13.5px] font-bold">{document.label}</span>
                <Link
                  href={`/partner/dashboard/documents/${document.slug}`}
                  className="text-primary hover:text-primary-light text-[13px] font-extrabold transition-colors"
                >
                  Upload
                  <span className="sr-only"> {document.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 1 && (
        <div>
          <span className="text-success mb-5 flex size-13 items-center justify-center rounded-[14px] bg-[rgba(74,222,128,0.15)]">
            <CardIcon />
          </span>
          <h2 id="onboarding-title" className="font-display mb-2 text-2xl">
            Add payout details
          </h2>
          <p className="text-fg-subtle mb-6 text-sm leading-relaxed">
            Where should we send your earnings?
          </p>
          <div className="flex flex-col gap-3.5">
            <Field label="Bank name" placeholder="e.g. GTBank" />
            <Field label="Account number" placeholder="0123456789" inputMode="numeric" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <span className="text-accent mb-5 flex size-13 items-center justify-center rounded-[14px] bg-[rgba(247,200,115,0.15)]">
            <ListIcon size={26} />
          </span>
          <h2 id="onboarding-title" className="font-display mb-2 text-2xl">
            Set up your menu
          </h2>
          <p className="text-fg-subtle mb-6 text-sm leading-relaxed">
            Add at least 5 dishes to go live. You can add more anytime.
          </p>
          <div className="bg-surface-3 flex items-center justify-between rounded-[14px] p-4">
            <span className="text-fg-muted text-[13.5px] font-bold">
              0 of 5 dishes added
            </span>
            <ButtonLink
              href="/partner/dashboard/menu/new"
              size="sm"
              className="shadow-none hover:shadow-none"
            >
              + Add dish
            </ButtonLink>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <span className="text-success pop-in mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[rgba(74,222,128,0.15)]">
            <CheckIcon size={30} />
          </span>
          <h2 id="onboarding-title" className="font-display mb-2 text-2xl">
            You&rsquo;re almost live!
          </h2>
          <p className="text-fg-subtle text-sm leading-relaxed">
            Our team will verify your documents within 1&ndash;2 business days, then
            your restaurant goes live on Grub Box.
          </p>
        </div>
      )}

      <div className="mt-7 flex items-center gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-none">
            Back
          </Button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="text-fg-subtle hover:text-fg flex-none px-2.5 py-3 text-sm font-bold transition-colors"
        >
          Do this later
        </button>
        <Button onClick={next} className="flex-1">
          {step === STEP_COUNT - 1 ? "Go to dashboard" : "Continue"}
        </Button>
      </div>
    </dialog>
  );
}

interface FieldProps extends React.ComponentProps<"input"> {
  label: string;
}

function Field({ label, ...props }: FieldProps) {
  return (
    <label className="block">
      <span className="text-fg-muted mb-1.5 block text-[13px] font-bold">
        {label}
      </span>
      <input
        type="text"
        className="border-hairline bg-surface-3 text-fg placeholder:text-fg-subtle w-full rounded-[14px] border-2 px-4 py-3.25 text-sm outline-none"
        {...props}
      />
    </label>
  );
}
