"use client";

import { useState, useMemo } from "react";
import { Bookmark as BookmarkIcon, ExternalLink, Search } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { GlowCard } from "@/components/shared/GlowCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { BookmarkData } from "@/data/bookmarks";

type BookmarkGridProps = {
  bookmarks: BookmarkData[];
  categories: string[];
  searchPlaceholder: string;
  allCategoriesLabel: string;
  noBookmarksTitle: string;
  noBookmarksDesc: string;
};

export function BookmarkGrid({
  bookmarks,
  categories,
  searchPlaceholder,
  allCategoriesLabel,
  noBookmarksTitle,
  noBookmarksDesc,
}: BookmarkGridProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    let result = bookmarks;

    // Apply category filter
    if (activeCategory !== "all") {
      result = result.filter((b) => b.category === activeCategory);
    }

    // Apply search filter
    if (query.trim()) {
      const lower = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(lower) ||
          b.description?.toLowerCase().includes(lower) ||
          b.category.toLowerCase().includes(lower),
      );
    }

    return result;
  }, [bookmarks, activeCategory, query]);

  return (
    <>
      {/* Search */}
      <div className="mt-10 relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--cyber-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 pl-10 pr-4 py-3 text-sm text-[var(--cyber-text)] placeholder:text-[var(--cyber-muted)] focus:outline-none focus:border-[var(--cyber-primary)] focus:ring-1 focus:ring-[var(--cyber-primary)]/30 transition-all duration-300"
        />
      </div>

      {/* Category Filter */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-all duration-300 ${
              activeCategory === cat
                ? "bg-[var(--cyber-primary)]/10 text-[var(--cyber-primary)] border-[var(--cyber-primary)]"
                : "border-[var(--cyber-border)] text-[var(--cyber-muted)] hover:text-[var(--cyber-primary)] hover:border-[var(--cyber-primary)]"
            }`}
          >
            {cat === "all" ? allCategoriesLabel : cat}
          </button>
        ))}
      </div>

      {/* Bookmarks Grid */}
      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((bookmark, index) => (
            <ScrollReveal key={bookmark.id} delay={index * 0.05}>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                <GlowCard className="p-5 h-full flex flex-col group">
                  <div className="flex items-start justify-between mb-2">
                    <BookmarkIcon className="h-5 w-5 text-[var(--cyber-primary)] flex-shrink-0" />
                    <ExternalLink className="h-3.5 w-3.5 text-[var(--cyber-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--cyber-text)] mb-1 line-clamp-1">
                    {bookmark.title}
                  </h3>
                  <p className="text-xs text-[var(--cyber-muted)] line-clamp-2 flex-1">
                    {bookmark.description}
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-[var(--cyber-primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--cyber-primary)] capitalize">
                    {bookmark.category}
                  </span>
                </GlowCard>
              </a>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            icon={<BookmarkIcon className="h-12 w-12" />}
            title={query || activeCategory !== "all" ? "No results found" : noBookmarksTitle}
            description={query || activeCategory !== "all" ? "Try a different search or category." : noBookmarksDesc}
          />
        </div>
      )}
    </>
  );
}
