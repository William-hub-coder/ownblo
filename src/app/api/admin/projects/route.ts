import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api-auth";
import { readJSON, writeJSON } from "@/lib/data-store";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const data = await readJSON("projects.json", []);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const body = await request.json();
  const all = await readJSON<Record<string, unknown>[]>("projects.json");

  // Generate slug from title
  body.slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  all.push(body);
  await writeJSON("projects.json", all);
  return NextResponse.json({ success: true, slug: body.slug });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const body = await request.json();
  const all = await readJSON<{ slug: string }[]>("projects.json");
  const index = all.findIndex((p) => p.slug === body.slug);

  if (index === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  all[index] = { ...all[index], ...body };
  await writeJSON("projects.json", all);
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

  const all = await readJSON<{ slug: string }[]>("projects.json");
  const filtered = all.filter((p) => p.slug !== slug);
  await writeJSON("projects.json", filtered);
  return NextResponse.json({ success: true });
}
