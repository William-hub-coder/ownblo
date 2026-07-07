/**
 * CSRF protection using double-submit cookie pattern.
 *
 * Flow:
 * 1. Client calls GET /api/admin/auth/csrf → receives token in
 *    X-CSRF-Token header + __Host-csrf cookie (httpOnly, SameSite=Strict).
 * 2. Client sends token in X-CSRF-Token header on state-changing requests.
 * 3. Server compares header value with cookie value — attacker can't read
 *    the httpOnly cookie, so they can't forge the header.
 */

const TOKEN_BYTES = 32; // 256-bit token

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateCsrfToken(): string {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Verify CSRF token: cookie value must match header value.
 */
export function verifyCsrfToken(
  cookieValue: string | undefined,
  headerValue: string | null,
): boolean {
  if (!cookieValue || !headerValue) return false;
  return timingSafeEqual(cookieValue, headerValue);
}

export const CSRF_COOKIE_NAME = "__Host-csrf";
export const CSRF_HEADER_NAME = "x-csrf-token";
