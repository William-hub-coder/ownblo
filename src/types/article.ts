export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content_mdx?: string;
  cover_url?: string;
  tags: string[];
  reading_time?: number;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}
