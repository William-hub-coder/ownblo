export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  favicon_url?: string;
  sort_order: number;
  created_at: string;
}
