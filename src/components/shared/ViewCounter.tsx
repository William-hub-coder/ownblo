"use client";

import { useEffect } from "react";

type ViewCounterProps = {
  type: "articles" | "projects";
  slug: string;
};

export function ViewCounter({ type, slug }: ViewCounterProps) {
  useEffect(() => {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug }),
    }).catch(() => {});
  }, [type, slug]);

  return null; // invisible, just tracks
}
