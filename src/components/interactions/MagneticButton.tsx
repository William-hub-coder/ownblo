"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  /** Max magnetic pull distance */
  range?: number;
};

/**
 * Button that magnetically follows the cursor within `range` px.
 * Wraps children in a spring-animated motion.div.
 */
export function MagneticButton({
  children,
  className,
  onClick,
  disabled,
  type = "button",
  range = 100,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useRef(0);
  const y = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return; // touch/mobile skip
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < range) {
      const pull = Math.min(dist, 15);
      x.current = (dx / dist) * pull;
      y.current = (dy / dist) * pull;
    }
    ref.current!.style.transform = `translate(${x.current}px, ${y.current}px)`;
  };

  const handleMouseLeave = () => {
    x.current = 0; y.current = 0;
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      {children}
    </motion.button>
  );
}
