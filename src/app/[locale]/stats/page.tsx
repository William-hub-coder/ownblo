"use client";

import { useState, useEffect } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { GlowCard } from "@/components/shared/GlowCard";
import { useTranslations } from "next-intl";
import { Eye, TrendingUp, Users, Globe } from "lucide-react";

export default function StatsPage() {
  const t = useTranslations("stats");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: t("total_visits"), value: "12,847", icon: Eye, change: "+12%", color: "text-cyber-primary" },
    { label: t("today_visits"), value: "342", icon: TrendingUp, change: "+8%", color: "text-green-400" },
    { label: t("popular_articles"), value: "24", icon: Users, change: "+5", color: "text-cyber-accent" },
    { label: t("sources"), value: "8", icon: Globe, change: "Direct", color: "text-yellow-400" },
  ];

  if (!mounted) {
    return (
      <div className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-cyber-surface/50 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        {/* Stats Cards */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={stat.label} delay={index * 0.1}>
                <GlowCard className="p-5 text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                  <p className="text-2xl font-bold text-cyber-text mb-1">{stat.value}</p>
                  <p className="text-xs text-cyber-muted mb-1">{stat.label}</p>
                  <span className="text-xs font-medium text-green-400">{stat.change}</span>
                </GlowCard>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Source Distribution */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12">
            <GlowCard className="p-6">
              <h3 className="text-sm font-semibold text-cyber-text uppercase tracking-wider mb-6">
                {t("sources")}
              </h3>
              <div className="space-y-4">
                {[
                  { source: "Direct", percent: 45, color: "bg-cyber-primary" },
                  { source: "GitHub", percent: 25, color: "bg-cyber-accent" },
                  { source: "Google", percent: 15, color: "bg-green-400" },
                  { source: "Twitter", percent: 10, color: "bg-blue-400" },
                  { source: "Other", percent: 5, color: "bg-yellow-400" },
                ].map((item) => (
                  <div key={item.source} className="flex items-center gap-3">
                    <span className="text-xs text-cyber-muted w-20">{item.source}</span>
                    <div className="flex-1 h-2 rounded-full bg-cyber-border overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-cyber-text font-medium w-10 text-right">
                      {item.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </GlowCard>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
