import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "Page not found · Grub Box",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center justify-center px-6 pt-2 pb-16 text-center">
        {/* unoptimized: the SVG carries its own CSS keyframes, and Next's
            image pipeline would strip them. Served as-authored instead. */}
        <Image
          src="/404-lost-in-space.svg"
          alt="An astronaut dog drifting through space past a ringed planet and the numbers 4 0 4"
          width={280}
          height={280}
          unoptimized
          priority
          className="mb-3 h-auto w-full max-w-70"
        />

        <h1 className="font-display mb-3 text-[clamp(1.75rem,5vw,2.125rem)]">
          This page wandered off the delivery route
        </h1>
        <p className="text-fg-subtle mb-8 text-[15px] leading-relaxed">
          We couldn&rsquo;t find the page you&rsquo;re looking for. It might have been
          moved, or the link may be off by a digit.
        </p>

        <div className="flex flex-wrap justify-center gap-3.5">
          <ButtonLink href="/" size="lg">
            Take me home
          </ButtonLink>
          <ButtonLink href="/browse" variant="outline" size="lg">
            Browse food
          </ButtonLink>
        </div>
      </main>

      <AppFooter />
    </>
  );
}
