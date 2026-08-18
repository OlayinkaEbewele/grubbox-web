import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { HelpCentre } from "@/components/help/HelpCentre";
import { SUPPORT_EMAIL, SUPPORT_HOURS, SUPPORT_PHONE } from "@/lib/data/help";

export const metadata = {
  title: "Help center · Grub Box",
  description:
    "Search Grub Box help articles on orders, delivery, payments, refunds, and accounts, or contact support.",
};

export default function HelpPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <div className="shell max-w-page pt-page-top">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Help center" }]} />
        </div>

        <HelpCentre />

        <section className="shell max-w-page pt-section pb-page-bottom">
          <div className="bg-surface-alt border-hairline flex flex-wrap items-center justify-between gap-8 rounded-[28px] border-2 px-12 py-10">
            <div>
              <h2 className="font-display mb-2 text-2xl">Still need help?</h2>
              <p className="text-fg-subtle max-w-[420px] text-[14.5px]">
                {SUPPORT_HOURS}
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5">
              <Link
                href="/help/chat"
                className="press bg-primary text-canvas flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[14.5px] font-extrabold shadow-[0_5px_0_var(--color-primary-deep)] hover:shadow-[0_3px_0_var(--color-primary-deep)]"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 11.5a8.4 8.4 0 0 1-1.2 4.3L21 20l-4.3-1.1a8.5 8.5 0 1 1 4.3-7.4z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
                Live chat
              </Link>

              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="bg-surface-3 border-hairline text-fg hover:border-primary flex items-center gap-2.5 rounded-full border-2 px-6 py-3.5 text-[14.5px] font-extrabold transition-colors"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4.5 3h4l2 5-2.5 2a13 13 0 0 0 6 6l2-2.5 5 2v4a2 2 0 0 1-2 2C10 21.5 3.5 15 3 5.5a2 2 0 0 1 1.5-2.5z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
                Call us
              </a>

              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="bg-surface-3 border-hairline text-fg hover:border-primary flex items-center gap-2.5 rounded-full border-2 px-6 py-3.5 text-[14.5px] font-extrabold transition-colors"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 6h18v12H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="m3 7 9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
                Email us
              </a>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </>
  );
}
