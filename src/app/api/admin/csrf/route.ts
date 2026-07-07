import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/auth/csrf";

/**
 * GET /api/admin/csrf
 *
 * Issues a new CSRF token. The token is returned in both:
 * 1. An httpOnly, SameSite=Strict cookie (automatic with every request)
 * 2. The X-CSRF-Token response header (client reads this and sends it back)
 *
 * The client must include X-CSRF-Token header in all state-changing requests.
 */
export async function GET() {
  const token = generateCsrfToken();

  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return NextResponse.json(
    { ok: true },
    { headers: { [CSRF_HEADER_NAME]: token } },
  );
}
