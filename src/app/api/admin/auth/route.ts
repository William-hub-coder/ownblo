import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { hashPassword, verifyPassword, createToken } from "@/lib/auth/password";
import { checkRateLimit, resetRateLimit } from "@/lib/auth/rate-limit";

const COOKIE_NAME = "admin_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

function getClientIP(request: Request): string {
  // Try common proxy headers, fallback to connection remote address
  const h = request.headers;
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
         h.get("x-real-ip") ||
         "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);

    // Rate limit check
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Retry in ${rate.retryAfter}s` },
        { status: 429 },
      );
    }

    const { password } = await request.json();

    if (!password || typeof password !== "string" || password.length > 128) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let storedHash = process.env.ADMIN_PASSWORD_HASH;

    if (!storedHash) {
      console.error(
        "============================================================\n" +
          "MISSING ADMIN_PASSWORD_HASH env variable.\n" +
          "Generate one with: node -e \"const crypto=require('crypto');const s=crypto.randomUUID();crypto.subtle.digest('SHA-256',new TextEncoder().encode(s+':YOUR_PASSWORD')).then(h=>console.log(s+':'+Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join('')))\"\n" +
          "Then add it to .env.local as ADMIN_PASSWORD_HASH=\"...\"\n" +
          "============================================================",
      );
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 },
      );
    }

    const valid = await verifyPassword(password, storedHash);
    if (!valid) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    // Reset rate limit on success
    resetRateLimit(ip);

    const token = await createToken({ role: "admin" }, COOKIE_MAX_AGE);
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}
