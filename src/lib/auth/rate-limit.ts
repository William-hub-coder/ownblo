/**
 * Rate limiter with progressive lockout.
 *
 * Rates:
 *   Attempts 1-5  → normal, per-window limit
 *   Attempts 6-10 → lockout 5 minutes
 *   Attempts 11+  → lockout 30 minutes
 *
 * In-memory store for simplicity. For multi-instance deployments,
 * replace with a database-backed store.
 */

interface AttemptEntry {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number;
}

const store = new Map<string, AttemptEntry>();

/** Clean up stale entries every 10 minutes */
const STALE_MS = 60 * 60 * 1000; // 1 hour

function prune() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.firstAttemptAt > STALE_MS && now > entry.lockedUntil) {
      store.delete(key);
    }
  }
}

if (typeof setInterval !== "undefined") {
  setInterval(prune, 10 * 60 * 1000);
}

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 60;
const LOCKOUT_SHORT_SECONDS = 5 * 60; // 5 min
const LOCKOUT_LONG_SECONDS = 30 * 60; // 30 min

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // seconds
  attemptsRemaining?: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  // No previous attempts or window expired
  if (!entry || now > entry.firstAttemptAt + WINDOW_SECONDS * 1000) {
    store.set(ip, { count: 1, firstAttemptAt: now, lockedUntil: 0 });
    return { allowed: true, attemptsRemaining: MAX_ATTEMPTS - 1 };
  }

  // Currently locked out?
  if (entry.lockedUntil > now) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.lockedUntil - now) / 1000),
    };
  }

  // Increment
  entry.count++;

  // Determine lockout
  if (entry.count > 10) {
    entry.lockedUntil = now + LOCKOUT_LONG_SECONDS * 1000;
    return { allowed: false, retryAfter: LOCKOUT_LONG_SECONDS };
  }
  if (entry.count > MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_SHORT_SECONDS * 1000;
    return { allowed: false, retryAfter: LOCKOUT_SHORT_SECONDS };
  }

  return {
    allowed: true,
    attemptsRemaining: MAX_ATTEMPTS - entry.count,
  };
}

export function resetRateLimit(ip: string): void {
  store.delete(ip);
}
