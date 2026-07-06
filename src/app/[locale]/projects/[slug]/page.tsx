import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/BrandIcons";
import { getLocale } from "next-intl/server";
import { getProjects } from "@/lib/data-reader";
import { ViewCounter } from "@/components/shared/ViewCounter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = getProjects();
  const project = projects[slug];
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const { projects } = getProjects();
  const project = projects[slug];

  if (!project) {
    notFound();
  }

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Back button */}
        <ScrollReveal>
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 text-sm text-cyber-muted hover:text-cyber-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === "zh" ? "返回项目列表" : "Back to Projects"}
          </Link>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="rounded-full bg-cyber-primary/10 px-3 py-1 text-xs font-medium text-cyber-primary border border-cyber-primary/20 uppercase">
                {project.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-cyber-text mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-cyber-muted">{project.description}</p>
          </div>
        </ScrollReveal>

        {/* Links */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-3 mb-10">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-cyber-border px-4 py-2 text-sm font-medium text-cyber-text hover:border-cyber-primary hover:text-cyber-primary transition-all duration-300"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyber-primary to-cyber-accent px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
          </div>
        </ScrollReveal>

        {/* Tech Stack */}
        <ScrollReveal delay={0.15}>
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-cyber-text uppercase tracking-wider mb-3">
              {locale === "zh" ? "技术栈" : "Tech Stack"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack?.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-cyber-primary/10 px-3 py-1 text-sm font-medium text-cyber-primary border border-cyber-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Details Grid */}
        <ScrollReveal delay={0.2}>
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {project.role && (
              <div className="rounded-xl border border-cyber-border bg-cyber-surface/50 p-5">
                <h3 className="text-xs font-semibold text-cyber-muted uppercase tracking-wider mb-2">
                  {locale === "zh" ? "我的角色" : "My Role"}
                </h3>
                <p className="text-sm text-cyber-text">{project.role}</p>
              </div>
            )}
            {project.timeline && (
              <div className="rounded-xl border border-cyber-border bg-cyber-surface/50 p-5">
                <h3 className="text-xs font-semibold text-cyber-muted uppercase tracking-wider mb-2">
                  {locale === "zh" ? "开发时间线" : "Timeline"}
                </h3>
                <p className="text-sm text-cyber-text">{project.timeline}</p>
              </div>
            )}
          </div>
        </ScrollReveal>

        <ViewCounter type="projects" slug={slug} />

        {/* Tech Challenges */}
        {project.tech_challenges && (
          <ScrollReveal delay={0.25}>
            <div className="rounded-xl border border-cyber-border bg-cyber-surface/50 p-6">
              <h2 className="text-sm font-semibold text-cyber-text uppercase tracking-wider mb-3">
                {locale === "zh" ? "技术难点" : "Technical Challenges"}
              </h2>
              <p className="text-sm text-cyber-muted leading-relaxed">
                {project.tech_challenges}
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
