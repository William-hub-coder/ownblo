import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { MusicPlayer } from "@/components/layout/MusicPlayer";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { BackToTop } from "@/components/shared/BackToTop";
import { CosmicBackground } from "@/components/cosmic/CosmicBackground";
import { CosmicRipple } from "@/components/interactions/CosmicRipple";
import { MeteorShowerTransition } from "@/components/interactions/MeteorShowerTransition";
import { CosmicCursor } from "@/components/interactions/CosmicCursor";
import { WarpTransition } from "@/components/interactions/WarpTransition";
import { getSiteConfig } from "@/lib/data-reader";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = getSiteConfig();

  return (
    <div className="flex min-h-screen flex-col">
      {/* z-0: Deep space background */}
      <CosmicBackground />

      {/* z-9997: Meteor shower on route change */}
      <MeteorShowerTransition />

      {/* z-9998: Custom cursor */}
      <CosmicCursor />

      {/* z-9999: Water ripple on click + trail */}
      <CosmicRipple />

      <SkipToContent />
      <Navigation siteName={siteConfig.name} />
      <main id="main-content" className="flex-1 pt-16 relative z-10">
        <WarpTransition>
          {children}
        </WarpTransition>
      </main>
      <Footer config={{
        siteName: siteConfig.name,
        githubUrl: siteConfig.links.github,
        twitterUrl: siteConfig.links.twitter,
        email: siteConfig.links.email,
      }} />
      <MusicPlayer />
      <BackToTop />
    </div>
  );
}
