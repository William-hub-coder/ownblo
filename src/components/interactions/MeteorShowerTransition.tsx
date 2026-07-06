"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface Meteor {
  x: number; y: number; vx: number; vy: number;
  trailLen: number; color: string; headSize: number;
  waveAmp: number; waveFreq: number; waveOffset: number;
  life: number; maxLife: number; pulsePhase: number;
}

const COLORS = ["#ffffff", "#fbbf24", "#06b6d4", "#8b5cf6", "#e879f9"];

export function MeteorShowerTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meteorsRef = useRef<Meteor[]>([]);
  const animRef = useRef(0);
  const lastTrigger = useRef(0);
  const prefersReduced = useRef(false);

  const pathname = usePathname();

  // Trigger on route change
  useEffect(() => {
    if (prefersReduced.current) return;
    const now = performance.now();
    if (now - lastTrigger.current < 2000) return; // cooldown 2s
    lastTrigger.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width, h = canvas.height;

    const count = 4 + Math.floor(Math.random() * 5); // 4-8 meteors
    for (let i = 0; i < count; i++) {
      const delay = i * (50 + Math.random() * 100);
      const angle = (15 + Math.random() * 60) * (Math.PI / 180); // 15-75 degrees
      const speed = 18 + Math.random() * 10;
      setTimeout(() => {
        const m: Meteor = {
          x: Math.random() * w - 100 - Math.random() * 200,
          y: -50 - Math.random() * 100,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          trailLen: 80 + Math.random() * 80,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          headSize: 3 + Math.random() * 3,
          waveAmp: 5 + Math.random() * 10,
          waveFreq: 0.02 + Math.random() * 0.03,
          waveOffset: Math.random() * Math.PI * 2,
          life: 1, maxLife: 800 + Math.random() * 400,
          pulsePhase: Math.random() * Math.PI * 2,
        };
        meteorsRef.current.push(m);
      }, delay);
    }
  }, [pathname]);

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

    let lastT = performance.now();
    const draw = (now: number) => {
      const dt = Math.min((now - lastT) * 0.06, 2); // speed factor
      lastT = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const m of meteorsRef.current) {
        m.life -= dt / m.maxLife;
        if (m.life <= 0) continue;

        // Apply sine wave bend to trajectory
        const bendX = Math.sin(now * 0.001 * m.waveFreq * 10 + m.waveOffset) * m.waveAmp * m.life;
        const bendY = Math.cos(now * 0.001 * m.waveFreq * 10 + m.waveOffset) * m.waveAmp * 0.5 * m.life;
        m.x += (m.vx + bendX * 0.1) * dt;
        m.y += (m.vy + bendY * 0.1) * dt;

        // Pulse head brightness
        const pulse = 0.7 + 0.3 * Math.sin(now * 0.01 + m.pulsePhase);
        const alpha = Math.max(0, m.life) * pulse;

        // Draw trail — linear gradient from head backward
        const trailGrad = ctx.createLinearGradient(
          m.x, m.y,
          m.x - (m.vx * m.trailLen * 0.01),
          m.y - (m.vy * m.trailLen * 0.01),
        );
        trailGrad.addColorStop(0, m.color);
        trailGrad.addColorStop(1, "transparent");

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 3 * m.life;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 20 + 10 * m.life;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(
          m.x - (m.vx * m.trailLen * 0.06) * dt,
          m.y - (m.vy * m.trailLen * 0.06) * dt,
        );
        ctx.stroke();

        // Head bright dot
        ctx.globalAlpha = alpha;
        ctx.fillStyle = m.color === "#ffffff" ? "#ffffff" : m.color;
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.headSize * m.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      meteorsRef.current = meteorsRef.current.filter((m) => m.life > 0);
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 9997, pointerEvents: "none" }}
    />
  );
}
