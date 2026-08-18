"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "@/components/icons";
import { SEARCH_SUGGESTIONS } from "@/lib/data";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function go(term: string) {
    const trimmed = term.trim();
    router.push(
      trimmed ? `/browse?q=${encodeURIComponent(trimmed)}` : "/browse",
    );
  }

  return (
    <>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          go(query);
        }}
        className="bg-surface mb-7 flex items-center gap-2 rounded-[28px] border-[3px] border-[var(--color-fg)] p-2.5 shadow-[0_8px_0_var(--color-fg),0_24px_45px_-20px_rgba(43,27,18,0.35)]"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 px-3.5 py-3">
          <SearchIcon className="text-fg-subtle flex-none" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search food or restaurants"
            aria-label="Search food or restaurants"
            className="text-fg placeholder:text-fg-subtle w-full min-w-0 bg-transparent text-[15px] outline-none"
          />
        </div>
        <button
          type="submit"
          className="press bg-primary text-canvas flex-none rounded-full border-[3px] border-[var(--color-fg)] px-7 py-3.5 text-[15px] font-extrabold whitespace-nowrap shadow-[0_6px_0_var(--color-fg)] hover:shadow-[0_3px_0_var(--color-fg)] active:shadow-[0_2px_0_var(--color-fg)]"
        >
          Find Food 🍔
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-fg-muted mr-0.5 text-[13px] font-semibold">
          Popular:
        </span>
        {SEARCH_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => go(suggestion)}
            className="rounded-full border-2 border-white/50 bg-white/15 px-4.5 py-2 text-sm font-bold text-white backdrop-blur-[4px] transition-[transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-strong)] hover-fine:-translate-y-0.5 hover-fine:border-[var(--color-accent)] hover-fine:bg-[var(--color-accent)] hover-fine:text-[var(--color-canvas)] active:translate-y-0"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </>
  );
}
