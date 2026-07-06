import bookmarksData from "./bookmarks.json";

export interface BookmarkData {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: string;
}

export const bookmarks = bookmarksData as BookmarkData[];

export const bookmarkCategories = ["all", "resource", "tool", "inspiration", "reference"];
