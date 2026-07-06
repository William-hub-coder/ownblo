"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FolderOpen, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "zh";

  useEffect(() => {
    console.error("Project error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--cyber-border)] bg-[var(--cyber-surface)]">
          <FolderOpen className="h-10 w-10 text-[var(--cyber-primary)]" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-[var(--cyber-text)]">
          {locale === "zh" ? "项目加载失败" : "Project Failed to Load"}
        </h1>
        <p className="mb-6 text-sm text-[var(--cyber-muted)]">
          {locale === "zh"
            ? "加载此项目详情时出现问题，请重试。"
            : "There was a problem loading this project. Please try again."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--cyber-primary)]/25 transition-all hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" />
            {locale === "zh" ? "重试" : "Try Again"}
          </button>
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--cyber-border)] px-6 py-2.5 text-sm font-semibold text-[var(--cyber-text)] transition-all hover:border-[var(--cyber-primary)] hover:text-[var(--cyber-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === "zh" ? "返回项目" : "Back to Projects"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
