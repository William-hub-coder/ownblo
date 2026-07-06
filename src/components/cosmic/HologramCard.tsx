"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { MouseEventHandler, ReactNode } from "react";

type HologramCardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
  "aria-label"?: string;
  as?: "div" | "button";
  /** Enable scanline overlay */
  scanlines?: boolean;
  /** Enable corner HUD brackets */
  hudCorners?: boolean;
};

/**
 * Hologram-styled card — replacement for GlowCard.
 * Features scanlines, corner brackets, cosmic glow hover, anti-gravity lift.
 */
export function HologramCard({
  children,
  className,
  href,
  onClick,
  "aria-label": ariaLabel,
  as = "div",
  scanlines = false,
  hudCorners = false,
}: HologramCardProps) {
  const sharedClasses = cn(
    "block rounded-xl border bg-[var(--cosmic-bg-card)] border-[var(--cosmic-orbit-glow)]",
    "card-hover glow-border",
    scanlines && "scanline-overlay",
    hudCorners && "hud-corners",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(sharedClasses, "no-underline")} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  if (as === "button") {
    return (
      <button type="button" onClick={onClick} className={cn(sharedClasses, "w-full text-left")} aria-label={ariaLabel}>
        {children}
      </button>
    );
  }

  return (
    <div
      className={sharedClasses}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e as unknown as React.MouseEvent<HTMLDivElement>); } } : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
