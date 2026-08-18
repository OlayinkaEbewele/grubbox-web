import Link from "next/link";

export interface Crumb {
  label: string;
  /** Omit on the final crumb — the page you're already on isn't a link. */
  href?: string;
}

/**
 * Trail back up the hierarchy. Rendered as an ordered list so the structure
 * survives without the separators, which are decorative.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  if (trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="text-fg-subtle flex flex-wrap items-center gap-1.5 text-[13px] font-semibold">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="hover:text-primary transition-colors duration-150"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className={last ? "text-fg" : undefined} aria-current={last ? "page" : undefined}>
                  {crumb.label}
                </span>
              )}

              {!last && (
                <span aria-hidden="true" className="text-fg-subtle/60">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
