"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type LazyImageProps = {
  /** Image source URL. */
  src: string;
  /** Alt text (required for accessibility). */
  alt: string;
  /** Image width (px). Optional when `fill` is true. */
  width?: number;
  /** Image height (px). Optional when `fill` is true. */
  height?: number;
  /** Additional CSS classes for the wrapper. */
  className?: string;
  /** Whether this image is the LCP element — disables lazy loading. */
  priority?: boolean;
  /** Responsive sizes attribute (e.g. "(max-width: 768px) 100vw, 50vw"). */
  sizes?: string;
  /** Use fill mode so the image stretches to its container. */
  fill?: boolean;
  /** Quality setting passed to Next.js Image (1-100). */
  quality?: number;
  /** Additional class for the <img> element itself. */
  imgClassName?: string;
  /** Object-fit style when using fill. */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** Border radius override. */
  borderRadius?: string;
};

/**
 * Progressive image component with blur-up loading.
 *
 * Behaviour:
 * 1. Renders a shimmer / skeleton placeholder while the image loads.
 * 2. On load complete, the full image fades in with a smooth opacity
 *    transition (Framer Motion, 0.5s).
 * 3. Supports both fixed-dimension and fill modes for responsive layouts.
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  fill = false,
  quality = 85,
  imgClassName,
  objectFit = "cover",
  borderRadius = "rounded-lg",
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  const onLoadingComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  // Validate dimensions for non-fill mode
  const needsExplicitDimensions = !fill && (!width || !height);

  const wrapperClasses = cn(
    "relative overflow-hidden",
    borderRadius,
    !fill && width && height ? "" : "",
    className,
  );

  const shimmerClasses = cn(
    "absolute inset-0 z-10",
    "animate-pulse",
    "bg-[var(--cyber-surface)]",
    borderRadius,
  );

  const imageClasses = cn(
    "transition-opacity duration-500",
    loaded ? "opacity-100" : "opacity-0",
    imgClassName,
    borderRadius,
  );

  return (
    <div
      className={wrapperClasses}
      style={
        !fill && width && height
          ? { width, height }
          : fill
            ? undefined
            : undefined
      }
    >
      {/* Shimmer / skeleton placeholder */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className={shimmerClasses}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--cyber-border)] to-transparent shimmer-slide" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual image */}
      {needsExplicitDimensions ? (
        // Fallback: render as a regular img when dimensions are missing in non-fill mode
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={imageClasses}
          loading={priority ? "eager" : "lazy"}
          onLoad={onLoadingComplete}
          style={
            fill
              ? {
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit,
                  borderRadius: `var(--radius-${borderRadius})`,
                }
              : undefined
          }
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          priority={priority}
          sizes={sizes}
          quality={quality}
          fill={fill}
          className={imageClasses}
          onLoad={onLoadingComplete}
          style={fill ? { objectFit } : undefined}
        />
      )}

      {/* Hidden shimmer animation keyframes injected once via style tag is
          not needed — Tailwind's animate-pulse handles the skeleton pulse.
          For the sliding shimmer effect we add a small inline style */}
      <style jsx>{`
        .shimmer-slide {
          animation: shimmer-slide 2s infinite;
        }
        @keyframes shimmer-slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
