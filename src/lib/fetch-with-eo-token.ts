"use client";

/**
 * EdgeOne preview links require eo_token + eo_time query params on EVERY request.
 * This module patches window.fetch to auto-append them to same-origin API calls.
 */

let patched = false;

function getEoParams(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const token = params.get("eo_token");
  const time = params.get("eo_time");
  if (!token && !time) return "";
  const parts: string[] = [];
  if (token) parts.push(`eo_token=${encodeURIComponent(token)}`);
  if (time) parts.push(`eo_time=${encodeURIComponent(time)}`);
  return parts.length ? parts.join("&") : "";
}

export function patchFetchForEoToken() {
  if (patched || typeof window === "undefined") return;
  patched = true;

  const eoParams = getEoParams();
  if (!eoParams) return; // No token to inject

  const originalFetch = window.fetch.bind(window);

  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    let url: string;
    if (typeof input === "string") {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else {
      // It's a Request object — append params to its url
      url = input.url;
    }

    // Only modify same-origin /api/ requests
    const isSameOrigin =
      url.startsWith("/") ||
      url.startsWith(window.location.origin);
    const isApi = url.includes("/api/");

    if (isSameOrigin && isApi) {
      const separator = url.includes("?") ? "&" : "?";
      url = url + separator + eoParams;

      if (input instanceof Request) {
        input = new Request(url, input);
      } else {
        input = url;
      }
    }

    return originalFetch(input, init);
  };
}
