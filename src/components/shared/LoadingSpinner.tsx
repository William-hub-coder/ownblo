"use client";

import { cn } from "@/lib/utils/cn";

type LoadingSpinnerProps = {
  /** Spinner size. Default "md". */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes for the wrapper. */
  className?: string;
  /** Accessible label for screen readers. Default "Loading..." */
  label?: string;
};

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

/**
 * Simple animated ring spinner in the cyber-primary colour.
 *
 * Renders a spinning circular border with a transparent segment,
 * creating a classic loading indicator. Includes an accessible
 * label for screen readers.
 */
export function LoadingSpinner({
  size = "md",
  className,
  label = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      role="status"
      aria-label={label}
    >
      <div
        className={cn(
          "rounded-full animate-spin",
          "border-[var(--cyber-primary)] border-t-transparent",
          sizeClasses[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
