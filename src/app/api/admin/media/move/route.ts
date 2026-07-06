import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api-auth";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { MediaStore } from "@/types/media";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  try {
    const { ids, folder } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Missing ids array" }, { status: 400 });
    }
    if (!folder || typeof folder !== "string") {
      return NextResponse.json({ error: "Missing folder name" }, { status: 400 });
    }

    const storePath = path.join(process.cwd(), "src", "data", "media.json");
    const raw = await readFile(storePath, "utf-8");
    const store: MediaStore = JSON.parse(raw);

    for (const id of ids) {
      const file = store.files.find((f) => f.id === id);
      if (file) {
        file.folder = folder;
        file.updatedAt = new Date().toISOString();
      }
    }

    await writeFile(storePath, JSON.stringify(store, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Move error:", error);
    return NextResponse.json({ error: "Failed to move files" }, { status: 500 });
  }
}
