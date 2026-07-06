"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { fadeInUp } from "@/lib/animations/variants";
import type { ReactNode } from "react";

type EmptyStateProps = {
  /** Optional icon rendered above the title. */
  icon?: ReactNode;
  /** Primary message (required). */
  title: string;
  /** Secondary description text. */
  description?: string;
  /** Optional call-to-action element (e.g. a button or link). */
  action?: ReactNode;
  /** Additional CSS classes. */
  className?: string;
};

/**
 * Centred placeholder shown when a list or section has no content.
 *
 * Features a fade-in animation, muted styling, and an optional icon,
 * description, and action button.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        "rounded-xl border border-dashed border-[var(--cyber-border)]",
        "bg-[var(--cyber-surface)]/50",
        className,
      )}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {icon && (
        <div className="mb-4 text-[var(--cyber-muted)]" aria-hidden="true">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-[var(--cyber-text)]">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-[var(--cyber-muted)]">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
