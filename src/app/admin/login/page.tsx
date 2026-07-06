"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { adminT } from "@/lib/admin-i18n";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { router.push("/admin"); router.refresh(); }
      else {
        const data = await res.json();
        setErrorMsg(data.error === "Invalid password" ? adminT("wrongPassword") : adminT("networkError"));
        setStatus("error");
      }
    } catch { setErrorMsg(adminT("networkError")); setStatus("error"); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--cosmic-bg-primary)] px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)]"
            style={{ boxShadow: "0 0 40px rgba(6,182,212,0.3)" }}>
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[var(--cosmic-text-primary)]">{adminT("adminPanel")}</h1>
          <p className="mt-1 text-sm text-[var(--cosmic-star-dim)]">{adminT("enterPassword")}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password}
              onChange={(e) => { setPassword(e.target.value); setStatus("idle"); }}
              placeholder={adminT("enterPassword")} autoFocus
              className="w-full rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] px-4 py-3 pr-12 text-sm text-[var(--cosmic-text-primary)] placeholder:text-[var(--cosmic-star-dim)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)] transition-all duration-300" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-text-primary)] transition-colors">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {status === "error" && errorMsg && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400 text-center">{errorMsg}</motion.p>
          )}
          <button type="submit" disabled={status === "loading" || !password.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}>
            <span className="flex items-center justify-center gap-2">
              {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" />{adminT("signingIn")}</> : adminT("signIn")}
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
