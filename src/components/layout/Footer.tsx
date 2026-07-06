"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Heart } from "lucide-react"
import { GithubIcon, TwitterIcon } from "@/components/shared/BrandIcons";

type SiteConfigProps = {
  siteName: string;
  githubUrl: string;
  twitterUrl: string;
  email: string;
};

export function Footer({ config }: { config: SiteConfigProps }) {
  const t = useTranslations("footer");
  const navT = useTranslations("nav");
  const locale = useLocale();

  const socialLinks = [
    { name: "GitHub", href: config.githubUrl || "https://github.com", icon: GithubIcon },
    { name: "Twitter", href: config.twitterUrl || "https://twitter.com", icon: TwitterIcon },
    { name: "Email", href: config.email ? `mailto:${config.email}` : "mailto:hello@your-domain.com", icon: Mail },
  ];

  const footerNav = [
    { key: "home", href: "" },
    { key: "projects", href: "/projects" },
    { key: "photography", href: "/photography" },
    { key: "blog", href: "/blog" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
  ];

  return (
    <footer className="border-t border-cyber-border bg-cyber-bg pb-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href={`/${locale}`}
              className="text-lg font-bold gradient-text"
            >
              {config.siteName}
            </Link>
            <p className="mt-3 text-sm text-cyber-muted leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-cyber-text mb-3">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="text-sm text-cyber-muted hover:text-cyber-primary transition-colors duration-300"
                  >
                    {navT(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-cyber-text mb-3">
              Social
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-cyber-muted hover:text-cyber-primary hover:bg-cyber-border/20 transition-all duration-300"
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold text-cyber-text mb-3">
              Tech Stack
            </h3>
            <p className="text-sm text-cyber-muted leading-relaxed">
              {t("built_with")}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-cyber-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cyber-muted">
            © {new Date().getFullYear()} {config.siteName}. {t("rights")}.
          </p>
          <p className="text-xs text-cyber-muted flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500" /> using Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
