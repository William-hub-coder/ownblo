/**
 * Token revocation store.
 *
 * In production with multiple serverless instances, this should be backed by a
 * shared store (Redis, database). For a personal blog on a single-instance
 * platform, an in-memory Map with periodic pruning is sufficient and safe.
 */

interface RevokedToken {
  jti: string;
  revokedAt: number;
}

const revokedTokens = new Map<string, RevokedToken>();

/** Auto-prune entries older than 7 days (max JWT lifetime) */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function prune() {
  const now = Date.now();
  for (const [jti, entry] of revokedTokens) {
    if (now - entry.revokedAt > MAX_AGE_MS) {
      revokedTokens.delete(jti);
    }
  }
}

// Prune once per hour
if (typeof setInterval !== "undefined") {
  setInterval(prune, 60 * 60 * 1000);
}

export async function revokeToken(jti: string): Promise<void> {
  revokedTokens.set(jti, { jti, revokedAt: Date.now() });
}

export async function isTokenRevoked(jti: string): Promise<boolean> {
  prune();
  return revokedTokens.has(jti);
}

/** Revoke all tokens — "sign out everywhere" */
export async function revokeAllTokens(): Promise<number> {
  const count = revokedTokens.size;
  revokedTokens.clear();
  return count;
}
