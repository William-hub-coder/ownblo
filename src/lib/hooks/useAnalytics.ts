"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight page view tracking hook.
 * Sends a fire-and-forget POST to /api/stats on each page navigation.
 * Non-blocking — failures are silently ignored.
 */
export function usePageView() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_path: pathname,
        referrer: document.referrer,
      }),
    }).catch(() => {
      // Analytics is non-critical — silently fail
    });
  }, [pathname]);
}
