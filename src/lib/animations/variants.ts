import type { Variants } from "framer-motion";

/**
 * Shared animation presets used across the site.
 * All durations default to 0.6s with ease-out easing.
 */

const transition = {
  duration: 0.6,
  ease: "easeOut" as const,
};

export const fadeInUp: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition },
};

export const fadeInDown: Variants = {
  hidden: { y: -30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition },
};

export const fadeInLeft: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition },
};

export const fadeInRight: Variants = {
  hidden: { x: 30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition },
};

export const scaleIn: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition },
};

/**
 * Stagger container: wraps animated children and staggers their appearance.
 * Use `staggerItem` on each child.
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Stagger item: used inside a staggerContainer.
 * The child should define its own animation (e.g. fadeInUp).
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/**
 * Map of variant names to variant objects, useful for dynamic lookups.
 */
export const variantsByName: Record<string, Variants> = {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
  staggerItem,
};
