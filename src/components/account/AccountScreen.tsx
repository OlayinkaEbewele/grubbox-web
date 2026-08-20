"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { SignInPrompt } from "@/components/auth/SignInPrompt";
import { Skeleton, SkeletonScreen } from "@/components/ui/Skeleton";
import { useAuth } from "@/lib/auth";

/**
 * The shell every account screen shares: header, breadcrumb, title, and a card
 * to put the form in. Written once so eight small screens can't each invent
 * their own spacing.
 *
 * All of them sit behind the same sign-in gate as the profile they belong to.
 */
export function AccountScreen({
  title,
  description,
  crumbs,
  children,
  /** Set once the screen's own stores have hydrated. */
  ready = true,
}: {
  title: string;
  description?: string;
  crumbs: Crumb[];
  children: ReactNode;
  ready?: boolean;
}) {
  const { session, hydrated } = useAuth();

  return (
    <>
      <SiteHeader variant="app" showSearch={false} />

      <main className="mx-auto w-full max-w-focus flex-1 px-6 pt-page-top pb-page-bottom">
        <Breadcrumbs trail={crumbs} />

        {!hydrated || !ready ? (
          <SkeletonScreen label={`Loading ${title.toLowerCase()}`}>
            <Skeleton className="mb-2 h-8 w-56" />
            <Skeleton className="mb-8 h-3.5 w-72" />
            <div className="border-hairline bg-surface flex flex-col gap-5 rounded-3xl border-2 p-6">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton shape="block" className="h-12 w-full" />
                </div>
              ))}
            </div>
          </SkeletonScreen>
        ) : !session ? (
          <SignInPrompt
            variant="notifications"
            title={`Sign in to ${title.toLowerCase()}`}
            description="This lives in your account, so we need to know who you are first."
          />
        ) : (
          <>
            <h1 className="font-display text-fg mb-2 text-[32px]">{title}</h1>
            {description && (
              <p className="text-fg-subtle mb-8 text-sm leading-relaxed">
                {description}
              </p>
            )}
            {children}
          </>
        )}
      </main>

      <AppFooter />
    </>
  );
}

/** Card wrapper for a form, with the save/cancel pair every screen ends on. */
export function AccountForm({
  onSubmit,
  submitLabel,
  saved,
  children,
  destructive,
}: {
  onSubmit: (event: React.FormEvent) => void;
  submitLabel: string;
  /** Shows the confirmation line after a successful save. */
  saved?: boolean;
  children: ReactNode;
  /** Optional delete action, rendered away from the primary button. */
  destructive?: ReactNode;
}) {
  const router = useRouter();

  return (
    <form onSubmit={onSubmit}>
      <div className="border-hairline bg-surface mb-6 flex flex-col gap-4.5 rounded-3xl border-2 p-6">
        {children}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" className="min-w-40 flex-1">
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="min-w-32 flex-1"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>

      <p
        aria-live="polite"
        className={
          saved
            ? "text-success mt-4 text-center text-[13px] font-bold"
            : "sr-only"
        }
      >
        {saved ? "Saved" : ""}
      </p>

      {destructive && (
        <div className="border-hairline mt-8 border-t pt-6">{destructive}</div>
      )}
    </form>
  );
}
