import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "./password";

/**
 * Verify admin authentication from cookie in API routes.
 * Returns an error Response if not authenticated, or null if authenticated.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // authenticated
}
