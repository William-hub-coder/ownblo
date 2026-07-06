"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Home, FolderOpen, Camera, FileText, User, Bookmark, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useLocale } from "next-intl";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { key: "home", href: "", icon: Home },
  { key: "projects", href: "/projects", icon: FolderOpen },
  { key: "photography", href: "/photography", icon: Camera },
  { key: "blog", href: "/blog", icon: FileText },
  { key: "about", href: "/about", icon: User },
  { key: "bookmarks", href: "/bookmarks", icon: Bookmark },
  { key: "contact", href: "/contact", icon: Mail },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-[80%] max-w-sm bg-cyber-surface border-l border-cyber-border"
          >
            <div className="flex items-center justify-between p-6 border-b border-cyber-border">
              <span className="text-lg font-bold gradient-text">Menu</span>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-cyber-muted hover:text-cyber-text transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => {
                const href = `/${locale}${item.href}`;
                const isActive = pathname === href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/30"
                        : "text-cyber-muted hover:text-cyber-text hover:bg-cyber-border/20"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {t(item.key)}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 border-t border-cyber-border pt-6 mx-6">
              <ThemeToggle />
              <LocaleSwitcher />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
