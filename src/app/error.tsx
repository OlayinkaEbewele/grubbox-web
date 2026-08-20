"use client";

import { useEffect } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Button, ButtonLink } from "@/components/ui/Button";

/**
 * Route-level error boundary. Next 16 passes `retry`, not `reset` — it
 * re-fetches and re-renders this boundary's children rather than just clearing
 * local state, so it's worth offering before sending anyone back to safety.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Stands in for the error reporter a real deployment would wire up here.
    console.error(error);
  }, [error]);

  return (
    <>
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-focus flex-1 flex-col items-center justify-center px-6 pt-page-top pb-page-bottom text-center">
        <span
          aria-hidden="true"
          className="bg-surface-alt text-accent mb-6 flex size-20 items-center justify-center rounded-full text-[34px]"
        >
          🍳
        </span>

        <h1 className="font-display mb-3 text-[clamp(1.75rem,5vw,2.125rem)]">
          Something went wrong in the kitchen
        </h1>
        <p className="text-fg-subtle mb-8 text-[15px] leading-relaxed">
          That&rsquo;s on us, not you. Try again — and if it keeps happening, our
          support team can help.
        </p>

        <div className="flex flex-wrap justify-center gap-3.5">
          <Button size="lg" onClick={retry}>
            Try again
          </Button>
          <ButtonLink href="/" variant="outline" size="lg">
            Take me home
          </ButtonLink>
          <ButtonLink href="/help" variant="outline" size="lg">
            Get help
          </ButtonLink>
        </div>

        {/* The digest is the only handle support has to find this in the logs. */}
        {error.digest && (
          <p className="text-fg-subtle mt-8 text-[12px]">
            Reference: <span className="font-mono">{error.digest}</span>
          </p>
        )}
      </main>

      <AppFooter />
    </>
  );
}
