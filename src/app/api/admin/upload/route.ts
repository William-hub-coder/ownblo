import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api-auth";
import { writeFile, mkdir } from "fs/promises";
import { readFile, writeFile as writeJsonFile } from "fs/promises";
import path from "path";
import type { MediaFile, MediaStore } from "@/types/media";

const ALLOWED_TYPES: Record<string, { type: MediaFile["type"]; maxSize: number }> = {
  "image/jpeg": { type: "image", maxSize: 5 * 1024 * 1024 },
  "image/png": { type: "image", maxSize: 5 * 1024 * 1024 },
  "image/gif": { type: "image", maxSize: 5 * 1024 * 1024 },
  "image/webp": { type: "image", maxSize: 5 * 1024 * 1024 },
  "image/avif": { type: "image", maxSize: 5 * 1024 * 1024 },
  "image/svg+xml": { type: "image", maxSize: 5 * 1024 * 1024 },
  "video/mp4": { type: "video", maxSize: 100 * 1024 * 1024 },
  "video/webm": { type: "video", maxSize: 100 * 1024 * 1024 },
  "application/pdf": { type: "document", maxSize: 20 * 1024 * 1024 },
  "text/markdown": { type: "document", maxSize: 20 * 1024 * 1024 },
  "text/plain": { type: "document", maxSize: 20 * 1024 * 1024 },
  "application/json": { type: "code", maxSize: 10 * 1024 * 1024 },
  "text/yaml": { type: "code", maxSize: 10 * 1024 * 1024 },
  "text/csv": { type: "code", maxSize: 10 * 1024 * 1024 },
  "application/xml": { type: "code", maxSize: 10 * 1024 * 1024 },
  "application/zip": { type: "code", maxSize: 10 * 1024 * 1024 },
};

const BLOCKED_EXTENSIONS = [".exe", ".php", ".js", ".sh", ".bat", ".cmd", ".dll", ".so"];

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

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
  await writeJsonFile(filePath, JSON.stringify(store, null, 2), "utf-8");
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const dateDir = new Date().toISOString().slice(0, 7).replace("-", "/"); // "2026/07"
    const uploadsDir = path.join(process.cwd(), "public", "uploads", dateDir);
    const thumbDir = path.join(process.cwd(), "public", "uploads", "thumbnails");
    await mkdir(uploadsDir, { recursive: true });
    await mkdir(thumbDir, { recursive: true });

    const store = await readMediaStore();
    const results: MediaFile[] = [];

    for (const file of files) {
      // Validate extension
      const ext = path.extname(file.name).toLowerCase();
      if (BLOCKED_EXTENSIONS.includes(ext)) {
        continue; // skip blocked files
      }

      // Validate MIME type & size
      const allowed = ALLOWED_TYPES[file.type];
      if (!allowed) continue;
      if (file.size > allowed.maxSize) continue;

      const id = crypto.randomUUID();
      const storedName = `${id}${ext}`;
      const filePath = path.join(uploadsDir, storedName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      const entry: MediaFile = {
        id,
        filename: sanitizeFilename(file.name),
        storedName,
        path: `/uploads/${dateDir}/${storedName}`,
        url: `/uploads/${dateDir}/${storedName}`,
        type: allowed.type,
        mimeType: file.type,
        size: file.size,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      results.push(entry);
      store.files.push(entry);
    }

    await writeMediaStore(store);
    return NextResponse.json({ success: true, files: results });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
