"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";

const navItems = [
  { key: "home", href: "" },
  { key: "projects", href: "/projects" },
  { key: "photography", href: "/photography" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
  { key: "bookmarks", href: "/bookmarks" },
  { key: "contact", href: "/contact" },
];

export function Navigation({ siteName }: { siteName: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass shadow-lg shadow-cyber-primary/5"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="text-xl font-bold gradient-text hover:opacity-80 transition-opacity"
            >
              {siteName}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const href = `/${locale}${item.href}`;
                const isActive = pathname === href;

                return (
                  <Link
                    key={item.key}
                    href={href}
                    className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-cyber-primary"
                        : "text-cyber-muted hover:text-cyber-text"
                    }`}
                  >
                    {t(item.key)}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-gradient-to-r from-cyber-primary to-cyber-accent" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1">
                <ThemeToggle />
                <LocaleSwitcher />
              </div>
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden rounded-lg p-2 text-cyber-muted hover:text-cyber-text transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />
    </>
  );
}
