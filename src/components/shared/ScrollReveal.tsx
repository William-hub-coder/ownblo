"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { variantsByName, fadeInUp } from "@/lib/animations/variants";
import type { ReactNode } from "react";

type VariantName = keyof typeof variantsByName;

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /**
   * Animation variant to use. Defaults to "fadeInUp".
   */
  variant?: VariantName;
  /**
   * Delay in seconds before the animation starts. Default 0.
   */
  delay?: number;
  /**
   * Duration of the animation in seconds. Default 0.6.
   */
  duration?: number;
  /**
   * Whether the animation should only play once. Default true.
   */
  once?: boolean;
  /**
   * Margin applied to the viewport detection (e.g. "-100px" to trigger
   * slightly before the element enters the viewport). Default "-100px".
   */
  margin?: string;
  /**
   * Additional viewport options passed to Framer Motion.
   */
  viewport?: Record<string, unknown>;
};

/**
 * Reusable scroll-triggered reveal animation wrapper.
 *
 * Wraps children in a motion element that animates into view when the
 * user scrolls to it. Uses `whileInView` for performance.
 */
export function ScrollReveal({
  children,
  className,
  variant = "fadeInUp",
  delay = 0,
  duration = 0.6,
  once = true,
  margin = "-100px",
  viewport: extraViewport = {},
}: ScrollRevealProps) {
  const selectedVariant: Variants =
    variantsByName[variant] ?? fadeInUp;

  return (
    <motion.div
      className={cn(className)}
      variants={selectedVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        margin,
        ...extraViewport,
      }}
      transition={{
        delay,
        duration,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
