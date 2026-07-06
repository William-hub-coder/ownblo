import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/data-store";

type ViewsData = { articles: Record<string, number>; projects: Record<string, number> };

function getClientIP(request: Request): string {
  const h = request.headers;
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
         h.get("x-real-ip") ||
         "127.0.0.1";
}

// In-memory debounce: only count one view per slug per IP per minute
const viewDebounce = new Map<string, number>();

export async function GET() {
  try {
    const data = await readJSON<ViewsData>("views.json");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ articles: {}, projects: {} });
  }
}

export async function POST(request: Request) {
  try {
    const { type, slug } = await request.json();

    // Validate
    if (!type || !slug || !["articles", "projects"].includes(type)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (typeof slug !== "string" || slug.length > 200 || !/^[a-z0-9-]+$/i.test(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    // Rate limit: one view per slug per IP per 2 minutes
    const ip = getClientIP(request);
    const debounceKey = `${type}:${slug}:${ip}`;
    const lastView = viewDebounce.get(debounceKey);
    const now = Date.now();
    if (lastView && now - lastView < 120_000) {
      return NextResponse.json({ counted: false });
    }
    viewDebounce.set(debounceKey, now);

    const data = await readJSON<ViewsData>("views.json");
    if (!data[type as keyof ViewsData]) {
      data[type as keyof ViewsData] = {};
    }
    const key = type as keyof ViewsData;
    data[key][slug] = (data[key][slug] || 0) + 1;
    await writeJSON("views.json", data);

    return NextResponse.json({ count: data[key][slug] });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
