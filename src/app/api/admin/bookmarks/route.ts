import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api-auth";
import { readJSON, writeJSON } from "@/lib/data-store";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const data = await readJSON("bookmarks.json", []);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const body = await request.json();
  const all = await readJSON<Record<string, unknown>[]>("bookmarks.json");

  body.id = crypto.randomUUID();
  all.push(body);
  await writeJSON("bookmarks.json", all);
  return NextResponse.json({ success: true, id: body.id });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const body = await request.json();
  const all = await readJSON<{ id: string }[]>("bookmarks.json");
  const index = all.findIndex((b) => b.id === body.id);

  if (index === -1) {
    return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
  }

  all[index] = { ...all[index], ...body };
  await writeJSON("bookmarks.json", all);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const all = await readJSON<{ id: string }[]>("bookmarks.json");
  const filtered = all.filter((b) => b.id !== id);
  await writeJSON("bookmarks.json", filtered);
  return NextResponse.json({ success: true });
}
