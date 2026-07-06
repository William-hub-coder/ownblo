import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { GlowCard } from "@/components/shared/GlowCard";
import { TypewriterText } from "@/components/hero/TypewriterText";
import { getTranslations, getLocale } from "next-intl/server";
import { Mail, MapPin, Briefcase } from "lucide-react"
import { GithubIcon, TwitterIcon } from "@/components/shared/BrandIcons";
import { getSkills, getTimeline } from "@/lib/data-reader";
import { getProfile } from "@/lib/data-reader";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "About", description: "Learn more about my story" };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const locale = await getLocale();
  const skills = getSkills();
  const timelineEntries = getTimeline();
  const profile = getProfile();

  const typewriterTexts = locale === "zh" ? profile.typewriter_zh : profile.typewriter_en;
  const bio = locale === "zh" ? profile.bio_zh : profile.bio_en;
  const role = locale === "zh" ? profile.role_zh : profile.role_en;

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <ScrollReveal>
          <div className="mt-12 grid md:grid-cols-3 gap-8 items-start">
            {/* Avatar & Social */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] p-0.5 mb-4">
                <div className="w-full h-full rounded-full bg-[var(--cosmic-bg-card)] flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">👤</span>
                  )}
                </div>
              </div>
              <h2 className="text-xl font-bold gradient-text mb-2">{profile.name}</h2>
              <div className="h-6 mb-4">
                <TypewriterText texts={typewriterTexts} className="text-sm text-[var(--cosmic-star-dim)]" typingSpeed={60} />
              </div>
              <div className="flex gap-3">
                <a href={profile.avatar_url ? "#" : "https://github.com"} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg p-2 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)] hover:bg-[var(--cosmic-orbit-glow)]/20 transition-all duration-300" aria-label="GitHub">
                  <GithubIcon className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="rounded-lg p-2 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)] hover:bg-[var(--cosmic-orbit-glow)]/20 transition-all duration-300" aria-label="Twitter">
                  <TwitterIcon className="h-5 w-5" />
                </a>
                <a href="mailto:hello@your-domain.com"
                  className="rounded-lg p-2 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)] hover:bg-[var(--cosmic-orbit-glow)]/20 transition-all duration-300" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Bio Text */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-[var(--cosmic-text-primary)] mb-4">{t("bio_title")}</h3>
              <div className="text-[var(--cosmic-star-dim)] leading-relaxed space-y-4 text-sm whitespace-pre-line">
                {bio}
              </div>
              <div className="flex flex-wrap gap-3 mt-4 text-sm text-[var(--cosmic-star-dim)]">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[var(--cosmic-accent-cyan)]" />{profile.location}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-[var(--cosmic-accent-cyan)]" />{role}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Skills Radar */}
        <ScrollReveal delay={0.1}>
          <div className="mt-20">
            <SectionHeading title={t("skills_title")} subtitle={t("skills_subtitle")} />
            <div className="mt-10 flex justify-center">
              <GlowCard className="p-8 w-full max-w-lg">
                <div className="relative w-full aspect-square max-w-[320px] mx-auto">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {[40, 80, 120, 160].map((r, i) => (
                      <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[var(--cosmic-orbit-glow)]" />
                    ))}
                    {skills.map((skill, i) => {
                      const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                      return (
                        <line key={i} x1="100" y1="100" x2={100 + 160 * Math.cos(angle)} y2={100 + 160 * Math.sin(angle)}
                          stroke="currentColor" strokeWidth="0.5" className="text-[var(--cosmic-orbit-glow)]" />
                      );
                    })}
                    <polygon
                      points={skills.map((skill, i) => {
                        const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                        const r = (skill.level / 100) * 80;
                        return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                      }).join(" ")}
                      fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5" />
                    {skills.map((skill, i) => {
                      const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                      const r = (skill.level / 100) * 80;
                      return <circle key={i} cx={100 + r * Math.cos(angle)} cy={100 + r * Math.sin(angle)} r="3" fill="#06b6d4" />;
                    })}
                    {skills.map((skill, i) => {
                      const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                      const r = 90;
                      return (
                        <text key={i} x={100 + r * Math.cos(angle)} y={100 + r * Math.sin(angle)}
                          textAnchor="middle" dominantBaseline="middle" fill="var(--cosmic-star-dim)" fontSize="8">{skill.label}</text>
                      );
                    })}
                  </svg>
                </div>
              </GlowCard>
            </div>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <ScrollReveal delay={0.2}>
          <div className="mt-20">
            <SectionHeading title={t("timeline_title")} subtitle={t("timeline_subtitle")} />
            <div className="mt-12 relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--cosmic-orbit-glow)] -translate-x-1/2" />
              <div className="space-y-8">
                {timelineEntries.map((entry, index) => (
                  <div key={index} className={`relative flex items-start gap-6 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-[var(--cosmic-accent-cyan)] border-2 border-[var(--cosmic-bg-primary)] -translate-x-1/2 mt-6 z-10"
                      style={{ boxShadow: "0 0 10px rgba(6,182,212,0.5)" }} />
                    <div className={`ml-10 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <GlowCard className="p-5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{entry.icon}</span>
                          <span className="text-xs font-medium uppercase text-[var(--cosmic-accent-cyan)] tracking-wider">{entry.type}</span>
                        </div>
                        <h3 className="text-base font-semibold text-[var(--cosmic-text-primary)]">{entry.title}</h3>
                        <p className="text-sm text-[var(--cosmic-star-dim)] mb-1">{entry.subtitle}</p>
                        <p className="text-xs text-[var(--cosmic-star-dim)]/60 mb-2">{entry.startDate} — {entry.endDate || t("present")}</p>
                        <p className="text-sm text-[var(--cosmic-star-dim)] leading-relaxed">{entry.description}</p>
                      </GlowCard>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
