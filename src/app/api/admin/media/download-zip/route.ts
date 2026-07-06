import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api-auth";
import type { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import type { MediaStore } from "@/types/media";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Missing ids array" }, { status: 400 });
    }

    // Read media store to get file paths
    const storePath = path.join(process.cwd(), "src", "data", "media.json");
    const raw = await readFile(storePath, "utf-8");
    const store: MediaStore = JSON.parse(raw);

    // Build zip
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    for (const id of ids) {
      const file = store.files.find((f) => f.id === id);
      if (!file) continue;
      try {
        const filePath = path.join(process.cwd(), "public", file.path);
        const data = await readFile(filePath);
        zip.file(file.filename, data);
      } catch {
        // skip files that can't be read
      }
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const uint8 = new Uint8Array(zipBuffer);

    return new Response(uint8, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="download-${Date.now()}.zip"`,
      },
    });
  } catch (error) {
    console.error("Zip download error:", error);
    return NextResponse.json({ error: "Failed to create zip" }, { status: 500 });
  }
}
