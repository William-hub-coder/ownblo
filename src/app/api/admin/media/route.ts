import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api-auth";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { MediaStore, MediaFile } from "@/types/media";

async function readMediaStore(): Promise<MediaStore> {
  const filePath = path.join(process.cwd(), "src", "data", "media.json");
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { files: [] };
  }
}

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const search = searchParams.get("search")?.toLowerCase() || "";
    const sort = (searchParams.get("sort") as "date" | "size" | "name") || "date";
    const order = searchParams.get("order") || "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));

    const store = await readMediaStore();
    let files = store.files;

    // Filter by type
    if (type !== "all") {
      files = files.filter((f) => f.type === type);
    }

    // Filter by search
    if (search) {
      files = files.filter(
        (f) =>
          f.filename.toLowerCase().includes(search) ||
          f.title?.toLowerCase().includes(search) ||
          f.tags?.some((t) => t.toLowerCase().includes(search)),
      );
    }

    // Sort
    files.sort((a, b) => {
      let cmp = 0;
      if (sort === "date") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sort === "size") cmp = a.size - b.size;
      else cmp = a.filename.localeCompare(b.filename);
      return order === "asc" ? cmp : -cmp;
    });

    const total = files.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paged = files.slice(start, start + limit);

    return NextResponse.json({ files: paged, total, page, totalPages });
  } catch (error) {
    console.error("Media list error:", error);
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");
    if (!idsParam) {
      return NextResponse.json({ error: "Missing ids" }, { status: 400 });
    }

    const ids = idsParam.split(",");
    const store = await readMediaStore();
    const filePath = path.join(process.cwd(), "src", "data", "media.json");

    // Remove physical files
    for (const id of ids) {
      const file = store.files.find((f) => f.id === id);
      if (file) {
        try {
          const fs = await import("fs/promises");
          await fs.unlink(path.join(process.cwd(), "public", file.path));
        } catch { /* file may not exist */ }
      }
    }

    store.files = store.files.filter((f) => !ids.includes(f.id));
    await writeFile(filePath, JSON.stringify(store, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
