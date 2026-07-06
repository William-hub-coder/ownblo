"use client";

import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { GlowCard } from "@/components/shared/GlowCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { FolderOpen } from "lucide-react";
type ProjectListItem = {
  slug: string;
  title: string;
  description: string;
  tech_stack: string[];
  category: string;
  github_url?: string;
  demo_url?: string | null;
  role?: string;
  timeline?: string;
  tech_challenges?: string;
  screenshots: string[];
};

type ProjectGridProps = {
  projects: ProjectListItem[];
  locale: string;
  noProjectsTitle: string;
  noProjectsDesc: string;
};

export function ProjectGrid({
  projects,
  locale,
  noProjectsTitle,
  noProjectsDesc,
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderOpen className="h-12 w-12" />}
        title={noProjectsTitle}
        description={noProjectsDesc}
      />
    );
  }

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ScrollReveal key={project.slug} delay={index * 0.1}>
          <GlowCard
            href={`/${locale}/projects/${project.slug}`}
            className="h-full p-0 overflow-hidden flex flex-col"
          >
            {/* Cover */}
            <div className="relative h-48 bg-gradient-to-br from-[var(--cyber-primary)]/20 via-[var(--cyber-accent)]/10 to-[var(--cyber-surface)] flex items-center justify-center">
              <span className="text-4xl opacity-50">
                {project.category === "mobile" ? "📱" : project.category === "design" ? "🎨" : "💻"}
              </span>
              <span className="absolute top-3 right-3 rounded-full bg-[var(--cyber-bg)]/80 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-[var(--cyber-primary)] border border-[var(--cyber-border)]">
                {project.category}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-semibold text-[var(--cyber-text)] mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-[var(--cyber-muted)] line-clamp-2 mb-4 flex-1">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech_stack?.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-[var(--cyber-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--cyber-primary)] border border-[var(--cyber-primary)]/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* External Links */}
              <div className="flex items-center gap-4 text-xs font-medium">
                {project.github_url && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.github_url, "_blank", "noopener,noreferrer");
                    }}
                    className="text-[var(--cyber-muted)] hover:text-[var(--cyber-primary)] transition-colors cursor-pointer bg-transparent border-0 p-0"
                  >
                    GitHub ↗
                  </button>
                )}
                {project.demo_url && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.demo_url!, "_blank", "noopener,noreferrer");
                    }}
                    className="text-[var(--cyber-muted)] hover:text-[var(--cyber-accent)] transition-colors cursor-pointer bg-transparent border-0 p-0"
                  >
                    Live Demo ↗
                  </button>
                )}
              </div>
            </div>
          </GlowCard>
        </ScrollReveal>
      ))}
    </div>
  );
}
