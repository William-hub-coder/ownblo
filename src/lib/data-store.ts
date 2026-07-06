/**
 * Simple JSON file data store for admin CRUD operations.
 * Reads and writes JSON files in src/data/ from API routes.
 */
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

async function ensureDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function readJSON<T>(filename: string, fallback?: T): Promise<T> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if (fallback !== undefined) {
      console.error(`[data-store] Failed to read ${filename}, using fallback:`, (err as Error).message);
      return fallback;
    }
    throw new Error(
      `Failed to read ${filename}: ${(err as Error).message}`,
    );
  }
}

export async function writeJSON<T>(
  filename: string,
  data: T,
): Promise<void> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  const tmpPath = filePath + ".tmp";
  const json = JSON.stringify(data, null, 2);
  // Atomic write: write to temp file first, then rename
  await fs.writeFile(tmpPath, json, "utf-8");
  await fs.rename(tmpPath, filePath);
}

export async function fileExists(filename: string): Promise<boolean> {
  try {
    await fs.access(path.join(DATA_DIR, filename));
    return true;
  } catch {
    return false;
  }
}
