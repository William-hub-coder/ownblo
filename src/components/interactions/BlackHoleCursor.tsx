"use client";

import { useRef, useEffect } from "react";

interface AccretionParticle {
  angle: number; radius: number; speed: number; opacity: number; color: string;
}

const COLORS = ["#8b5cf6", "#a78bfa", "#06b6d4", "#67e8f9"];
const PARTICLE_COUNT = 20;
const IDLE_MS = 1000;
const SPAWN_RADIUS = 300;

export function BlackHoleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const idleStart = useRef(0);
  const particlesRef = useRef<AccretionParticle[]>([]);
  const animRef = useRef(0);
  const active = useRef(false);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      idleStart.current = performance.now();
      active.current = false;
      particlesRef.current = [];
    };
    window.addEventListener("mousemove", onMove);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const idle = now - idleStart.current;

      if (idle > IDLE_MS) {
        if (!active.current) {
          active.current = true;
          // Spawn accretion particles
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            particlesRef.current.push({
              angle: Math.random() * Math.PI * 2,
              radius: SPAWN_RADIUS * (0.6 + Math.random() * 0.4),
              speed: 0.005 + Math.random() * 0.015,
              opacity: 0.4 + Math.random() * 0.4,
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
            });
          }
        }

        // Draw accretion disk
        for (const p of particlesRef.current) {
          p.radius *= 0.985;
          p.angle += p.speed * (1 + (SPAWN_RADIUS - p.radius) / SPAWN_RADIUS);
          if (p.radius < 3) continue; // reached event horizon

          const px = mx + Math.cos(p.angle) * p.radius;
          const py = my + Math.sin(p.angle) * p.radius * 0.6; // flatten

          ctx.beginPath();
          ctx.arc(px, py, 1.5 * (p.radius / SPAWN_RADIUS), 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(")", `,${p.opacity.toFixed(2)})`).replace("rgb", "rgba");
          if (p.color.startsWith("#")) {
            const r = parseInt(p.color.slice(1, 3), 16);
            const g = parseInt(p.color.slice(3, 5), 16);
            const b = parseInt(p.color.slice(5, 7), 16);
            ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity.toFixed(2)})`;
          }
          ctx.fill();
        }

        // Event horizon (dark center)
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 15);
        grad.addColorStop(0, "rgba(0,0,0,0.9)");
        grad.addColorStop(0.5, "rgba(20,10,50,0.6)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, 15, 0, Math.PI * 2);
        ctx.fill();

        particlesRef.current = particlesRef.current.filter((p) => p.radius >= 3);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 9996, pointerEvents: "none" }}
    />
  );
}
