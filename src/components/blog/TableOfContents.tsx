"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

type TocItem = { id: string; text: string; level: number };

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = Array.from(
      document.querySelector("article")?.querySelectorAll("h2, h3") ?? [],
    );
    const tocItems: TocItem[] = headings.map((h) => ({
      id: h.id,
      text: h.textContent ?? "",
      level: Number(h.tagName[1]),
    }));
    setItems(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (items.length < 2) return null;

  return (
    <nav className="hidden lg:block sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <h4 className="text-xs font-semibold text-[var(--cyber-muted)] uppercase tracking-wider mb-3">
        On this page
      </h4>
      <ul className="space-y-1.5 border-l border-[var(--cyber-border)]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-sm transition-colors py-0.5",
                item.level === 3 ? "pl-4" : "pl-3",
                activeId === item.id
                  ? "text-[var(--cyber-primary)] border-l-2 border-[var(--cyber-primary)] -ml-[2px]"
                  : "text-[var(--cyber-muted)] hover:text-[var(--cyber-text)] border-l-2 border-transparent -ml-[2px]",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
