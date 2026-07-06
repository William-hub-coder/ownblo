"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--cyber-border)] bg-[var(--cyber-surface)]">
          <AlertTriangle className="h-10 w-10 text-[var(--cyber-primary)]" />
        </div>

        {/* Message */}
        <h1 className="mb-3 text-2xl font-bold text-[var(--cyber-text)]">
          Something went wrong
        </h1>
        <p className="mb-2 text-sm text-[var(--cyber-muted)]">
          An unexpected error occurred while loading this page.
        </p>
        {error.digest && (
          <p className="mb-6 text-xs text-[var(--cyber-muted)]/60 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--cyber-primary)]/25 transition-all hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--cyber-border)] px-6 py-2.5 text-sm font-semibold text-[var(--cyber-text)] transition-all hover:border-[var(--cyber-primary)] hover:text-[var(--cyber-primary)]"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
