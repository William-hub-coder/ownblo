import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ArticleMarkdown } from "@/components/blog/ArticleMarkdown";
import { ViewCounter } from "@/components/shared/ViewCounter";
import { getArticles } from "@/lib/data-reader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { articles } = getArticles();
  const article = articles[slug];
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.published_at,
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const { articles } = getArticles();
  const article = articles[slug];

  if (!article) notFound();

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-3xl">
        <ReadingProgress />

        <ScrollReveal>
          <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-sm text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)] transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            {locale === "zh" ? "返回文章列表" : "Back to Blog"}
          </Link>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-[var(--cosmic-accent-purple)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--cosmic-accent-purple)] border border-[var(--cosmic-accent-purple)]/20">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--cosmic-text-primary)] mb-4 hero-title">
              {article.title}
            </h1>
            <p className="text-lg text-[var(--cosmic-star-dim)] mb-4">{article.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-[var(--cosmic-star-dim)]">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{article.published_at}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{article.reading_time} {t("reading_time")}</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ArticleMarkdown content={article.content} copyLabel={t("copy_code")} copiedLabel={t("copied")} />
        </ScrollReveal>

        <ViewCounter type="articles" slug={slug} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Article",
          headline: article.title, description: article.excerpt,
          datePublished: article.published_at,
          author: { "@type": "Person", name: "Your Name" },
        }) }} />
      </div>
    </div>
  );
}
