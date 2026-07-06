import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getTranslations } from "next-intl/server";
import { ArticleList } from "@/components/blog/ArticleList";
import { getArticles } from "@/lib/data-reader";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Blog", description: "Thoughts on technology, photography, and life" };
}

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const { articleList } = getArticles();

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-4xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <ArticleList
          articles={articleList}
          searchPlaceholder={t("search_placeholder")}
          readingTimeLabel={t("reading_time")}
          noArticlesTitle={t("no_articles")}
          noArticlesDesc={t("no_articles_desc")}
        />
      </div>
    </div>
  );
}
