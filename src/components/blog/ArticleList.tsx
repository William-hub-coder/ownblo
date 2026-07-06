"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, FileText, Eye, Clock } from "lucide-react";
import { useLocale } from "next-intl";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { GlowCard } from "@/components/shared/GlowCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { ArticleData } from "@/data/articles";

type ArticleListItem = { slug: string } & ArticleData;

type ArticleListProps = {
  articles: ArticleListItem[];
  searchPlaceholder: string;
  readingTimeLabel: string;
  noArticlesTitle: string;
  noArticlesDesc: string;
};

export function ArticleList({
  articles,
  searchPlaceholder,
  readingTimeLabel,
  noArticlesTitle,
  noArticlesDesc,
}: ArticleListProps) {
  const [query, setQuery] = useState("");
  const [views, setViews] = useState<Record<string, number>>({});
  const locale = useLocale();

  useEffect(() => {
    fetch("/api/views").then(r => r.json()).then(d => setViews(d.articles || {})).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return articles;
    const lower = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        a.excerpt?.toLowerCase().includes(lower) ||
        a.tags?.some((t) => t.toLowerCase().includes(lower)),
    );
  }, [articles, query]);

  return (
    <>
      {/* Search Bar */}
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

      {/* Articles List */}
      {filtered.length > 0 ? (
        <div className="mt-10 space-y-4">
          {filtered.map((article, index) => (
            <ScrollReveal key={article.slug} delay={index * 0.05}>
              <GlowCard href={`/${locale}/blog/${article.slug}`} className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {article.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--cyber-accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--cyber-accent)] border border-[var(--cyber-accent)]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-semibold text-[var(--cyber-text)] mb-2 group-hover:text-[var(--cyber-primary)] transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-[var(--cyber-muted)] line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-[var(--cyber-muted)]">
                  <span>{article.published_at}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.reading_time}{readingTimeLabel}</span>
                  {views[article.slug] !== undefined && (
                    <><span>·</span><span className="flex items-center gap-1"><Eye className="h-3 w-3" />{views[article.slug]}</span></>
                  )}
                </div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title={query ? "No results found" : noArticlesTitle}
            description={query ? "Try a different search term." : noArticlesDesc}
          />
        </div>
      )}
    </>
  );
}
