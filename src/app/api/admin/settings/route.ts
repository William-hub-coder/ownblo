import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api-auth";
import { readJSON, writeJSON } from "@/lib/data-store";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const data = await readJSON("site-config.json", {
    name: "", title: "", description: "", url: "", ogImage: "",
    links: { github: "", twitter: "", email: "" },
  });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const body = await request.json();
  await writeJSON("site-config.json", body);
  return NextResponse.json({ success: true });
}
