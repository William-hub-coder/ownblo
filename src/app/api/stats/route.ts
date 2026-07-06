import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page_path, referrer } = body;

    if (!page_path) {
      return NextResponse.json(
        { error: "Missing page_path" },
        { status: 400 }
      );
    }

    // In production, store to Supabase visitor_stats table with upsert
    console.log("Page view:", { page_path, referrer });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // In production, fetch aggregated stats from Supabase
  const stats = {
    total_visits: 12847,
    today_visits: 342,
    popular_pages: [
      { path: "/", views: 5432 },
      { path: "/blog/building-modern-portfolio", views: 2341 },
      { path: "/projects", views: 1890 },
    ],
    sources: [
      { source: "Direct", percent: 45 },
      { source: "GitHub", percent: 25 },
      { source: "Google", percent: 15 },
      { source: "Twitter", percent: 10 },
      { source: "Other", percent: 5 },
    ],
  };

  return NextResponse.json(stats);
}
