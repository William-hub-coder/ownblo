"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Crop, X, Check, Loader2, Move } from "lucide-react";

type AvatarCropperProps = {
  currentUrl: string;
  onSave: (url: string) => void;
  onCancel: () => void;
};

export function AvatarCropper({ currentUrl, onSave, onCancel }: AvatarCropperProps) {
  const [src, setSrc] = useState<string>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [crop, setCrop] = useState({ x: 50, y: 50, size: 80 }); // percentage-based
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  // Mouse-based crop area dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    const startCrop = { ...crop };

    const onMove = (ev: MouseEvent) => {
      const dx = ((ev.clientX - rect.left - startX) / rect.width) * 100;
      const dy = ((ev.clientY - rect.top - startY) / rect.height) * 100;
      setCrop({
        x: Math.max(0, Math.min(100 - crop.size, startCrop.x + dx)),
        y: Math.max(0, Math.min(100 - crop.size, startCrop.y + dy)),
        size: crop.size,
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Mouse wheel resize
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -2 : 2;
    const newSize = Math.max(20, Math.min(100, crop.size + delta));
    setCrop({
      x: Math.max(0, Math.min(100 - newSize, crop.x)),
      y: Math.max(0, Math.min(100 - newSize, crop.y)),
      size: newSize,
    });
  };

  const doCrop = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const scale = img.naturalWidth / img.width;
    const sx = (crop.x / 100) * img.naturalWidth;
    const sy = (crop.y / 100) * img.naturalHeight;
    const sSize = (crop.size / 100) * Math.min(img.naturalWidth, img.naturalHeight);

    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw cropped region centered
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, 256, 256);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setUploading(true);
      const formData = new FormData();
      formData.append("file", blob, "avatar.webp");
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          onSave(data.files?.[0]?.url || "");
        }
      } catch { /* ignore */ }
      setUploading(false);
    }, "image/webp", 0.85);
  }, [crop, onSave]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] shadow-2xl p-6 hud-corners">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--cosmic-text-primary)]">裁剪头像</h3>
          <button onClick={onCancel} className="text-[var(--cosmic-star-dim)] hover:text-red-400"><X className="h-5 w-5" /></button>
        </div>

        {!src ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("avatar-file-input")?.click()}
            className={`rounded-xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
              dragging ? "border-[var(--cosmic-accent-cyan)] bg-[var(--cosmic-accent-cyan)]/5" : "border-[var(--cosmic-orbit-glow)]"
            }`}
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-[var(--cosmic-star-dim)]/40" />
            <p className="text-sm text-[var(--cosmic-star-dim)]">拖拽图片到此处或点击上传</p>
            <input id="avatar-file-input" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Crop area */}
            <div
              ref={containerRef}
              className="relative mx-auto overflow-hidden rounded-lg border border-[var(--cosmic-orbit-glow)] bg-black/30 select-none"
              style={{ width: 300, height: 300 }}
              onMouseDown={handleMouseDown}
              onWheel={handleWheel}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imgRef} src={src} alt="Crop" className="w-full h-full object-contain" draggable={false} />
              {/* Crop overlay */}
              <div className="absolute inset-0 bg-black/40 pointer-events-none">
                <div
                  className="absolute rounded-full border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"
                  style={{
                    left: `${crop.x}%`, top: `${crop.y}%`,
                    width: `${crop.size}%`, height: `${crop.size}%`,
                  }}
                />
              </div>
              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute top-1/2 left-0 right-0 border-t border-white/50" />
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-white/50" />
              </div>
              <div className="absolute bottom-2 left-2 text-[10px] text-white/50 bg-black/40 px-1.5 py-0.5 rounded">
                拖拽移动 · 滚轮缩放
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button onClick={() => setSrc("")} className="text-xs text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)] flex items-center gap-1">
                <Upload className="h-3.5 w-3.5" /> 重新选择
              </button>
              <div className="flex gap-2">
                <button onClick={onCancel}
                  className="rounded-lg border border-[var(--cosmic-orbit-glow)] px-4 py-2 text-xs text-[var(--cosmic-star-dim)] hover:border-red-400 hover:text-red-400">
                  取消
                </button>
                <button onClick={doCrop} disabled={uploading}
                  className="rounded-lg bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5">
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  {uploading ? "上传中..." : "确认裁剪"}
                </button>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
