import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)");
    }
    console.warn("[supabase/client] Env vars not set — Supabase features disabled");
    // Return a stand-in that won't crash but won't work either.
    // In development mode, this lets the app render without Supabase.
    return null as any;
  }
  return createBrowserClient(url, key);
}
