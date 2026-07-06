"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { MouseEventHandler, ReactNode } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  /**
   * If provided, the entire card becomes a Next.js Link.
   */
  href?: string;
  /**
   * Click handler. Ignored if `href` is set.
   */
  onClick?: MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
  /**
   * Accessibility label for the wrapping element (link or div).
   */
  "aria-label"?: string;
  /**
   * Controls the HTML tag when there is no href.
   * Defaults to a div. Set "button" for interactive cards.
   */
  as?: "div" | "button";
};

/**
 * A card component with cyberpunk glow hover effects.
 *
 * Features:
 * - Dark surface background with a subtle border
 * - On hover: lifts 4px, border glows with the primary colour,
 *   and a box-shadow expands around the card
 * - Smooth 300ms CSS transition on all properties
 * - Optionally wraps content in a Next.js Link
 */
export function GlowCard({
  children,
  className,
  href,
  onClick,
  "aria-label": ariaLabel,
  as = "div",
}: GlowCardProps) {
  const sharedClasses = cn(
    "block rounded-xl border bg-[var(--cyber-surface)] border-[var(--cyber-border)]",
    "card-hover glow-border",
    className,
  );

  // Render as a Next.js Link when href is provided
  if (href) {
    return (
      <Link
        href={href}
        className={cn(sharedClasses, "no-underline")}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  // Render as a button for interactive non-navigational cards
  if (as === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(sharedClasses, "w-full text-left")}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }

  // Default: static card div
  return (
    <div
      className={sharedClasses}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
