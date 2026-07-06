import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { GlowCard } from "@/components/shared/GlowCard";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";
import { ArrowLeft, Camera, Calendar } from "lucide-react";
import { getLocale } from "next-intl/server";
import { getAlbums } from "@/lib/data-reader";

export async function generateMetadata({ params }: { params: Promise<{ album: string }> }): Promise<Metadata> {
  const { album } = await params;
  const { albumData } = getAlbums();
  const data = albumData[album];
  if (!data) return { title: "Album Not Found" };
  return { title: data.title, description: data.description };
}

export default async function AlbumPage({ params }: { params: Promise<{ album: string }> }) {
  const { album } = await params;
  const locale = await getLocale();
  const { albumData } = getAlbums();
  const data = albumData[album];
  if (!data) notFound();

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <Link href={`/${locale}/photography`} className="inline-flex items-center gap-2 text-sm text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)] transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            {locale === "zh" ? "返回相册列表" : "Back to Albums"}
          </Link>
        </ScrollReveal>
        <SectionHeading title={data.title} subtitle={data.description} />
        {data.photos.length > 0 ? (
          <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {data.photos.map((photo, index) => (
              <ScrollReveal key={photo.id} delay={index * 0.05}>
                <GlowCard className="p-0 overflow-hidden break-inside-avoid">
                  <div className="relative bg-gradient-to-br from-[var(--cosmic-accent-cyan)]/10 via-[var(--cosmic-bg-card)] to-[var(--cosmic-accent-purple)]/10 flex items-center justify-center"
                    style={{ minHeight: index % 3 === 0 ? 320 : index % 3 === 1 ? 240 : 280 }}>
                    {photo.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo.url} alt={photo.title} className="w-full h-full object-cover absolute inset-0" />
                    ) : (
                      <Camera className="h-10 w-10 text-[var(--cosmic-star-dim)]/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                      <h4 className="text-sm font-semibold text-white mb-2">{photo.title}</h4>
                      <div className="space-y-1">
                        {photo.camera && <p className="text-xs text-white/70 flex items-center gap-1.5"><Camera className="h-3 w-3" />{photo.camera}</p>}
                        {photo.taken && <p className="text-xs text-white/70 flex items-center gap-1.5"><Calendar className="h-3 w-3" />{photo.taken}</p>}
                        {photo.aperture && <p className="text-xs text-white/70">{photo.aperture} · {photo.shutter} · ISO {photo.iso}</p>}
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <EmptyState icon={<Camera className="h-12 w-12" />} title="No photos yet" description="Photos will be displayed here" />
        )}
      </div>
    </div>
  );
}
