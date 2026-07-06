import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api-auth";
import { readFile, writeFile, unlink } from "fs/promises";
import path from "path";
import type { MediaStore } from "@/types/media";

async function readMediaStore(): Promise<MediaStore> {
  const filePath = path.join(process.cwd(), "src", "data", "media.json");
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { files: [] };
  }
}

async function writeMediaStore(store: MediaStore): Promise<void> {
  const filePath = path.join(process.cwd(), "src", "data", "media.json");
  await writeFile(filePath, JSON.stringify(store, null, 2), "utf-8");
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const { id } = await params;
  const body = await request.json();
  const store = await readMediaStore();
  const index = store.files.findIndex((f) => f.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Only allow updating metadata fields
  const allowed = ["title", "description", "tags", "projectId", "articleId", "albumId", "folder"];
  for (const key of allowed) {
    if (key in body) {
      (store.files[index] as unknown as Record<string, unknown>)[key] = body[key];
    }
  }
  store.files[index].updatedAt = new Date().toISOString();

  await writeMediaStore(store);
  return NextResponse.json({ success: true, file: store.files[index] });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const { id } = await params;
  const store = await readMediaStore();
  const file = store.files.find((f) => f.id === id);

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Delete physical file
  try {
    await unlink(path.join(process.cwd(), "public", file.path));
    if (file.thumbnailUrl) {
      await unlink(path.join(process.cwd(), "public", file.thumbnailUrl));
    }
  } catch { /* file may not exist */ }

  store.files = store.files.filter((f) => f.id !== id);
  await writeMediaStore(store);
  return NextResponse.json({ success: true });
}
