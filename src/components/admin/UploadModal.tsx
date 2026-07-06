"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Minimize2, Maximize2, Loader2, CheckCircle, File, GripHorizontal } from "lucide-react";

type QueueItem = {
  id: string; file: File; progress: number; status: "pending" | "uploading" | "done" | "error";
  url?: string; error?: string;
};

export function UploadModal() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(0);

  // Drag resize state
  const [size, setSize] = useState({ w: 480, h: 360 });
  const resizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const addFiles = useCallback((files: FileList | File[]) => {
    const items: QueueItem[] = [];
    for (const file of Array.from(files)) {
      items.push({ id: `q${idCounter.current++}`, file, progress: 0, status: "pending" });
    }
    setQueue((prev) => [...prev, ...items]);
  }, []);

  const startUpload = useCallback(async () => {
    const pending = queue.filter((q) => q.status === "pending");
    if (!pending.length) return;
    setUploading(true);
    for (const item of pending) {
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "uploading" as const, progress: 0 } : q)));
      try {
        const formData = new FormData();
        formData.append("file", item.file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "done", progress: 100, url: data.files?.[0]?.url } : q)));
        } else throw new Error("Upload failed");
      } catch {
        setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "error", error: "Failed" } : q)));
      }
    }
    setUploading(false);
  }, [queue]);

  const clearDone = () => setQueue((prev) => prev.filter((q) => q.status !== "done"));

  // Shared satellite icon — visible on all admin pages
  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        style={{ boxShadow: "0 0 30px rgba(6,182,212,0.4)" }}
      >
        <Upload className="h-6 w-6" />
        {/* Satellite ring */}
        <span className="absolute inset-0 rounded-full border border-white/20 animate-spin" style={{ animationDuration: "8s" }} />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && !minimized && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-[70] rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] shadow-2xl hud-corners overflow-hidden"
              style={{ top: "15%", left: "50%", marginLeft: -size.w / 2, width: size.w, height: "auto", maxHeight: "70vh" }}
            >
              {/* Title bar */}
              <div className="flex items-center justify-between p-3 border-b border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)]/50">
                <h3 className="text-sm font-semibold text-[var(--cosmic-text-primary)]">File Upload — Mission Control</h3>
                <div className="flex items-center gap-1">
                  <button onClick={() => setMinimized(true)} className="p-1.5 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)]"><Minimize2 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setOpen(false)} className="p-1.5 text-[var(--cosmic-star-dim)] hover:text-red-400"><X className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "55vh" }}>
                {/* Drop zone */}
                <div
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
                  className="rounded-xl border-2 border-dashed border-[var(--cosmic-orbit-glow)] p-6 text-center cursor-pointer hover:border-[var(--cosmic-accent-cyan)] transition-colors"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-[var(--cosmic-accent-cyan)] opacity-60" />
                  <p className="text-sm text-[var(--cosmic-star-dim)]">Drop files or click to browse</p>
                  <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
                </div>

                {/* Queue */}
                {queue.map((item) => (
                  <div key={item.id} className={`flex items-center gap-3 rounded-lg border p-2.5 text-xs ${
                    item.status === "error" ? "border-red-500/30 bg-red-500/5" :
                    item.status === "done" ? "border-green-500/30 bg-green-500/5" :
                    "border-[var(--cosmic-orbit-glow)]"
                  }`}>
                    <File className="h-4 w-4 flex-shrink-0 text-[var(--cosmic-star-dim)]" />
                    <span className="flex-1 truncate text-[var(--cosmic-text-primary)]">{item.file.name}</span>
                    {item.status === "uploading" && <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--cosmic-accent-cyan)]" />}
                    {item.status === "done" && <CheckCircle className="h-3.5 w-3.5 text-green-400" />}
                    {item.status === "error" && <span className="text-red-400 text-[10px]">{item.error}</span>}
                    <button onClick={() => setQueue((prev) => prev.filter((q) => q.id !== item.id))} className="text-[var(--cosmic-star-dim)] hover:text-red-400"><X className="h-3 w-3" /></button>
                  </div>
                ))}

                {queue.some((q) => q.status === "pending") && (
                  <button onClick={startUpload} disabled={uploading}
                    className="w-full rounded-lg bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : <Upload className="h-4 w-4 inline mr-2" />}
                    {uploading ? "Uploading..." : `Upload ${queue.filter((q) => q.status === "pending").length} file(s)`}
                  </button>
                )}
                {queue.some((q) => q.status === "done") && (
                  <button onClick={clearDone} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] py-2 text-xs text-[var(--cosmic-star-dim)] hover:border-[var(--cosmic-accent-cyan)]">Clear completed</button>
                )}
              </div>

              {/* Resize handle */}
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                onMouseDown={(e) => {
                  resizing.current = true;
                  resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
                  const onMove = (ev: MouseEvent) => {
                    if (!resizing.current) return;
                    setSize({ w: Math.max(360, resizeStart.current.w + ev.clientX - resizeStart.current.x), h: Math.max(280, resizeStart.current.h + ev.clientY - resizeStart.current.y) });
                  };
                  const onUp = () => { resizing.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
                  window.addEventListener("mousemove", onMove);
                  window.addEventListener("mouseup", onUp);
                }}
              >
                <GripHorizontal className="h-3 w-3 text-[var(--cosmic-star-dim)] rotate-45" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Minimized state */}
      {minimized && (
        <div
          onClick={() => setMinimized(false)}
          className="fixed bottom-24 right-6 z-50 rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] p-3 shadow-lg cursor-pointer hover:border-[var(--cosmic-accent-cyan)] flex items-center gap-2"
        >
          <Upload className="h-4 w-4 text-[var(--cosmic-accent-cyan)]" />
          <span className="text-xs text-[var(--cosmic-star-dim)]">{queue.filter((q) => q.status === "done").length}/{queue.length} done</span>
          <button onClick={(e) => { e.stopPropagation(); setOpen(false); setMinimized(false); }} className="text-[var(--cosmic-star-dim)] hover:text-red-400"><X className="h-3 w-3" /></button>
        </div>
      )}
    </>
  );
}
