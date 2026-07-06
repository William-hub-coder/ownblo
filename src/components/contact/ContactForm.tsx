"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [planeFlying, setPlaneFlying] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("sending");
    setPlaneFlying(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setTimeout(() => {
          setStatus("success");
          setPlaneFlying(false);
          reset();
        }, 1000);
      } else {
        throw new Error("Failed to send");
      }
    } catch {
      setStatus("error");
      setPlaneFlying(false);
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="relative">
      {/* Paper Plane Animation */}
      <AnimatePresence>
        {planeFlying && (
          <motion.div
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: 300,
              y: -200,
              rotate: -30,
              opacity: 0,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-4 right-4 z-10"
          >
            <Send className="h-8 w-8 text-[var(--cyber-primary)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State */}
      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[var(--cyber-text)] mb-2">
            {t("success")}
          </h3>
          <p className="text-[var(--cyber-muted)]">{t("success_desc")}</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 text-sm text-[var(--cyber-primary)] hover:underline"
          >
            {t("send")}
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Name & Email */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--cyber-text)] mb-2">
                {t("name")}
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder={t("name_placeholder")}
                className="w-full rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 px-4 py-3 text-sm text-[var(--cyber-text)] placeholder:text-[var(--cyber-muted)] focus:outline-none focus:border-[var(--cyber-primary)] focus:ring-1 focus:ring-[var(--cyber-primary)]/30 transition-all duration-300"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--cyber-text)] mb-2">
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder={t("email_placeholder")}
                className="w-full rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 px-4 py-3 text-sm text-[var(--cyber-text)] placeholder:text-[var(--cyber-muted)] focus:outline-none focus:border-[var(--cyber-primary)] focus:ring-1 focus:ring-[var(--cyber-primary)]/30 transition-all duration-300"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-[var(--cyber-text)] mb-2">
              {t("subject")}
            </label>
            <input
              id="subject"
              type="text"
              {...register("subject")}
              placeholder={t("subject_placeholder")}
              className="w-full rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 px-4 py-3 text-sm text-[var(--cyber-text)] placeholder:text-[var(--cyber-muted)] focus:outline-none focus:border-[var(--cyber-primary)] focus:ring-1 focus:ring-[var(--cyber-primary)]/30 transition-all duration-300"
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[var(--cyber-text)] mb-2">
              {t("message")}
            </label>
            <textarea
              id="message"
              rows={6}
              {...register("message")}
              placeholder={t("message_placeholder")}
              className="w-full rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 px-4 py-3 text-sm text-[var(--cyber-text)] placeholder:text-[var(--cyber-muted)] focus:outline-none focus:border-[var(--cyber-primary)] focus:ring-1 focus:ring-[var(--cyber-primary)]/30 transition-all duration-300 resize-none"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
            )}
          </div>

          {/* Error State */}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-red-400"
            >
              <AlertCircle className="h-4 w-4" />
              {t("error_desc")}
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="group relative w-full rounded-xl bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--cyber-primary)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--cyber-primary)]/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="flex items-center justify-center gap-2">
              {status === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("sending")}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t("send")}
                </>
              )}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
