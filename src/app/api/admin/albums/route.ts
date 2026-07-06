import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api-auth";
import { readJSON, writeJSON } from "@/lib/data-store";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const data = await readJSON("albums.json", []);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const body = await request.json();
  const all = await readJSON<Record<string, unknown>[]>("albums.json");

  body.slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  body.photos = body.photos || [];

  all.push(body);
  await writeJSON("albums.json", all);
  return NextResponse.json({ success: true, slug: body.slug });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const body = await request.json();
  const all = await readJSON<{ slug: string }[]>("albums.json");
  const index = all.findIndex((a) => a.slug === body.slug);

  if (index === -1) {
    return NextResponse.json({ error: "Album not found" }, { status: 404 });
  }

  all[index] = { ...all[index], ...body };
  await writeJSON("albums.json", all);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const all = await readJSON<{ slug: string }[]>("albums.json");
  const filtered = all.filter((a) => a.slug !== slug);
  await writeJSON("albums.json", filtered);
  return NextResponse.json({ success: true });
}
