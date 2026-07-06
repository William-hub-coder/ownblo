"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

type MediaFile = {
  name: string;
  url: string;
  size: number;
  modified: string;
};

type MediaPickerProps = {
  onSelect: (url: string) => void;
  onClose: () => void;
};

export function MediaPicker({ onSelect, onClose }: MediaPickerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media");
    if (res.ok) {
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      await fetchFiles();
    }
    setUploading(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] flex flex-col rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--cyber-border)]">
          <h3 className="font-semibold text-[var(--cyber-text)]">Media Library</h3>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer rounded-lg bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity">
              <Upload className="h-3.5 w-3.5 inline mr-1" />
              {uploading ? "Uploading..." : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[var(--cyber-muted)] hover:text-[var(--cyber-text)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-12 text-[var(--cyber-muted)]">Loading...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-12 text-[var(--cyber-muted)]">
              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No files yet. Upload something!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => onSelect(file.url)}
                  className="group relative aspect-square rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)] overflow-hidden hover:border-[var(--cyber-primary)] transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Select
                    </span>
                  </div>
                  <p className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[9px] text-white/70">
                    {file.name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
