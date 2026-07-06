/**
 * Real-time JSON data reader for server components.
 * Uses fs.readFileSync at request time — no module-level caching.
 * Admin edits to JSON files appear immediately without restart.
 */
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function read<T>(filename: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[data-reader] Failed to read ${filename}:`, (err as Error).message);
    return fallback;
  }
}

export function getSiteConfig() {
  return read<{
    name: string; title: string; description: string;
    url: string; ogImage: string;
    links: { github: string; twitter: string; email: string };
  }>("site-config.json", {
    name: "Portfolio", title: "Creative Developer", description: "",
    url: "", ogImage: "",
    links: { github: "", twitter: "", email: "" },
  });
}

export function getSkills() {
  return read<{ label: string; level: number; color: string }[]>("skills.json", []);
}

export function getTimeline() {
  return read<{
    type: string; title: string; subtitle: string;
    description: string; startDate: string; endDate?: string; icon: string;
  }[]>("timeline.json", []);
}

export function getArticles() {
  const list = read<{
    slug: string; title: string; excerpt: string; content: string;
    tags: string[]; reading_time: number; published: boolean; published_at: string;
  }[]>("articles.json", []);
  const record: Record<string, typeof list[0]> = {};
  for (const item of list) record[item.slug] = item;
  return { articles: record, articleList: list };
}

export function getProjects() {
  const list = read<{
    slug: string; title: string; description: string;
    tech_stack: string[]; category: string; github_url?: string; demo_url?: string | null;
    role?: string; timeline?: string; tech_challenges?: string; screenshots: string[];
  }[]>("projects.json", []);
  const record: Record<string, typeof list[0]> = {};
  for (const item of list) record[item.slug] = item;
  return { projects: record, projectList: list as any };
}

export function getAlbums() {
  const list = read<{
    slug: string; title: string; description: string; cover_url?: string;
    photos: { id: string; title: string; url: string; camera?: string; aperture?: string; shutter?: string; iso?: number; taken?: string }[];
  }[]>("albums.json", []);
  const record: Record<string, typeof list[0]> = {};
  for (const item of list) record[item.slug] = item;
  return { albumData: record, albumList: list.map(({ slug, title, description, photos, cover_url }) => ({ slug, title, description, photoCount: photos.length, cover_url: (cover_url as string) || "" })) };
}

export function getBookmarks() {
  return read<{
    id: string; title: string; url: string; description?: string; category: string;
  }[]>("bookmarks.json", []);
}

export function getProfile() {
  return read<{
    name: string; title: string;
    greeting_zh: string; greeting_en: string;
    bio_zh: string; bio_en: string;
    location: string; role_zh: string; role_en: string;
    avatar_url: string;
    typewriter_zh: string[]; typewriter_en: string[];
  }>("profile.json", {
    name: "", title: "",
    greeting_zh: "你好", greeting_en: "Hello",
    bio_zh: "", bio_en: "",
    location: "", role_zh: "", role_en: "",
    avatar_url: "",
    typewriter_zh: [], typewriter_en: [],
  });
}
