"use client";

import { useRef, useEffect } from "react";

/* ── Star & dust particle pools ── */
interface Star {
  x: number; y: number; radius: number; opacity: number;
  baseOpacity: number; twinkleSpeed: number; twinkleOffset: number;
  parallax: number;
}
interface Dust {
  x: number; y: number; vx: number; vy: number; radius: number; opacity: number;
}
interface Nebula {
  x: number; y: number; rx: number; ry: number;
  r: number; g: number; b: number; phase: number;
}

const STAR_COUNT = 300;
const DUST_COUNT = 100;
const PULSAR_COUNT = 5;

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const dustRef = useRef<Dust[]>([]);
  const pulsarsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── Resize ── */
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    /* ── Init particle pools ── */
    const init = () => {
      const w = canvas.width, h = canvas.height;
      // Stars — 3 depth layers
      starsRef.current = Array.from({ length: STAR_COUNT }, () => {
        const layer = Math.random();
        let parallax: number, radius: number, baseOpacity: number;
        if (layer < 0.17) {
          parallax = 0.5; radius = Math.random() * 1 + 0.8; baseOpacity = 0.9;
        } else if (layer < 0.5) {
          parallax = 0.3; radius = Math.random() * 0.6 + 0.3; baseOpacity = 0.6;
        } else {
          parallax = 0.1; radius = Math.random() * 0.3 + 0.1; baseOpacity = 0.35;
        }
        return {
          x: Math.random() * w, y: Math.random() * h,
          radius, opacity: baseOpacity, baseOpacity,
          twinkleSpeed: 0.5 + Math.random() * 2,
          twinkleOffset: Math.random() * Math.PI * 2,
          parallax,
        };
      });

      // Dust particles
      dustRef.current = Array.from({ length: DUST_COUNT }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.04, vy: (Math.random() - 0.5) * 0.04,
        radius: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.18 + 0.05,
      }));

      // Pulsars
      pulsarsRef.current = Array.from({ length: PULSAR_COUNT }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        radius: 2.5 + Math.random() * 1.5,
        opacity: 0.4, baseOpacity: 0.4,
        twinkleSpeed: 0.3 + Math.random() * 0.6,
        twinkleOffset: Math.random() * Math.PI * 2,
        parallax: 0.4,
      }));

      // Nebulae
      nebulaeRef.current = [
        { x: w * 0.25, y: h * 0.3, rx: 300, ry: 180, r: 80, g: 30, b: 180, phase: 0 },
        { x: w * 0.7, y: h * 0.6, rx: 250, ry: 200, r: 20, g: 100, b: 200, phase: 2 },
        { x: w * 0.5, y: h * 0.8, rx: 350, ry: 150, r: 140, g: 20, b: 180, phase: 4 },
      ];
    };

    /* ── Mouse ── */
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    /* ── Draw loop ── */
    const t0 = performance.now();
    const draw = (now: number) => {
      const t = (now - t0) * 0.001;
      const w = canvas.width, h = canvas.height;
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // ── Nebulae ──
      for (const n of nebulaeRef.current) {
        const wave = Math.sin(t * 0.1 + n.phase) * 30;
        const rx = n.rx + wave, ry = n.ry + wave * 0.5;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(rx, ry));
        grad.addColorStop(0, `rgba(${n.r},${n.g},${n.b},0.12)`);
        grad.addColorStop(0.4, `rgba(${n.r},${n.g},${n.b},0.04)`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(n.x, n.y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Gravitational lens effect on stars ──
      const lensRadius = 200;
      for (const s of starsRef.current) {
        const dx = s.x - mx, dy = s.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let offsetX = 0, offsetY = 0;
        if (dist < lensRadius && dist > 0) {
          const force = (1 - dist / lensRadius) * 12 * s.parallax;
          offsetX = (dx / dist) * force;
          offsetY = (dy / dist) * force;
        }
        const sx = s.x + offsetX, sy = s.y + offsetY;
        const twinkle = s.baseOpacity + Math.sin(t * s.twinkleSpeed + s.twinkleOffset) * 0.25;
        s.opacity = Math.max(0.1, Math.min(1, twinkle));
        ctx.beginPath();
        ctx.arc(sx, sy, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity.toFixed(2)})`;
        ctx.fill();
      }

      // ── Pulsars with cross glow ──
      for (const p of pulsarsRef.current) {
        const pulse = 0.6 + Math.sin(t * p.twinkleSpeed * 4 + p.twinkleOffset) * 0.4;
        const alpha = p.baseOpacity * pulse;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 + pulse * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,182,212,${alpha.toFixed(2)})`;
        ctx.fill();
        // Cross glow
        ctx.strokeStyle = `rgba(6,182,212,${(alpha * 0.5).toFixed(2)})`;
        ctx.lineWidth = 0.5;
        for (let a = 0; a < 4; a++) {
          const angle = (Math.PI / 4) * a + t * 0.1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + Math.cos(angle) * 20 * pulse, p.y + Math.sin(angle) * 20 * pulse);
          ctx.stroke();
        }
      }

      // ── Dust ──
      for (const d of dustRef.current) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,191,36,${d.opacity.toFixed(3)})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "none", background: "transparent" }}
    />
  );
}
