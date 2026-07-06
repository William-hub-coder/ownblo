"use client";

import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number;
  color: string; radius: number;
}

const MAX_PARTICLES = 200;

export function SupernovaBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef(0);
  const prefersReduced = useRef(false);

  const burst = useCallback((cx: number, cy: number) => {
    if (prefersReduced.current) return;
    const count = 80 + Math.floor(Math.random() * 40);
    const colors = [
      "#ffffff","#fbbf24","#e879f9","#8b5cf6","#06b6d4","#ff3860",
    ];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 3.5;
      particlesRef.current.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, maxLife: 0.6 + Math.random() * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 1 + Math.random() * 2.5,
      });
    }
    // Trim pool
    if (particlesRef.current.length > MAX_PARTICLES) {
      particlesRef.current = particlesRef.current.slice(-MAX_PARTICLES);
    }
  }, []);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onClick = (e: MouseEvent) => burst(e.clientX, e.clientY);
    window.addEventListener("click", onClick);

    let lastTime = performance.now();
    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        // gravity curve
        p.vy += 0.02;
        p.vx *= 0.995;
        p.vy *= 0.995;
        p.life -= dt / p.maxLife;

        const alpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", `,${alpha.toFixed(2)})`).replace("rgb", "rgba");
        if (p.color === "#ffffff") ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
        ctx.fill();
      }

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(animRef.current);
    };
  }, [burst]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 9999, pointerEvents: "none" }}
    />
  );
}
