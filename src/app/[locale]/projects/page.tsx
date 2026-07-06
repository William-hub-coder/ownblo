import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getTranslations, getLocale } from "next-intl/server";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getProjects } from "@/lib/data-reader";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Projects", description: "A collection of projects I've built and contributed to" };
}

export default async function ProjectsPage() {
  const t = await getTranslations("projects");
  const locale = await getLocale();
  const { projectList } = getProjects();

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <ProjectGrid projects={projectList} locale={locale} noProjectsTitle={t("no_projects")} noProjectsDesc={t("no_projects_desc")} />
      </div>
    </div>
  );
}
