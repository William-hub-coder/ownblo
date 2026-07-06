"use client";

import { cn } from "@/lib/utils/cn";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

type SectionHeadingProps = {
  /** Main heading text. */
  title: string;
  /** Optional subtitle shown below the title in muted text. */
  subtitle?: string;
  /** Horizontal alignment. Default "center". */
  align?: "left" | "center";
  /** Additional CSS classes for the wrapper. */
  className?: string;
  /**
   * HTML heading level. Default "h2".
   * Use "h1" only for the page's primary heading.
   */
  as?: "h1" | "h2" | "h3";
};

/**
 * Consistent section title component used across all portfolio sections.
 *
 * Renders a gradient heading (cyan-to-purple) with an optional muted
 * subtitle below. The entire block fades in on scroll via `ScrollReveal`.
 */
export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
  as: HeadingTag = "h2",
}: SectionHeadingProps) {
  const alignment = align === "left" ? "text-left" : "text-center";

  return (
    <ScrollReveal
      className={cn("mb-12 space-y-3", alignment, className)}
      variant="fadeInUp"
    >
      <HeadingTag
        className={cn(
          "gradient-text text-3xl font-bold tracking-tight sm:text-4xl",
          align === "left" && "text-left",
        )}
      >
        {title}
      </HeadingTag>

      {subtitle && (
        <p
          className={cn(
            "mx-auto max-w-2xl text-base sm:text-lg",
            "text-[var(--cyber-muted)]",
            align === "left" ? "text-left" : "text-center",
          )}
        >
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}
