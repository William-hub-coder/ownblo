import siteConfigData from "./site-config.json";

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
    twitter: string;
    email: string;
  };
}

export const siteConfig = siteConfigData as SiteConfig;

export interface Skill {
  label: string;
  level: number;
  color: string;
}

export interface TimelineEntry {
  type: "education" | "work" | "milestone";
  title: string;
  subtitle: string;
  description: string;
  startDate: string;
  endDate?: string;
  icon: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface PlaylistSong {
  id: string;
  title: string;
  artist: string;
  cover_url?: string;
  audio_url: string;
  duration: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at: string;
}
