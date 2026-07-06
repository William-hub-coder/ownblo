import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { GlowCard } from "@/components/shared/GlowCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { getTranslations, getLocale } from "next-intl/server";
import { Camera } from "lucide-react";
import Link from "next/link";
import { getAlbums } from "@/lib/data-reader";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Photography", description: "Capturing beautiful moments through the lens" };
}

export default async function PhotographyPage() {
  const t = await getTranslations("photography");
  const locale = await getLocale();
  const { albumList, albumData } = getAlbums();

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        {albumList.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albumList.map((album, index) => {
              // Auto-detect cover: use cover_url if set, else first photo's url
              const fullAlbum = albumData[album.slug];
              const coverUrl = album.cover_url || fullAlbum?.photos?.find((p) => p.url)?.url || "";

              return (
                <ScrollReveal key={album.slug} delay={index * 0.1}>
                  <GlowCard href={`/${locale}/photography/${album.slug}`} className="h-full p-0 overflow-hidden">
                    <div className="relative h-64 bg-gradient-to-br from-[var(--cosmic-accent-cyan)]/20 via-[var(--cosmic-accent-purple)]/10 to-[var(--cosmic-bg-card)] flex items-center justify-center overflow-hidden">
                      {coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={coverUrl} alt={album.title} className="w-full h-full object-cover absolute inset-0" />
                      ) : (
                        <Camera className="h-16 w-16 text-[var(--cosmic-star-dim)]/30" />
                      )}
                      <div className="absolute bottom-3 right-3 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white/80 z-10">
                        {album.photoCount} photos
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[var(--cosmic-text-primary)] mb-2">{album.title}</h3>
                      <p className="text-sm text-[var(--cosmic-star-dim)] line-clamp-2">{album.description}</p>
                    </div>
                  </GlowCard>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={<Camera className="h-12 w-12" />} title={t("no_photos")} description={t("no_photos_desc")} />
        )}
      </div>
    </div>
  );
}
