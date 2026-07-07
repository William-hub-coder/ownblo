"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { adminT } from "@/lib/admin-i18n";

/** Append EdgeOne preview token if present */
function eoAwareUrl(path: string): string {
  if (typeof window === "undefined") return path;
  const eoParams = sessionStorage.getItem("__eo_params__");
  if (eoParams) {
    return path + (path.includes("?") ? "&" : "?") + eoParams;
  }
  return path;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "locked">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState(0);

  // Fetch CSRF token on mount
  useEffect(() => {
    fetch(eoAwareUrl("/api/admin/csrf"))
      .then((res) => res.ok && setCsrfToken(res.headers.get("x-csrf-token")))
      .catch(() => {});
  }, []);

  // Retry countdown timer
  useEffect(() => {
    if (retryCountdown <= 0) return;
    const timer = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev <= 1) { setStatus("idle"); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [retryCountdown]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || status === "loading" || status === "locked") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const url = eoAwareUrl("/api/admin/auth");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }

      const data = await res.json();

      if (res.status === 429) {
        // Rate limited — show countdown
        setStatus("locked");
        setRetryCountdown(data.retryAfter || 60);
        setErrorMsg(
          `Too many attempts. Please wait ${data.retryAfter || 60}s.`,
        );
        return;
      }

      if (res.status === 403) {
        // CSRF failed — refresh token and retry
        setErrorMsg(adminT("networkError"));
        setStatus("error");
        // Re-fetch CSRF token
        fetch(eoAwareUrl("/api/admin/csrf"))
          .then((r) => r.ok && setCsrfToken(r.headers.get("x-csrf-token")))
          .catch(() => {});
        return;
      }

      // 401 or other errors
      const remaining = data.attemptsRemaining;
      if (remaining !== undefined && remaining <= 2) {
        setErrorMsg(
          `密码错误。还剩 ${remaining} 次尝试机会。`,
        );
      } else {
        setErrorMsg(
          data.error === "密码错误" ? adminT("wrongPassword") : adminT("networkError"),
        );
      }
      setStatus("error");
    } catch {
      setErrorMsg(adminT("networkError"));
      setStatus("error");
    }
  }, [password, status, csrfToken, router]);

  const isDisabled = status === "loading" || status === "locked" || !password.trim();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--cosmic-bg-primary)] px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)]"
            style={{ boxShadow: "0 0 40px rgba(6,182,212,0.3)" }}
          >
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[var(--cosmic-text-primary)]">
            {adminT("adminPanel")}
          </h1>
          <p className="mt-1 text-sm text-[var(--cosmic-star-dim)]">
            {adminT("enterPassword")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder={adminT("enterPassword")}
              autoFocus
              disabled={isDisabled}
              className="w-full rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] px-4 py-3 pr-12 text-sm text-[var(--cosmic-text-primary)] placeholder:text-[var(--cosmic-star-dim)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)] transition-all duration-300 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-text-primary)] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {status === "error" && errorMsg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400 text-center"
            >
              {errorMsg}
            </motion.p>
          )}

          {status === "locked" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-sm text-amber-400">{errorMsg}</p>
              {retryCountdown > 0 && (
                <p className="text-xs text-[var(--cosmic-star-dim)] mt-1">
                  Retry available in {retryCountdown}s
                </p>
              )}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full rounded-xl bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}
          >
            <span className="flex items-center justify-center gap-2">
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {adminT("signingIn")}
                </>
              ) : status === "locked" ? (
                `Locked (${retryCountdown}s)`
              ) : (
                adminT("signIn")
              )}
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
