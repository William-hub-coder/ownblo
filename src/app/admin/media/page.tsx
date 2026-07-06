"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createElement } from "react";
import {
  Upload, Trash2, Copy, CheckCircle, Search, Grid3X3, List,
  Folder, Image, Video, FileText, Code, X, Pencil, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { UniversalUploader } from "@/components/admin/UniversalUploader";
import type { MediaFile, MediaListResponse } from "@/types/media";

const TYPE_ICONS: Record<string, React.ElementType> = {
  image: Image, video: Video, document: FileText, code: Code,
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function AdminMediaPage() {
  const [data, setData] = useState<MediaListResponse>({ files: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState({ type: "all", search: "", page: 1 });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<MediaFile | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<string[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const uploaderRef = useRef<HTMLDivElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      type: filter.type,
      search: filter.search,
      page: String(filter.page),
      limit: "50",
    });
    const res = await fetch(`/api/admin/media?${params}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleDelete = async () => {
    if (!deleteTargets) return;
    await fetch(`/api/admin/media?ids=${deleteTargets.join(",")}`, { method: "DELETE" });
    setDeleteTargets(null);
    setSelected(new Set());
    await fetchFiles();
  };

  const handleSaveMeta = async () => {
    if (!editing) return;
    await fetch(`/api/admin/media/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    await fetchFiles();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const typeFilters = ["all", "image", "video", "document", "code"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cosmic-text-primary)]">Media Library</h1>
          <p className="text-xs text-[var(--cosmic-star-dim)] mt-1 font-mono">
            T+{Math.floor((Date.now() - (performance?.timeOrigin || Date.now())) / 1000).toString().padStart(6, "0")} · {data.total} files · {formatSize(data.files.reduce((s, f) => s + f.size, 0))}
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Upload className="h-4 w-4" /> Upload
        </button>
      </div>

      {/* Upload zone */}
      {showUpload && (
        <div ref={uploaderRef} className="mb-6 rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] p-4 hud-corners">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--cosmic-text-primary)]">Upload Files</h3>
            <button onClick={() => setShowUpload(false)} className="text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-text-primary)]"><X className="h-4 w-4" /></button>
          </div>
          <UniversalUploader onComplete={() => { fetchFiles(); setShowUpload(false); }} />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--cosmic-star-dim)]" />
          <input
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value, page: 1 })}
            placeholder="Search files..."
            className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] pl-9 pr-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]"
          />
        </div>
        <div className="flex gap-1">
          {typeFilters.map((t) => (
            <button
              key={t}
              onClick={() => setFilter({ ...filter, type: t, page: 1 })}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filter.type === t
                  ? "bg-[var(--cosmic-accent-cyan)]/20 text-[var(--cosmic-accent-cyan)] border border-[var(--cosmic-accent-cyan)]/30"
                  : "text-[var(--cosmic-star-dim)] border border-[var(--cosmic-orbit-glow)] hover:border-[var(--cosmic-accent-cyan)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setViewMode("grid")} className={`rounded-lg p-2 ${viewMode === "grid" ? "text-[var(--cosmic-accent-cyan)]" : "text-[var(--cosmic-star-dim)]"}`}><Grid3X3 className="h-4 w-4" /></button>
          <button onClick={() => setViewMode("list")} className={`rounded-lg p-2 ${viewMode === "list" ? "text-[var(--cosmic-accent-cyan)]" : "text-[var(--cosmic-star-dim)]"}`}><List className="h-4 w-4" /></button>
        </div>
        {selected.size > 0 && (
          <button
            onClick={() => setDeleteTargets(Array.from(selected))}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete {selected.size}
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-[var(--cosmic-star-dim)]"><Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" /> Loading...</div>
      ) : data.files.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-[var(--cosmic-orbit-glow)]">
          <Image className="h-10 w-10 mx-auto mb-2 text-[var(--cosmic-star-dim)]/20" />
          <p className="text-sm text-[var(--cosmic-star-dim)]">No files found.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {data.files.map((file) => {
            const Icon = TYPE_ICONS[file.type] || FileText;
            const isSel = selected.has(file.id);
            return (
              <div
                key={file.id}
                onClick={() => toggleSelect(file.id)}
                className={`group relative rounded-xl border bg-[var(--cosmic-bg-card)] overflow-hidden cursor-pointer transition-all ${
                  isSel ? "border-[var(--cosmic-accent-cyan)] ring-1 ring-[var(--cosmic-accent-cyan)]" : "border-[var(--cosmic-orbit-glow)] hover:border-[var(--cosmic-accent-cyan)]"
                }`}
              >
                {file.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.url} alt={file.filename} className="w-full aspect-square object-cover" loading="lazy" />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center bg-[var(--cosmic-bg-secondary)]">
                    <Icon className="h-10 w-10 text-[var(--cosmic-star-dim)]/30" />
                  </div>
                )}
                <div className="p-2">
                  <p className="text-xs text-[var(--cosmic-text-primary)] truncate">{file.filename}</p>
                  <p className="text-[10px] text-[var(--cosmic-star-dim)]">{formatSize(file.size)}</p>
                </div>
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={(e) => { e.stopPropagation(); copyUrl(file.url); }} className="rounded-lg bg-white/20 p-2 text-white hover:bg-white/40">
                    {copied === file.url ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setEditing(file); }} className="rounded-lg bg-white/20 p-2 text-white hover:bg-white/40">
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1 rounded-xl border border-[var(--cosmic-orbit-glow)] overflow-hidden">
          {data.files.map((file) => {
            const isSel = selected.has(file.id);
            return (
              <div
                key={file.id}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                  isSel ? "bg-[var(--cosmic-accent-cyan)]/10" : "hover:bg-[var(--cosmic-bg-card)]"
                }`}
                onClick={() => toggleSelect(file.id)}
              >
                <input type="checkbox" checked={isSel} readOnly className="rounded" />
                {createElement(TYPE_ICONS[file.type] || FileText, { className: "h-4 w-4 text-[var(--cosmic-star-dim)] flex-shrink-0" })}
                <span className="flex-1 truncate text-[var(--cosmic-text-primary)]">{file.filename}</span>
                <span className="text-xs text-[var(--cosmic-star-dim)]">{formatSize(file.size)}</span>
                <span className="text-xs text-[var(--cosmic-star-dim)]">{new Date(file.createdAt).toLocaleDateString()}</span>
                <button onClick={(e) => { e.stopPropagation(); copyUrl(file.url); }} className="p-1 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)]"><Copy className="h-3.5 w-3.5" /></button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
            disabled={filter.page <= 1}
            className="rounded-lg p-2 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)] disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-xs text-[var(--cosmic-star-dim)] font-mono">
            {filter.page} / {data.totalPages}
          </span>
          <button
            onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
            disabled={filter.page >= data.totalPages}
            className="rounded-lg p-2 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)] disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Metadata edit panel */}
      {editing && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] shadow-2xl p-6 hud-corners">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--cosmic-text-primary)]">File Metadata</h3>
              <button onClick={() => setEditing(null)} className="text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-text-primary)]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              {editing.type === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.url} alt={editing.filename} className="w-full h-32 object-cover rounded-lg" />
              )}
              <AdminFormField label="Title">
                <input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
              </AdminFormField>
              <AdminFormField label="Description">
                <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)] resize-none" />
              </AdminFormField>
              <AdminFormField label="Tags">
                <div className="flex gap-2 mb-2 flex-wrap">
                  {editing.tags?.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[var(--cosmic-accent-cyan)]/10 px-2.5 py-0.5 text-xs text-[var(--cosmic-accent-cyan)]">
                      {t}
                      <button onClick={() => setEditing({ ...editing, tags: editing.tags.filter((x) => x !== t) })}><X className="h-3 w-3 hover:text-red-400" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tagInput.trim()) { setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] }); setTagInput(""); } } }} placeholder="Add tag..." className="flex-1 rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-xs text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
                  <button onClick={() => { if (tagInput.trim()) { setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] }); setTagInput(""); } }} className="rounded-lg bg-[var(--cosmic-accent-cyan)]/10 px-3 py-2 text-xs text-[var(--cosmic-accent-cyan)]">Add</button>
                </div>
              </AdminFormField>
              <button onClick={handleSaveMeta} className="w-full rounded-lg bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
                Save Metadata
              </button>
            </div>
          </div>
        </>
      )}

      <AdminConfirmDialog
        open={!!deleteTargets}
        title="Delete Files"
        message={`Permanently delete ${deleteTargets?.length || 0} file(s)? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargets(null)}
      />
    </div>
  );
}
