/**
 * Simple in-memory rate limiter.
 * Limits failed login attempts per IP.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000; // 1 minute
const BLOCK_MS = 300_000; // 5 minute block after exceeding

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    // Block for 5 minutes
    if (now < entry.resetAt + BLOCK_MS - WINDOW_MS) {
      return { allowed: false, retryAfter: Math.ceil((entry.resetAt + BLOCK_MS - WINDOW_MS - now) / 1000) };
    }
    // Reset after block
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  entry.count++;
  return { allowed: true };
}

export function resetRateLimit(ip: string): void {
  attempts.delete(ip);
}
