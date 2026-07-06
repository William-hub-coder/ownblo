"use client";

import { useEffect, useRef } from "react";

export function CosmicCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    const text = textRef.current;
    if (!outer || !inner) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const interactive = el.closest("a, button, [role='button'], input, textarea, select, .card-hover");
      outer.style.width = interactive ? "40px" : "12px";
      outer.style.height = interactive ? "40px" : "12px";
      outer.style.borderColor = interactive ? "var(--cosmic-accent-purple)" : "var(--cosmic-accent-cyan)";
      if (interactive && text) {
        const label = interactive.getAttribute("data-cursor") || (interactive.closest("a") ? "View" : "Click");
        text.textContent = label;
        text.style.opacity = "1";
      } else if (text) {
        text.style.opacity = "0";
      }
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      outer.style.transform = `translate(${pos.current.x - parseFloat(outer.style.width || "12") / 2}px, ${pos.current.y - parseFloat(outer.style.height || "12") / 2}px)`;
      inner.style.transform = `translate(${target.current.x - 3}px, ${target.current.y - 3}px)`;
      requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onHover);
    document.body.style.cursor = "none";
    requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onHover);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 rounded-full border-2 pointer-events-none transition-[width,height,border-color] duration-200"
        style={{
          zIndex: 9998,
          width: "12px", height: "12px",
          borderColor: "var(--cosmic-accent-cyan)",
          mixBlendMode: "difference",
          transform: "translate(-100px, -100px)",
        }}
      >
        <span
          ref={textRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold text-white opacity-0 transition-opacity whitespace-nowrap"
        />
      </div>
      {/* Inner dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none"
        style={{
          zIndex: 9998,
          background: "var(--cosmic-accent-cyan)",
          transform: "translate(-100px, -100px)",
        }}
      />
    </>
  );
}
