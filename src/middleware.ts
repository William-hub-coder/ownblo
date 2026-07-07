import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./lib/i18n/config";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const COOKIE_NAME = "__Host-admin_token";
const ADMIN_LOGIN = "/admin/login";
const ADMIN_API_AUTH = "/api/admin/auth";
const ADMIN_API_CSRF = "/api/admin/csrf";

/** Apply security headers to every response */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "0"); // Deprecated but signals intent
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  return response;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response: NextResponse;

  // Allow admin auth API (login/logout) and CSRF endpoint
  if (pathname === ADMIN_API_AUTH || pathname === ADMIN_API_CSRF) {
    response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Handle admin routes — require auth cookie
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // Allow login page without auth check
    if (pathname === ADMIN_LOGIN) {
      // If already authenticated, redirect to dashboard
      const token = request.cookies.get(COOKIE_NAME)?.value;
      if (token) {
        response = NextResponse.redirect(new URL("/admin", request.url));
        return addSecurityHeaders(response);
      }
      response = NextResponse.next();
      return addSecurityHeaders(response);
    }

    // All other admin routes require a token cookie
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      response = NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
      return addSecurityHeaders(response);
    }

    // Token presence check passes — actual verification happens in API routes
    response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // API routes — no locale prefix
  if (pathname.startsWith("/api/")) {
    response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Public assets — no locale prefix
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Apply i18n middleware
  response = intlMiddleware(request);
  return addSecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!_next|api|images|uploads|favicon.ico|.*\\..*).*)"],
};
