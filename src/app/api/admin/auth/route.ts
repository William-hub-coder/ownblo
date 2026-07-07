import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword, createToken, verifyToken } from "@/lib/auth/password";
import { checkRateLimit, resetRateLimit } from "@/lib/auth/rate-limit";
import { verifyCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/auth/csrf";
import { revokeToken } from "@/lib/auth/session-store";

const AUTH_COOKIE = "__Host-admin_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

function getClientIP(request: Request): string {
  const h = request.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "127.0.0.1"
  );
}

/** Set security headers on auth responses */
function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  return response;
}

// ── GET /api/admin/auth — check auth status ──────────────────────────
export async function GET(_request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return withSecurityHeaders(
      NextResponse.json({ authenticated: false }),
    );
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return withSecurityHeaders(
      NextResponse.json({ authenticated: false }),
    );
  }

  return withSecurityHeaders(
    NextResponse.json({
      authenticated: true,
      expiresAt: payload.exp,
    }),
  );
}

// ── POST /api/admin/auth — login ─────────────────────────────────────
export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);

    // ── Rate limit check ────────────────────────────────────────────
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      return withSecurityHeaders(
        NextResponse.json(
          {
            error: `Too many attempts. Retry in ${rate.retryAfter}s`,
            retryAfter: rate.retryAfter,
          },
          { status: 429 },
        ),
      );
    }

    // ── CSRF check ──────────────────────────────────────────────────
    const cookieStore = await cookies();
    const csrfCookie = cookieStore.get(CSRF_COOKIE_NAME)?.value;
    const csrfHeader = request.headers.get(CSRF_HEADER_NAME);
    if (!verifyCsrfToken(csrfCookie, csrfHeader)) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Invalid request" }, { status: 403 }),
      );
    }

    // ── Parse & validate body ───────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return withSecurityHeaders(
        NextResponse.json({ error: "Invalid request" }, { status: 400 }),
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      !("password" in body)
    ) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Invalid request" }, { status: 400 }),
      );
    }

    const { password } = body as Record<string, unknown>;

    if (
      typeof password !== "string" ||
      password.length === 0 ||
      password.length > 128
    ) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Invalid request" }, { status: 400 }),
      );
    }

    // ── Verify password ─────────────────────────────────────────────
    const storedHash = process.env.ADMIN_PASSWORD_HASH;

    if (!storedHash) {
      console.error(
        "============================================================\n" +
        "MISSING ADMIN_PASSWORD_HASH env variable.\n" +
        "Generate one with: node -e \"const crypto=require('crypto');" +
        "const s=crypto.randomUUID();crypto.subtle.digest('SHA-256'," +
        "new TextEncoder().encode(s+':YOUR_PASSWORD')).then(h=>" +
        "console.log(s+':'+Array.from(new Uint8Array(h)).map(" +
        "b=>b.toString(16).padStart(2,'0')).join('')))\"\n" +
        "Then add it to .env.local as ADMIN_PASSWORD_HASH=\"...\"\n" +
        "============================================================",
      );
      return withSecurityHeaders(
        NextResponse.json(
          { error: "Server not configured" },
          { status: 500 },
        ),
      );
    }

    const valid = await verifyPassword(password, storedHash);

    if (!valid) {
      return withSecurityHeaders(
        NextResponse.json(
          {
            error: "密码错误",
            attemptsRemaining: rate.attemptsRemaining,
          },
          { status: 401 },
        ),
      );
    }

    // ── Success: create token, reset rate limit ─────────────────────
    resetRateLimit(ip);

    const token = await createToken({ role: "admin" }, COOKIE_MAX_AGE);
    const cookieStore2 = await cookies();
    cookieStore2.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return withSecurityHeaders(
      NextResponse.json({ success: true }),
    );
  } catch {
    return withSecurityHeaders(
      NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      ),
    );
  }
}

// ── DELETE /api/admin/auth — logout ──────────────────────────────────
export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  // Revoke token so it can't be reused
  if (token) {
    const payload = await verifyToken(token);
    if (payload?.jti) {
      await revokeToken(payload.jti as string);
    }
  }

  cookieStore.delete(AUTH_COOKIE);

  return withSecurityHeaders(
    NextResponse.json({ success: true }),
  );
}
