"use client";

import { useEffect } from "react";
import { patchFetchForEoToken } from "@/lib/fetch-with-eo-token";

/**
 * Invisible component that patches window.fetch to include EdgeOne
 * preview token (eo_token, eo_time) in all same-origin API requests.
 * Include this once in the root layout tree to cover all pages.
 */
export default function EoTokenInjector() {
  useEffect(() => {
    patchFetchForEoToken();
  }, []);

  return null;
}
