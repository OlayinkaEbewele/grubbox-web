"use client";

import { ButtonLink } from "@/components/ui/Button";
import { StorefrontIcon } from "@/components/icons";
import { Skeleton, SkeletonScreen } from "@/components/ui/Skeleton";

/**
 * What stands between a stranger and a kitchen's live order feed. Until now
 * `/partner/dashboard` rendered for anyone who typed the URL.
 */
export function PartnerSignedOut({ pending }: { pending: boolean }) {
  // `pending` means the persisted session hasn't been read yet — hold the
  // layout rather than flashing "sign in" at someone who already is.
  if (pending) {
    return (
      <div className="mx-auto w-full max-w-focus px-6 py-section">
        <SkeletonScreen label="Loading your dashboard">
          <Skeleton shape="circle" className="mb-6 size-16" />
          <Skeleton className="mb-3 h-8 w-64" />
          <Skeleton className="mb-8 h-3.5 w-full max-w-90" />
          <Skeleton shape="circle" className="h-12 w-48" />
        </SkeletonScreen>
      </div>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-focus flex-1 flex-col items-center justify-center px-6 py-section text-center">
      <span className="bg-surface-alt text-primary mb-6 flex size-16 items-center justify-center rounded-2xl">
        <StorefrontIcon size={30} />
      </span>

      <h1 className="font-display mb-3 text-[clamp(1.75rem,5vw,2.125rem)]">
        Sign in to your kitchen
      </h1>
      <p className="text-fg-subtle mb-8 text-[15px] leading-relaxed">
        Live orders, your menu, and payouts are tied to your restaurant account.
      </p>

      <div className="flex flex-wrap justify-center gap-3.5">
        <ButtonLink href="/partner/signin" size="lg">
          Partner sign in
        </ButtonLink>
        <ButtonLink href="/partner/apply" variant="outline" size="lg">
          Apply to join
        </ButtonLink>
      </div>
    </main>
  );
}
