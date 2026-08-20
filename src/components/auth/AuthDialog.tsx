"use client";

import { useEffect, useRef } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";

/**
 * The app-wide sign-in dialog. Mounted once by `AuthDialogHost` in the root
 * layout so anything can summon it with `openAuth()` — the header, a gated
 * page, or a control that needs an account behind it.
 */
export function AuthDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { authMode, closeAuth } = useAuth();
  const open = authMode !== null;

  // showModal() brings focus trapping, page inertness and Escape with it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        closeAuth();
      }}
      /**
       * The effect above only acts when `open` *changes*. If the dialog is ever
       * closed natively — Escape's default action, a `form method="dialog"`, a
       * stray `close()` — React would still think it was open, the dep wouldn't
       * change, and the dialog could never be reopened. Mirroring the native
       * close back into state keeps the two from drifting apart.
       */
      onClose={() => {
        if (open) closeAuth();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) closeAuth();
      }}
      aria-labelledby="auth-dialog-title"
      className={cn(
        "bg-surface border-hairline text-fg m-auto w-full max-w-[420px] rounded-[28px] border-2 p-8",
        "backdrop:bg-black/60",
        "opacity-0 transition-[opacity,transform,overlay,display] duration-250 ease-[var(--ease-out-strong)]",
        "transition-discrete scale-95 open:scale-100 open:opacity-100",
        "starting:open:scale-95 starting:open:opacity-0",
      )}
    >
      <button
        type="button"
        onClick={closeAuth}
        aria-label="Close"
        className="text-fg-subtle hover:text-fg absolute top-5 right-6 text-2xl leading-none transition-colors"
      >
        ×
      </button>

      {/* Remounted per open so the form never reopens on the tab, or with the
          half-typed email, from last time. */}
      {open && (
        <AuthForm
          key={authMode}
          initialMode={authMode}
          headingLevel="h2"
          titleId="auth-dialog-title"
          onSignedIn={closeAuth}
        />
      )}
    </dialog>
  );
}

/** Keeps the dialog mounted for the whole app. Rendered by the root layout. */
export function AuthDialogHost() {
  return <AuthDialog />;
}
