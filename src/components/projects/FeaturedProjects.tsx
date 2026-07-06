"use client";

import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { GlowCard } from "@/components/shared/GlowCard";
import { useLocale } from "next-intl";

type FeaturedProject = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  cover_url?: string;
  github_url?: string;
  demo_url?: string;
};

type FeaturedProjectsProps = {
  projects: FeaturedProject[];
};

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const locale = useLocale();

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ScrollReveal key={project.id} delay={index * 0.1}>
          <GlowCard href={`/${locale}/projects/${project.id}`} className="h-full p-0 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-[var(--cosmic-accent-cyan)]/20 to-[var(--cosmic-accent-purple)]/20 flex items-center justify-center overflow-hidden relative">
              {project.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.cover_url} alt={project.title} className="w-full h-full object-cover absolute inset-0" />
              ) : (
                <span className="text-4xl">🚀</span>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-[var(--cosmic-text-primary)] mb-2">{project.title}</h3>
              <p className="text-sm text-[var(--cosmic-star-dim)] line-clamp-2 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="rounded-full bg-[var(--cosmic-accent-cyan)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--cosmic-accent-cyan)] border border-[var(--cosmic-accent-cyan)]/20">{tech}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs">
                {project.github_url && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.open(project.github_url, "_blank", "noopener,noreferrer"); }}
                    className="text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)] transition-colors bg-transparent border-0 p-0 cursor-pointer">GitHub →</button>
                )}
                {project.demo_url && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.open(project.demo_url, "_blank", "noopener,noreferrer"); }}
                    className="text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)] transition-colors bg-transparent border-0 p-0 cursor-pointer">Live Demo →</button>
                )}
              </div>
            </div>
          </GlowCard>
        </ScrollReveal>
      ))}
    </div>
  );
}
