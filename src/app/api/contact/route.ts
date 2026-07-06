import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { ZodError } from "zod";
import { checkRateLimit } from "@/lib/auth/rate-limit";

function getClientIP(request: Request): string {
  const h = request.headers;
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
         h.get("x-real-ip") ||
         "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    // Rate limit: 3 submissions per minute per IP
    const ip = getClientIP(request);
    const rate = checkRateLimit(`contact:${ip}`);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Retry in ${rate.retryAfter}s` },
        { status: 429 },
      );
    }

    const body = await request.json();
    const data = contactSchema.parse(body);

    // In production, store to Supabase contact_messages table
    console.log("Contact form submission:", data);

    return NextResponse.json(
      { success: true, message: "Message received" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
