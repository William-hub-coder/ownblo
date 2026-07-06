import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api-auth";
import { readJSON, writeJSON } from "@/lib/data-store";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const data = await readJSON("profile.json", {
    name: "", title: "", greeting_zh: "", greeting_en: "",
    bio_zh: "", bio_en: "", location: "", role_zh: "", role_en: "",
    avatar_url: "", typewriter_zh: [], typewriter_en: [],
  });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const body = await request.json();

  // Validate required fields
  if (!body.name || typeof body.name !== "string" || body.name.length > 100) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (!body.bio_zh || typeof body.bio_zh !== "string" || body.bio_zh.length > 5000) {
    return NextResponse.json({ error: "Invalid bio_zh" }, { status: 400 });
  }

  // Sanitize: strip HTML tags from text fields
  const sanitize = (v: unknown): string => {
    if (typeof v !== "string") return "";
    return v.replace(/<[^>]*>/g, "").trim();
  };

  const clean = {
    ...body,
    name: sanitize(body.name),
    title: sanitize(body.title || ""),
    greeting_zh: sanitize(body.greeting_zh || ""),
    greeting_en: sanitize(body.greeting_en || ""),
    bio_zh: sanitize(body.bio_zh).slice(0, 5000),
    bio_en: sanitize(body.bio_en || "").slice(0, 5000),
    location: sanitize(body.location || ""),
    role_zh: sanitize(body.role_zh || ""),
    role_en: sanitize(body.role_en || ""),
    avatar_url: sanitize(body.avatar_url || ""),
    typewriter_zh: Array.isArray(body.typewriter_zh) ? body.typewriter_zh.map(sanitize).filter(Boolean) : [],
    typewriter_en: Array.isArray(body.typewriter_en) ? body.typewriter_en.map(sanitize).filter(Boolean) : [],
  };

  await writeJSON("profile.json", clean);
  return NextResponse.json({ success: true });
}
