export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  tech_challenges?: string;
  role?: string;
  timeline?: string;
  cover_url?: string;
  screenshots: string[];
  tech_stack: string[];
  github_url?: string;
  demo_url?: string;
  category: "web" | "mobile" | "design" | "other";
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectFilter {
  category?: string;
  tech?: string;
}
