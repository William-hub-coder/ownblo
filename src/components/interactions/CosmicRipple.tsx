"use client";

import { useRef, useEffect, useCallback } from "react";

interface Ripple {
  x: number; y: number; startTime: number; delay: number;
  maxRadius: number; color: string; duration: number;
}

const BRAND_COLORS = ["#06b6d4", "#8b5cf6"];
const ACCENT_COLORS = ["#fbbf24", "#e879f9"];
const MAX_RIPPLES = 18;
const TRAIL_DISTANCE = 220;

export function CosmicRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const mouseRef = useRef({ x: -999, y: -999, lastTrail: 0 });
  const animRef = useRef(0);
  const prefersReduced = useRef(false);

  const createRipple = useCallback((x: number, y: number, isTrail = false) => {
    if (prefersReduced.current) return;
    const now = performance.now();

    if (isTrail) {
      // Trail: single faint ring
      ripplesRef.current.push({
        x, y, startTime: now, delay: 0,
        maxRadius: 25 + Math.random() * 20,
        color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
        duration: 500 + Math.random() * 200,
      });
    } else {
      // Click: 2 elegant rings
      const n = 2;
      const baseR = 80 + Math.random() * 50;
      for (let i = 0; i < n; i++) {
        ripplesRef.current.push({
          x, y, startTime: now,
          delay: i * 120,
          maxRadius: baseR + Math.random() * 20,
          color: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
          duration: 1000 + Math.random() * 300,
        });
      }
    }

    if (ripplesRef.current.length > MAX_RIPPLES) {
      ripplesRef.current = ripplesRef.current.slice(-MAX_RIPPLES);
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

    const onClick = (e: MouseEvent) => createRipple(e.clientX, e.clientY, false);
    window.addEventListener("click", onClick);

    const onMove = (e: MouseEvent) => {
      const m = mouseRef.current;
      const dx = e.clientX - m.x;
      const dy = e.clientY - m.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > TRAIL_DISTANCE) {
        m.x = e.clientX;
        m.y = e.clientY;
        createRipple(e.clientX, e.clientY, true);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const active: Ripple[] = [];

      for (const r of ripplesRef.current) {
        const elapsed = now - r.startTime - r.delay;
        if (elapsed < 0) { active.push(r); continue; }
        if (elapsed > r.duration) continue;

        const progress = elapsed / r.duration;
        // Ease out quad — most of the animation happens early
        const eased = 1 - (1 - progress) * (1 - progress);
        const radius = eased * r.maxRadius;

        // Fade: starts at 0.35, fades to 0
        const alpha = 0.35 * (1 - eased);
        if (alpha <= 0.005) continue;

        const lineWidth = 1.2 * (1 - eased) + 0.2;

        active.push(r);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 4 + 3 * (1 - eased);
        ctx.beginPath();

        // Subtle sine wave distortion
        const segments = 72;
        const distortion = 3 * (1 - eased);
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const wave = distortion * Math.sin(angle * 4 + eased * 8);
          const rAdjusted = radius + wave;
          const sx = r.x + Math.cos(angle) * rAdjusted;
          const sy = r.y + Math.sin(angle) * rAdjusted;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
        ctx.restore();
      }

      ripplesRef.current = active;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [createRipple]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 9999, pointerEvents: "none" }}
    />
  );
}
