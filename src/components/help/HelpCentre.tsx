"use client";

import { useMemo, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "@/components/icons";
import {
  HELP_ARTICLES,
  HELP_CATEGORIES,
  type HelpCategoryId,
} from "@/lib/data/help";
import { pluralize } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";

/** One icon per category, matching the design's line-art set. */
const CATEGORY_ICONS: Record<HelpCategoryId, React.ReactNode> = {
  orders: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8l8-5 8 5v8l-8 5-8-5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M4 8l8 5 8-5M12 13v8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  payments: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  account: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  restaurants: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 3v9a4 4 0 0 0 4 4v5h1V3M4 3v6h2M4 3h2v6M18 3c-2 0-3 2-3 5s1 5 3 5v8h1V3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  riders: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="17" r="3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="17" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6 17l4-8h4l4 8M10 9h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  safety: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
};

export function HelpCentre() {
  const [category, setCategory] = useState<HelpCategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HELP_ARTICLES.filter((article) => {
      if (category !== "all" && article.category !== category) return false;
      if (!q) return true;
      return (
        article.question.toLowerCase().includes(q) ||
        article.answer.toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  const activeCategory = HELP_CATEGORIES.find((c) => c.id === category);

  return (
    <>
      <section className="shell max-w-page pt-8 text-center">
        <h1 className="font-display mb-3 text-[clamp(2rem,5vw,2.75rem)]">
          How can we help?
        </h1>
        <p className="text-fg-subtle mb-8 text-base">
          Search our help center or browse a topic below
        </p>

        <div className="border-hairline bg-surface mx-auto flex max-w-focus items-center gap-2.5 rounded-full border-2 px-5.5 py-3.5">
          <SearchIcon className="text-fg-subtle flex-none" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpenIndex(0);
            }}
            placeholder={`Search e.g. "late delivery", "refund"`}
            aria-label="Search help articles"
            className="text-fg placeholder:text-fg-subtle w-full bg-transparent text-[15px] outline-none"
          />
        </div>
      </section>

      {/* Categories -------------------------------------------------------- */}
      <section className="shell max-w-page pt-section">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {HELP_CATEGORIES.map((entry) => {
            const active = entry.id === category;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => {
                    // Tapping the active card clears the filter.
                    setCategory(active ? "all" : entry.id);
                    setOpenIndex(0);
                  }}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full flex-col items-start gap-3 rounded-[20px] border-2 px-4 py-5.5 text-left",
                    "transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-strong)]",
                    "hover-fine:-translate-y-0.75 active:translate-y-0",
                    active
                      ? "border-primary bg-surface-3"
                      : "border-hairline bg-surface-alt",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9.5 flex-none items-center justify-center rounded-[11px]",
                      entry.tint,
                    )}
                  >
                    {CATEGORY_ICONS[entry.id]}
                  </span>
                  <span className="text-fg text-[14.5px] font-extrabold">
                    {entry.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Articles ---------------------------------------------------------- */}
      <section className="shell max-w-narrow pt-section">
        <h2 className="font-display mb-2 text-[26px]">
          {activeCategory ? activeCategory.label : "Popular questions"}
        </h2>
        <p className="text-fg-subtle mb-6 text-sm">
          {results.length} {pluralize(results.length, "article")}
        </p>

        {results.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {results.map((article, index) => {
              const open = openIndex === index;
              return (
                <li
                  key={article.question}
                  className="border-hairline bg-surface overflow-hidden rounded-[18px] border-2"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? -1 : index)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5.5 py-4.5 text-left"
                    >
                      <span className="text-fg text-[15px] font-bold">
                        {article.question}
                      </span>
                      <span
                        className={cn(
                          "bg-surface-3 text-primary flex size-6.5 flex-none items-center justify-center rounded-full",
                          "transition-transform duration-200 ease-[var(--ease-out-strong)]",
                          open && "rotate-180",
                        )}
                      >
                        <ChevronDownIcon />
                      </span>
                    </button>
                  </h3>

                  {open && (
                    <p className="text-fg-muted px-5.5 pb-5 text-sm leading-relaxed">
                      {article.answer}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            variant="search"
            frame="bare"
            title="No articles found"
            description={`Nothing matched “${query}”. Try a different search, or contact support below.`}
          />
        )}
      </section>
    </>
  );
}
