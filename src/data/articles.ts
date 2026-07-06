import articlesData from "./articles.json";

export interface ArticleData {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  reading_time: number;
  published_at: string;
}

type ArticleRecord = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  reading_time: number;
  published_at: string;
};

const list: ArticleRecord[] = articlesData;
const record: Record<string, ArticleData> = {};
for (const item of list) {
  const { slug, ...data } = item;
  record[slug] = data as ArticleData;
}

export const articles = record;

export const articleList = list.map(({ slug, ...data }) => ({
  slug,
  ...data,
}));
