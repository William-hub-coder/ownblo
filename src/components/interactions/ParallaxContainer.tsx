"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

type ParallaxContainerProps = {
  children: ReactNode;
  /** Speed multiplier (0.8 = slower than scroll, 1.2 = faster) */
  speed?: number;
  className?: string;
};

export function ParallaxContainer({ children, speed = 0.8, className }: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // How far the element is from center of viewport
      const fromCenter = rect.top + rect.height / 2 - viewH / 2;
      setOffset(fromCenter * (speed - 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)`, transition: "transform 0.1s linear" }}
    >
      {children}
    </div>
  );
}
