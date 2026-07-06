"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderOpen, FileText, Bookmark, Settings, Image, Plus, Camera } from "lucide-react";
import { adminT } from "@/lib/admin-i18n";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, articles: 0, bookmarks: 0, albums: 0, media: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [proj, art, bm, alb, media] = await Promise.all([
        fetch("/api/admin/projects").then((r) => r.json()).catch(() => []),
        fetch("/api/admin/articles").then((r) => r.json()).catch(() => []),
        fetch("/api/admin/bookmarks").then((r) => r.json()).catch(() => []),
        fetch("/api/admin/albums").then((r) => r.json()).catch(() => []),
        fetch("/api/admin/media").then((r) => r.json()).catch(() => []),
      ]);
      setStats({
        projects: Array.isArray(proj) ? proj.length : 0,
        articles: Array.isArray(art) ? art.length : 0,
        bookmarks: Array.isArray(bm) ? bm.length : 0,
        albums: Array.isArray(alb) ? alb.length : 0,
        media: media && typeof media === "object" && "total" in media ? (media as { total: number }).total : 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: adminT("projects"), value: stats.projects, icon: FolderOpen, href: "/admin/projects", color: "text-[var(--cosmic-accent-cyan)]" },
    { label: adminT("articles"), value: stats.articles, icon: FileText, href: "/admin/articles", color: "text-green-400" },
    { label: adminT("bookmarks"), value: stats.bookmarks, icon: Bookmark, href: "/admin/bookmarks", color: "text-yellow-400" },
    { label: adminT("albums"), value: stats.albums, icon: Camera, href: "/admin/albums", color: "text-[var(--cosmic-accent-purple)]" },
    { label: adminT("media"), value: stats.media, icon: Image, href: "/admin/media", color: "text-blue-400" },
    { label: adminT("settings"), value: "—", icon: Settings, href: "/admin/settings", color: "text-[var(--cosmic-accent-gold)]" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--cosmic-text-primary)] mb-2">{adminT("dashboard")}</h1>
      <p className="text-sm text-[var(--cosmic-star-dim)] mb-8">{adminT("welcome")}</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}
              className="rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] p-5 hover:border-[var(--cosmic-accent-cyan)]/50 transition-all duration-200 hud-corners">
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`h-5 w-5 ${card.color}`} />
                <span className="text-sm text-[var(--cosmic-star-dim)]">{card.label}</span>
              </div>
              <p className="text-2xl font-bold text-[var(--cosmic-text-primary)]">{loading ? "—" : card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] p-6 hud-corners">
        <h2 className="text-lg font-semibold text-[var(--cosmic-text-primary)] mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-[var(--cosmic-accent-cyan)]" /> {adminT("quickActions")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "+ " + adminT("newProject"), href: "/admin/projects" },
            { label: "+ " + adminT("newArticle"), href: "/admin/articles" },
            { label: "+ " + adminT("newBookmark"), href: "/admin/bookmarks" },
            { label: adminT("upload"), href: "/admin/media" },
          ].map((action) => (
            <Link key={action.label} href={action.href}
              className="rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)]/50 px-4 py-3 text-sm text-[var(--cosmic-text-primary)] hover:border-[var(--cosmic-accent-cyan)] hover:text-[var(--cosmic-accent-cyan)] transition-all duration-200 text-center">
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
