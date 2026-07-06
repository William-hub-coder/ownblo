"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Loader2, CheckCircle, X, File as FileIcon } from "lucide-react";
import { CosmicDropZone } from "@/components/interactions/CosmicDropZone";

type UploadFile = {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  url?: string;
  error?: string;
};

type UniversalUploaderProps = {
  onComplete?: (results: { url: string; id: string }[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
};

export function UniversalUploader({
  onComplete,
  accept = "image/*",
  multiple = true,
  maxSizeMB = 5,
}: UniversalUploaderProps) {
  const [queue, setQueue] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const idCounter = useRef(0);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const maxSize = maxSizeMB * 1024 * 1024;
    const items: UploadFile[] = [];
    for (const file of Array.from(newFiles)) {
      if (file.size > maxSize) {
        items.push({ id: `e${idCounter.current++}`, file, progress: 0, status: "error", error: `Exceeds ${maxSizeMB}MB` });
        continue;
      }
      items.push({ id: `f${idCounter.current++}`, file, progress: 0, status: "pending" });
    }
    setQueue((prev) => [...prev, ...items]);
  }, [maxSizeMB]);

  const startUpload = useCallback(async () => {
    const pending = queue.filter((q) => q.status === "pending");
    if (!pending.length) return;

    setUploading(true);
    const completed: { url: string; id: string }[] = [];

    for (const item of pending) {
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "uploading" as const } : q)));

      try {
        const formData = new FormData();
        formData.append("file", item.file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          const url = data.files?.[0]?.url || "";
          setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "done", progress: 100, url } : q)));
          completed.push({ url, id: item.id });
        } else {
          throw new Error("Upload failed");
        }
      } catch {
        setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "error", error: "Upload failed" } : q)));
      }
    }

    setUploading(false);
    if (completed.length && onComplete) onComplete(completed);
  }, [queue, onComplete]);

  const removeItem = (id: string) => setQueue((prev) => prev.filter((q) => q.id !== id));
  const clearDone = () => setQueue((prev) => prev.filter((q) => q.status !== "done"));

  return (
    <div className="space-y-3">
      <CosmicDropZone
        onFiles={addFiles}
        accept={accept}
        multiple={multiple}
        label="Release to upload"
        className="rounded-xl border-2 border-dashed border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] p-8 text-center hover:border-[var(--cosmic-accent-cyan)] transition-colors cursor-pointer"
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-[var(--cosmic-accent-cyan)] opacity-60" />
        <p className="text-sm text-[var(--cosmic-star-dim)]">Drag & drop or click to browse</p>
        <p className="text-xs text-[var(--cosmic-star-dim)]/60 mt-1">
          {accept.replace(/\*/g, "").toUpperCase().replace(/,/g, ", ")} · Max {maxSizeMB}MB
        </p>
      </CosmicDropZone>

      {queue.length > 0 && (
        <div className="space-y-2">
          {queue.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
                item.status === "error" ? "border-red-500/30 bg-red-500/5" :
                item.status === "done" ? "border-green-500/30 bg-green-500/5" :
                "border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)]"
              }`}
            >
              <FileIcon className="h-5 w-5 flex-shrink-0 text-[var(--cosmic-star-dim)]" />
              <span className="flex-1 truncate text-[var(--cosmic-text-primary)]">{item.file.name}</span>
              <span className="text-xs text-[var(--cosmic-star-dim)]">{(item.file.size / 1024).toFixed(0)} KB</span>
              {item.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-[var(--cosmic-accent-cyan)]" />}
              {item.status === "done" && <CheckCircle className="h-4 w-4 text-green-400" />}
              {item.status === "error" && <span className="text-xs text-red-400">{item.error}</span>}
              <button onClick={() => removeItem(item.id)} className="p-1 text-[var(--cosmic-star-dim)] hover:text-red-400"><X className="h-3.5 w-3.5" /></button>
            </div>
          ))}

          <div className="flex gap-2">
            {queue.some((q) => q.status === "pending") && (
              <button
                onClick={startUpload}
                disabled={uploading}
                className="rounded-lg bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin inline mr-1" /> : <Upload className="h-4 w-4 inline mr-1" />}
                {uploading ? "Uploading..." : `Upload ${queue.filter((q) => q.status === "pending").length} file(s)`}
              </button>
            )}
            {queue.some((q) => q.status === "done") && (
              <button onClick={clearDone} className="rounded-lg border border-[var(--cosmic-orbit-glow)] px-4 py-2 text-xs text-[var(--cosmic-star-dim)] hover:border-[var(--cosmic-accent-cyan)]">
                Clear completed
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
