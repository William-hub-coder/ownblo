"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, Camera, Image, FileText,
  Bookmark, Settings, User, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { adminT } from "@/lib/admin-i18n";
import { ToastProvider } from "@/components/admin/Toast";
import { UploadModal } from "@/components/admin/UploadModal";
import { patchFetchForEoToken } from "@/lib/fetch-with-eo-token";

const adminNav = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "profile", href: "/admin/profile", icon: User },
  { key: "settings", href: "/admin/settings", icon: Settings },
  { key: "projects", href: "/admin/projects", icon: FolderOpen },
  { key: "articles", href: "/admin/articles", icon: FileText },
  { key: "bookmarks", href: "/admin/bookmarks", icon: Bookmark },
  { key: "albums", href: "/admin/albums", icon: Image },
  { key: "media", href: "/admin/media", icon: Camera },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { patchFetchForEoToken(); }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const sidebar = (
    <nav className="flex-1 px-3 space-y-1">
      {adminNav.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link key={item.key} href={item.href} onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-[var(--cosmic-accent-cyan)]/10 text-[var(--cosmic-accent-cyan)] border border-[var(--cosmic-accent-cyan)]/20"
                : "text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-text-primary)] hover:bg-[var(--cosmic-orbit-glow)]/10"
            }`}>
            <Icon className="h-4 w-4" />
            <span>{adminT(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <ToastProvider>
    <div className="flex min-h-screen bg-[var(--cosmic-bg-primary)]">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)]">
        <div className="p-6">
          <Link href="/admin" className="text-lg font-bold gradient-text">{adminT("adminPanel")}</Link>
        </div>
        {sidebar}
        <div className="p-4 border-t border-[var(--cosmic-orbit-glow)] space-y-1">
          <button onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--cosmic-star-dim)] hover:text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut className="h-4 w-4" /> {adminT("logout")}
          </button>
          <Link href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-text-primary)] transition-colors">
            {adminT("backToSite")}
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--cosmic-bg-card)] border-r border-[var(--cosmic-orbit-glow)] transform transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/admin" className="text-lg font-bold gradient-text">{adminT("adminPanel")}</Link>
          <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-text-primary)]"><X className="h-5 w-5" /></button>
        </div>
        {sidebar}
        <div className="p-4 border-t border-[var(--cosmic-orbit-glow)] space-y-1">
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--cosmic-star-dim)] hover:text-red-400 transition-colors">
            <LogOut className="h-4 w-4" /> {adminT("logout")}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 p-4 border-b border-[var(--cosmic-orbit-glow)] md:hidden">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-text-primary)]"><Menu className="h-5 w-5" /></button>
          <span className="font-bold gradient-text">{adminT("adminPanel")}</span>
        </div>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
    <UploadModal />
    </ToastProvider>
  );
}
