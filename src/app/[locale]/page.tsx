import { HeroSection } from "@/components/hero/HeroSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GlowCard } from "@/components/shared/GlowCard";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { FeaturedProjects } from "@/components/projects/FeaturedProjects";
import { getLocale, getTranslations } from "next-intl/server";
import { getProfile } from "@/lib/data-reader";
import Link from "next/link";

// Sample project data for featured section
const featuredProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform built with Next.js, featuring real-time inventory management and payment integration.",
    tech_stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    cover_url: "",
    github_url: "https://github.com",
    demo_url: "https://demo.com",
  },
  {
    id: "2",
    title: "AI Image Generator",
    description:
      "An AI-powered image generation tool using Stable Diffusion, with a React frontend and Python backend.",
    tech_stack: ["React", "Python", "FastAPI", "Stable Diffusion"],
    cover_url: "",
    github_url: "https://github.com",
  },
  {
    id: "3",
    title: "Real-time Dashboard",
    description:
      "An analytics dashboard with real-time data visualization using WebSockets and D3.js.",
    tech_stack: ["React", "D3.js", "WebSocket", "Node.js"],
    cover_url: "",
    demo_url: "https://demo.com",
  },
];

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("projects");
  const blogT = await getTranslations("blog");
  const profile = getProfile();

  return (
    <div>
      {/* Hero */}
      <HeroSection profile={profile} />

      {/* Featured Projects */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
          <FeaturedProjects projects={featuredProjects} />
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 px-4 bg-[var(--cyber-surface)]/30">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title={blogT("title")} subtitle={blogT("subtitle")} />

          <ScrollReveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Building a Modern Portfolio with Next.js",
                  excerpt:
                    "A comprehensive guide on building a performant portfolio website using Next.js 14, Tailwind CSS, and Framer Motion.",
                  date: "2024-06-15",
                  readingTime: "8",
                  tags: ["Next.js", "React", "Tutorial"],
                },
                {
                  title: "The Art of Urban Night Photography",
                  excerpt:
                    "Tips and techniques for capturing stunning city nightscapes, from camera settings to post-processing.",
                  date: "2024-05-20",
                  readingTime: "6",
                  tags: ["Photography", "Guide"],
                },
              ].map((article, i) => (
                <GlowCard
                  key={i}
                  href={`/${locale}/blog/${article.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="p-6"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[var(--cyber-accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--cyber-accent)] border border-[var(--cyber-accent)]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--cyber-text)] mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[var(--cyber-muted)] line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--cyber-muted)]">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>
                      {article.readingTime} {blogT("reading_time")}
                    </span>
                  </div>
                </GlowCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">
                {locale === "zh" ? "一起创造精彩" : "Let&apos;s Create Together"}
              </span>
            </h2>
            <p className="text-[var(--cyber-muted)] mb-8">
              {locale === "zh"
                ? "如果你有有趣的项目或合作想法，欢迎随时联系我。"
                : "If you have an interesting project or collaboration idea, feel free to reach out."}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--cyber-primary)]/25 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {locale === "zh" ? "联系我" : "Get in Touch"}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
