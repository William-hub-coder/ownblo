"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = () => {
    const nextLocale = locale === "zh" ? "en" : "zh";
    // Replace locale segment in pathname
    const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`);
    startTransition(() => {
      router.replace(newPathname);
    });
  };

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="rounded-lg px-2 py-1 text-sm font-medium text-cyber-muted hover:text-cyber-primary transition-all duration-300 hover:scale-105 border border-cyber-border hover:border-cyber-primary"
      aria-label="Switch language"
    >
      {locale === "zh" ? "EN" : "中文"}
    </button>
  );
}
