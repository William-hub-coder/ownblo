"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface StarNode {
  el: HTMLElement;
  x: number; y: number; pulse: number;
}

type ConstellationNavProps = {
  children: ReactNode;
  className?: string;
  /** Max distance in px between nodes to draw a line */
  connectionDistance?: number;
};

export function ConstellationNav({ children, className, connectionDistance = 150 }: ConstellationNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<StarNode[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    updateCanvasSize();

    // Collect child elements with data-constellation attribute
    const collectNodes = () => {
      const els = container.querySelectorAll("[data-constellation]");
      nodesRef.current = Array.from(els).map((el) => {
        const rect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        return {
          el: el as HTMLElement,
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
          pulse: Math.random() * Math.PI * 2,
        };
      });
    };
    collectNodes();

    const onResize = () => { updateCanvasSize(); collectNodes(); };
    const onMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("resize", onResize);
    container.addEventListener("mousemove", onMouse);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      for (const node of nodesRef.current) {
        const pulse = 0.5 + 0.5 * Math.sin(now * 0.002 + node.pulse);
        // Draw node glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,182,212,${0.4 + pulse * 0.3})`;
        ctx.fill();
      }

      // Draw connections between nearby nodes
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const a = nodesRef.current[i];
          const b = nodesRef.current[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.25;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw connections from mouse to nearby nodes
      for (const node of nodesRef.current) {
        const dx = node.x - mx, dy = node.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.5;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(139,92,246,${alpha.toFixed(2)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, [connectionDistance]);

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
