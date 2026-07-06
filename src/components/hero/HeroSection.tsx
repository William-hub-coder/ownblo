"use client";

import { motion } from "framer-motion";
import { ArrowDown, FolderOpen, Mail } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ParticleNetwork } from "./ParticleNetwork";
import { TypewriterText } from "./TypewriterText";

type ProfileData = {
  name: string;
  greeting_zh: string;
  greeting_en: string;
  typewriter_zh: string[];
  typewriter_en: string[];
};

export function HeroSection({ profile }: { profile: ProfileData }) {
  const t = useTranslations("hero");
  const locale = useLocale();

  const greeting = locale === "zh" ? profile.greeting_zh : profile.greeting_en;
  const typewriterTexts = locale === "zh" ? profile.typewriter_zh : profile.typewriter_en;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--cosmic-bg-primary)] via-[var(--cosmic-bg-primary)]/95 to-[var(--cosmic-bg-primary)]" />
      <ParticleNetwork />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base text-[var(--cosmic-star-dim)] tracking-widest uppercase mb-4"
        >
          {greeting}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 hero-title"
        >
          <span className="gradient-text">{profile.name}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl text-[var(--cosmic-text-primary)]/80 mb-10 h-10"
        >
          <TypewriterText texts={typewriterTexts} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href={`/projects`}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            style={{ boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}>
            <FolderOpen className="h-5 w-5" />{t("cta_projects")}
          </Link>
          <Link href={`/contact`}
            className="group inline-flex items-center gap-2 rounded-xl border border-[var(--cosmic-orbit-glow)] px-8 py-3.5 text-sm font-semibold text-[var(--cosmic-text-primary)] hover:border-[var(--cosmic-accent-cyan)] hover:text-[var(--cosmic-accent-cyan)] transition-all duration-300 hover:scale-105 glow-border">
            <Mail className="h-5 w-5" />{t("cta_contact")}
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--cosmic-star-dim)]">
        <span className="text-xs tracking-widest uppercase">{t("scroll")}</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
