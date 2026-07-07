"use client";

/**
 * EdgeOne preview links require eo_token + eo_time query params on EVERY request.
 * This utility reads the token from the URL on first load, persists it in sessionStorage
 * (survives Next.js client-side navigations which strip query params), and patches
 * window.fetch to auto-append the params to same-origin API calls.
 */

let patched = false;

function getEoParams(): string {
  if (typeof window === "undefined") return "";

  // Try sessionStorage first — survives SPA navigations that strip query params
  let params = sessionStorage.getItem("__eo_params__");
  if (params) return params;

  // Read from initial URL on first load
  const search = window.location.search;
  const urlParams = new URLSearchParams(search);
  const token = urlParams.get("eo_token");
  const time = urlParams.get("eo_time");
  if (!token && !time) return "";

  const parts: string[] = [];
  if (token) parts.push(`eo_token=${encodeURIComponent(token)}`);
  if (time) parts.push(`eo_time=${encodeURIComponent(time)}`);
  params = parts.join("&");
  if (params) {
    sessionStorage.setItem("__eo_params__", params);
  }
  return params;
}

export function patchFetchForEoToken() {
  if (patched || typeof window === "undefined") return;
  const eoParams = getEoParams();
  if (!eoParams) return; // No token to inject
  patched = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    let url: string;
    let isRequest = false;
    if (typeof input === "string") {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else {
      url = input.url;
      isRequest = true;
    }

    // Only modify same-origin API requests
    const isSameOrigin =
      url.startsWith("/") ||
      url.startsWith(window.location.origin);
    const isApi = url.includes("/api/");

    if (isSameOrigin && isApi) {
      const separator = url.includes("?") ? "&" : "?";
      url = url + separator + eoParams;

      if (isRequest) {
        input = new Request(url, input as Request);
      } else {
        input = url;
      }
    }

    return originalFetch(input, init);
  };
}
