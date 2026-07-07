/**
 * Auth utilities using Web Crypto API.
 * No external dependencies — SHA-256 for passwords, HMAC-SHA256 for JWT.
 */

const JWT_SECRET_KEY =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === "production"
    ? ""
    : "admin-jwt-secret-dev-only-change-in-production");

/** Maximum password length to prevent DoS via hash computation */
const MAX_PASSWORD_LENGTH = 128;

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Hash a password with SHA-256 + salt.
 * Returns: "salt:hash" hex-encoded string.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID();
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + ":" + password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${salt}:${hex}`;
}

/**
 * Verify a password against a stored "salt:hash" string.
 * Uses constant-time comparison on the hash portion.
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  // Reject unreasonably long passwords before hashing
  if (password.length > MAX_PASSWORD_LENGTH) return false;

  const parts = stored.split(":");
  if (parts.length !== 2) return false;

  const [salt, originalHash] = parts;
  if (!salt || !originalHash) return false;

  const encoder = new TextEncoder();
  const data = encoder.encode(salt + ":" + password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(hex, originalHash);
}

/**
 * Create a JWT token valid for `expiresIn` seconds (default 7 days).
 */
export async function createToken(
  payload: Record<string, unknown>,
  expiresIn = 7 * 24 * 60 * 60,
): Promise<string> {
  const encoder = new TextEncoder();

  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresIn, jti: crypto.randomUUID() };

  const base64Header = btoa(JSON.stringify(header))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const base64Payload = btoa(JSON.stringify(fullPayload))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const signingInput = `${base64Header}.${base64Payload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(signingInput),
  );
  const base64Signature = btoa(
    String.fromCharCode(...new Uint8Array(signature)),
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${signingInput}.${base64Signature}`;
}

/**
 * Verify a JWT token and return its payload, or null if invalid/expired.
 * Checks against the revocation store.
 */
export async function verifyToken(
  token: string,
): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [base64Header, base64Payload, base64Signature] = parts;
    const signingInput = `${base64Header}.${base64Payload}`;

    // Verify signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const signatureBytes = Uint8Array.from(
      atob(base64Signature.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0),
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(signingInput),
    );

    if (!valid) return null;

    // Decode payload
    const payloadJson = atob(
      base64Payload.replace(/-/g, "+").replace(/_/g, "/"),
    );
    const payload = JSON.parse(payloadJson);

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    // Check revocation
    const { isTokenRevoked } = await import("./session-store");
    if (payload.jti && (await isTokenRevoked(payload.jti as string))) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
