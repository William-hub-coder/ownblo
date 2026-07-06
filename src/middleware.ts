import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./lib/i18n/config";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const COOKIE_NAME = "admin_token";
const ADMIN_LOGIN = "/admin/login";
const ADMIN_API_AUTH = "/api/admin/auth";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow admin auth API (login/logout)
  if (pathname === ADMIN_API_AUTH) {
    return NextResponse.next();
  }

  // Handle admin routes — require auth cookie
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // Allow login page without auth check
    if (pathname === ADMIN_LOGIN) {
      // If already authenticated, redirect to dashboard
      const token = request.cookies.get(COOKIE_NAME)?.value;
      if (token) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // All other admin routes require a token cookie
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    }

    // Token presence check passes — actual verification happens in API routes
    return NextResponse.next();
  }

  // API routes — no locale prefix
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Public assets — no locale prefix
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Apply i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|api|images|uploads|favicon.ico|.*\\..*).*)"],
};
