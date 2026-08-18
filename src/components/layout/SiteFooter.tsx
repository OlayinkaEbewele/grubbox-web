import Link from "next/link";
import { GrubMark } from "@/components/icons";

/**
 * Every href points at the route that page will eventually live on. The ones
 * that aren't built yet resolve to the 404, which is the honest answer — and
 * they start working the moment the route exists, with no link to revisit.
 */
const COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Partner",
    links: [
      { label: "For restaurants", href: "/partner" },
      { label: "Become a rider", href: "/rider" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Contact us", href: "/contact" },
      { label: "Terms & privacy", href: "/legal" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "/social/instagram" },
  { label: "Twitter", href: "/social/twitter" },
  { label: "TikTok", href: "/social/tiktok" },
];

export function SiteFooter() {
  return (
    <footer className="bg-surface-2 px-6 pt-14 pb-7 lg:px-14">
      <div className="border-hairline mx-auto flex max-w-[1400px] flex-wrap justify-between gap-12 border-b pb-9">
        <div className="max-w-[280px]">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="bg-primary text-canvas flex size-8 flex-none items-center justify-center rounded-[9px]">
              <GrubMark size={17} />
            </span>
            <span className="font-display text-fg text-xl">Grub Box</span>
          </div>
          <p className="text-fg-faint text-sm leading-relaxed">
            Great food from local restaurants, delivered fast across Lagos &amp; Abuja.
          </p>
        </div>

        <div className="flex flex-wrap gap-16">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="text-fg mb-4 text-[13px] font-bold tracking-wide uppercase">
                {column.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-fg-faint hover:text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 pt-6">
        <span className="text-fg-subtle text-[13px]">
          © 2026 Grub Box. All rights reserved.
        </span>
        <div className="flex gap-4">
          {SOCIALS.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              className="text-fg-faint hover:text-primary text-[13px] transition-colors"
            >
              {social.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

/** One-line footer used on the in-app screens. */
export function AppFooter() {
  return (
    <footer className="bg-surface-2 text-fg-subtle px-6 py-6 text-center text-[13px] lg:px-14">
      © 2026 Grub Box. All rights reserved.
    </footer>
  );
}
