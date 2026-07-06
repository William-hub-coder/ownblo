import projectsData from "./projects.json";

export interface ProjectData {
  title: string;
  description: string;
  tech_stack: string[];
  category: "web" | "mobile" | "design" | "other";
  github_url?: string;
  demo_url?: string | null;
  role?: string;
  timeline?: string;
  tech_challenges?: string;
  screenshots: string[];
}

type ProjectRecord = {
  slug: string;
  title: string;
  description: string;
  tech_stack: string[];
  category: "web" | "mobile" | "design" | "other";
  github_url?: string;
  demo_url?: string | null;
  role?: string;
  timeline?: string;
  tech_challenges?: string;
  screenshots: string[];
};

const list = projectsData as ProjectRecord[];
const record: Record<string, ProjectData> = {};
for (const item of list) {
  const { slug, ...data } = item;
  record[slug] = data as ProjectData;
}

export const projects = record;

export const projectList = list.map(({ slug, ...data }) => ({
  slug,
  ...data,
}));
