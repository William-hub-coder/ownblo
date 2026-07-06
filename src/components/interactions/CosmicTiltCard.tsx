"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CosmicTiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

/**
 * 3D perspective tilt card — mouse position drives rotateX/Y and a follow highlight.
 */
export function CosmicTiltCard({
  children,
  className,
  maxTilt = 10,
}: CosmicTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTransform(`perspective(1000px) rotateY(${xPct * maxTilt}deg) rotateX(${-yPct * maxTilt}deg)`);
    setGlow({ x: (xPct + 1) * 50, y: (yPct + 1) * 50 });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
    setGlow({ x: 50, y: 50 });
  };

  return (
    <div
      ref={ref}
      className={cn("transition-transform duration-200 ease-out", className)}
      style={{
        transform,
        background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.04), transparent 60%)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
