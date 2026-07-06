"use client";

import { useState, useEffect, useRef } from "react";

type TextDecodeProps = {
  text: string;
  className?: string;
  /** Characters to cycle through before landing on final */
  chars?: string;
  /** Duration per character in ms */
  speed?: number;
  /** Delay before starting animation in ms */
  delay?: number;
  /** Only fire once when element enters viewport */
  once?: boolean;
};

const DEFAULT_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";

export function TextDecode({
  text,
  className = "",
  chars = DEFAULT_CHARS,
  speed = 50,
  delay = 300,
  once = true,
}: TextDecodeProps) {
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          if (once) observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started, once]);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      let idx = 0;
      const interval = setInterval(() => {
        if (idx <= text.length) {
          const partial = text
            .slice(0, idx)
            .split("")
            .map((c) => (c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]))
            .join("");
          setDisplay(partial);
          idx++;
        } else {
          setDisplay(text);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [started, text, chars, speed, delay]);

  return (
    <span ref={ref} className={className} style={{ color: "var(--cosmic-accent-cyan)" }}>
      {display || text}
    </span>
  );
}
